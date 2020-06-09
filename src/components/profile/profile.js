import React, { Component } from 'react';

import { Link, withRouter } from "react-router-dom";

import {Post} from '../../elements/post';

import PropTypes from "prop-types";
import { connect } from 'react-redux';

import FollowerScreen from './followerscreen';

import {Image} from 'cloudinary-react';

import { removePost, dataByUsername, followUser, unfollowUser, getHostname, getFollowUsernames, getPostsProfile, addPoint, removePoint } from '../classes/callAPI';


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = 
        {
            posts: [],
            userVal: '',
            emailVal: '',
            passVal: '',
            err: {},
            last: false,
            end: false,
            id: '',
            isPrivate: false,
            userdata: {},
            flw: {
              followers: [],
              following: []
            },
            showFollowers: false,
            showFollowing: false
        };
        this.handleScroll = this.handleScroll.bind(this);
        this.handleNewPosts = this.handleNewPosts.bind(this);
        this.handleFollowButton = this.handleFollowButton.bind(this);
        this.handleUnfollowButton = this.handleUnfollowButton.bind(this);
        this.addFollower = this.addFollower.bind(this);
        this.checkFollowing = this.checkFollowing.bind(this);
        this.removeFromFollower = this.removeFromFollower.bind(this);
        this.removeFromFollowing = this.removeFromFollowing.bind(this);
        this.addPoint = this.addPoint.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.exitScreen = this.exitScreen.bind(this);
      }

      getPosts(user, fit, lastDate, lastId){
        if(!this.state.end){
          getPostsProfile(user, fit, lastDate, lastId).then((res) => {
            if(!res.data.end){
              let posts = res.data.post;
              let postList = this.state.posts;
              
              if((lastDate == '' && lastId == '' && !this.state.posts[0]) || (lastDate != '' && lastId != '' && this.state.posts[0])){
                Object.keys(posts).forEach((key) => (
                  postList.push(posts[key])
                ))
              }

              let lastPost = postList[postList.length-1];
    
              this.setState({posts: postList, lastPost: lastPost, last: res.data.last})
        
              /*
              if(!res.data.last){
                  this.getPostss(user, current, fit, lastPost.createdAt, lastPost._id);
                  console.log("Last Date: " + lastPost.createdAt + ", Last User: " + lastPost._id)
              }*/
            }else{
              this.setState({end: true});
            }
              return res;
              
          })
          .catch(error => {console.log(error)})
        }
      }

      addFollower(userId){
        let { user } = this.props.auth
        let flw = {
          following: [],
          followers: []
        }
        flw.following = user.following;
        flw.followers = user.followers;
        
        flw.following.push({"userId": userId, "username": this.state.userdata.username})

        user.followers = flw.followers;
        user.following = flw.following;

        this.setState(
          {
            userdata: user
          }
        )
      }

      removeFollower(userId){
        let { user } = this.props.auth
        let flw = {
          following: [],
          followers: []
        }
        flw.following = user.following;
        flw.followers = user.followers;

        //console.log(flw.following)

        flw.following.splice(flw.following.findIndex(x => x.userId == userId), 1)

        //console.log(flw.following)

        user.followers = flw.followers;
        user.following = flw.following;

        this.setState(
          {
            userdata: user
          }
        )
      }

      removeFromPost(id){
        let { posts } = this.state

        posts.splice(posts.findIndex(x => x.id == id), 1)

        this.setState(
          {
            posts: posts
          }
        )
      }

      removeFromFollowerState(userId){
        let { flw } = this.state

        flw.followers.splice(flw.following.findIndex(x => x.userId == userId), 1)

        this.setState(
          {
            flw: flw
          }
        )
      }

      addToFollowerState(userId){
        let { flw } = this.state

        flw.followers.push({"userId": userId, "username": this.state.userdata.username})

        this.setState(
          {
            flw: flw
          }
        )
      }

      componentWillMount() {
        let isAuthenticated = false;
        if (localStorage.jwtToken) {
          isAuthenticated = true;
        }

        if (!isAuthenticated) { 
            this.props.history.push("/");
        } else {
            const { user } = this.props.auth

            const id = this.props.match.params.profileId; 

            if(this.props.match.path != 'post/:postId/1' && (!this.state.posts.length > 0  || id != this.state.profileId)){
              if(!id){
                  if(!(!user)){
                    this.setState({
                      end: false,
                      userdata: user,
                      username: user.username,
                      token: localStorage.jwtToken,
                      profileId: user.username,
                      posts: [],
                      flw: {
                        followers: user.followers,
                        following: user.following
                      },
                      id: user.id,
                      validProfile: true
                    });
                    if(user.id){
                      this.getPosts(user.id, 10, '', '')
                    }
                  }else{
                    this.setState({
                      token: localStorage.jwtToken,
                      end: false,
                    });
                  }
                }else{
                  dataByUsername(id).then((res)=>{
                    if(res.data.type == "fetch"){
                      this.setState({
                        validProfile: false,
                      })
                    }
                    if(res.data.id){
                      this.getPosts(res.data.id, 10, '', '')
                      getFollowUsernames(res.data.id).then((ress) => {
                        let followers = ress.data.followers || [];
                        let following = ress.data.following || [];
    
                        followers = followers.filter(x => x != null).filter(x => 'userId' in x).filter(x => 'username' in x) 
                        following = following.filter(x => x != null).filter(x => 'userId' in x).filter(x => 'username' in x) 
                        this.setState({
                          id: res.data.id,
                          hasPhoto: res.data.hasPhoto,
                          photoExt: res.data.photoExt,
                          end: false,
                          isPrivate: res.data.isPrivate,
                          flw: {
                            followers: followers,
                            following: following
                          },
                          validProfile: true
                        })
                      })
                    }
                  });
                  this.setState({
                    userdata: user,
                    username: user.username,
                    token: localStorage.jwtToken,
                    posts: [],
                    profileId: id,
                    end: false,
                  });
                }
              }
            }
        
      }
    
      componentWillReceiveProps(props) {
        if (!props.auth.isAuthenticated) {
            props.history.push("/");
        } else{
            const { user } = props.auth
            const id = props.match.params.profileId;   

            if(this.state.profileId != user.username && !id && props.match.path != '/post/:postId/1'){
              this.setState({
                end: false,
                userdata: user,
                username: user.username,
                token: localStorage.jwtToken,
                profileId: user.username,
                posts: [],
                flw: {
                  followers: user.followers,
                  following: user.following
                },
                id: user.id,
                hasPhoto: user.hasPhoto,
                photoExt: user.photoExt,
              });
              if(user.id){
                this.getPosts(user.id, 10, '', '')
              }
            }
            //console.log(props.match.path != '/post/:postId/1' && (!this.state.posts.length > 0  || id != this.state.profileId ) || this.state.profileId == undefined)


            if(props.match.path != '/post/:postId/1' && (this.state.posts.length < 1  || (id != this.state.profileId && id != undefined)) || this.state.profileId == undefined){
            if(!id){
              if(!!user){
                this.setState({
                  end: false,
                  userdata: user,
                  username: user.username,
                  token: localStorage.jwtToken,
                  profileId: user.username,
                  posts: [],
                  flw: {
                    followers: user.followers,
                    following: user.following
                  },
                  id: user.id,
                  hasPhoto: user.hasPhoto,
                  photoExt: user.photoExt,
                });
                if(user.id){
                  this.getPosts(user.id, 10, '', '')
                }
              }else{
                this.setState({
                  token: localStorage.jwtToken
                });
              }
            } else {
              dataByUsername(id).then((res)=>{
                if(res.data.type == "fetch"){
                  this.setState({
                    validProfile: false,
                  })
                }
                if(res.data.id){
                  this.getPosts(res.data.id, 10, '', '')
                  getFollowUsernames(res.data.id).then((ress) => {
                    let followers = ress.data.followers || [];
                    let following = ress.data.following || [];

                    followers = followers.filter(x => x != null).filter(x => 'userId' in x).filter(x => 'username' in x) 
                    following = following.filter(x => x != null).filter(x => 'userId' in x).filter(x => 'username' in x) 

                    this.setState({
                      end: false,
                      id: res.data.id,
                      hasPhoto: res.data.hasPhoto,
                      photoExt: res.data.photoExt,
                      isPrivate: res.data.isPrivate,
                      flw: {
                        followers: followers,
                        following: following
                      }
                    })
                  })
                }
              });
              this.setState({
                end: false,
                userdata: user,
                username: user.username,
                token: localStorage.jwtToken,
                posts: [],
                profileId: id
              });
            }
          }
        }
    
        if (props.errors) {
          this.setState({
            err: props.err
          });
        }
      }

      componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
      }

      componentWillUnmount() {
          window.removeEventListener("scroll", this.handleScroll);
      }

      componentDidUpdate(prevProps) {
        let isFollowing = null

        if (!!this.state.userdata.following) { isFollowing = this.state.userdata.following.filter(x => x.userId == this.state.id).map(x => x.userId == this.state.id)[0] || false }
        
        if(!!this.state.userdata.following && !!this.props.location.search && ((this.props.location.search == "?action=follow" && !isFollowing) || (this.props.location.search == "?action=unfollow" && isFollowing))){
          if (this.props.location.search == "?action=follow" && isFollowing === false){
            this.handleFollowButton()
          }else if (this.props.location.search == "?action=unfollow" && isFollowing === true){
            this.handleUnfollowButton()
          }
          
          this.props.history.push(this.props.location.pathname)
        }

      }

      handleNewPosts() {
        if(!this.state.last && !!this.state.lastPost){
          this.getPosts(this.state.id, 10, this.state.lastPost.createdAt, this.state.lastPost.id);
        }
      }

      handleScroll() {
        event.preventDefault();
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight) {
          this.handleNewPosts()
        }
      }

      formatDate(datetime, type) {
        let date = datetime.split("T")
        date[1] = date[1].replace("Z", "")
        date[1] = date[1].split(".")[0]
  
        switch(type){
          case "date":
            return date[0];
            break;
          case "time":
            return date[1];
            break;
          default:
            return (date[0] + " " + date[1]);
        }
      }

      checkFollowing() {
        let following = [];
        let userd = this.props.auth.user || ''
        following = this.state.flw.followers;
        let isFollowing = false;
        if(!(!following)){
          following.map((user) => {
            if(user.userId == userd.id){
              isFollowing = true;
              //console.log(user.userId)
            }
          });
        }
        //console.log(isFollowing);
        return isFollowing;
      }

      deletePost(postId) {
        removePost(this.state.token, postId).then((res) => {
          this.removeFromPost(postId)
        })
      }

      handleUnfollowButton(event) {
        if (!!event) event.preventDefault();

        console.log("w")

        unfollowUser(this.state.userdata.id, this.state.id).then(res => {
          this.removeFollower(this.state.id)
          this.removeFromFollowerState(this.state.id)
        })
      }

      handleFollowButton(event) {
        if (!!event) event.preventDefault();

        followUser(this.state.userdata.id, this.state.id).then(res =>
          {
            this.addFollower(this.state.id)
            this.addToFollowerState(this.state.id)
          }
        )
      }


      removeFromFollower(id) {
        event.preventDefault()
        unfollowUser(id, this.state.userdata.id).then(res => {
          this.removeFromFollowerState(id)
        })
      }

      removeFromFollowing(id) {
        event.preventDefault()
        unfollowUser(this.state.userdata.id, id).then(res => {
          this.removeFollower(id)
        })
      }

      showFollowers() {
        const followers = this.state.flw.followers || []
        return(
          <div className="followers">
            { followers.map((follower, key) => {
                return (
                  <React.Fragment key={key}>
                    <li><Link to={location => `/${follower.username}`}>{follower.username}</Link> {(this.state.profileId == this.state.userdata.username || this.state.profileId == undefined) && <span><a href="#" onClick={() => this.removeFromFollower(follower.userId)}>Remove follower</a></span>}</li>
                  </React.Fragment>
                )
              })
            }
          </div>
        );
      }

      showFollowing() {
        const following = this.state.flw.following || []
        return(
          <div className="following">
            { following.map((follower, key) => {
                return (
                  <React.Fragment key={key}>
                    <li><Link to={location => `/${follower.username}`}>{follower.username}</Link> {(this.state.profileId == this.state.userdata.username || this.state.profileId == undefined) && <span><a href="#" onClick={() => this.removeFromFollowing(follower.userId)}>Remove following</a></span>}</li>
                  </React.Fragment>
                )
              })
            }
          </div>
        );
      }

      addPoint (e, id) {
        e.preventDefault();
  
        let { posts } = this.state;
  
        if(!posts[id]["isPointed"]){
          posts[id]["isPointed"] = true;
          posts[id]["points"].push({"userId": this.state.userdata.id})
  
          addPoint(this.state.token, posts[id].id, "post");
          this.setState({posts: posts})
        }else{
          posts[id]["isPointed"] = false;
          posts[id]["points"].splice(posts[id]["points"].findIndex(x => x.userId == this.state.userdata.id), 1)
  
          removePoint(this.state.token, posts[id].id, "post");
          this.setState({posts: posts})
        }
        
      }

      exitScreen(e) {
        e.preventDefault()

        this.setState({
          showFollowers: false,
          showFollowing: false
        })
      }

      render() {

        return (
          <>
          {this.state.validProfile ? 
          <div onScroll={this.handleScroll}>
            <div>
              <div className="profile-image mx-auto text-center">{this.state.hasPhoto ? <Image cloudName="dj7ju136o" className="card-img-top"  publicId={`avatar/${this.state.id}/${this.state.id}${this.state.photoExt}`} /> : <Image cloudName="dj7ju136o" className="card-img-top"  publicId={`default_dnqwla.jpg`} />}</div>
              <div className="mx-auto text-center">
                <ul className="d-inline-block m-3 text-left">
                  <button className="btn btn-blue-transparent btn-rounder border-blue d-inline-block" onClick={() => this.setState({showFollowers: true})}>Followers</button>
                  {this.state.showFollowers && <FollowerScreen title="Followers" list={this.state.flw.followers} owner={(this.state.profileId == this.state.userdata.username || this.state.profileId == undefined)} exitScreen={this.exitScreen.bind(this)} removeFromFollower={this.removeFromFollower.bind(this)} />}
                </ul>
                <ul className="d-inline-block m-3 text-left">
                  <button className="btn btn-blue-transparent btn-rounder border-blue" onClick={() => this.setState({showFollowing: true})}>Following</button>
                  {this.state.showFollowing && <FollowerScreen title="Following" list={this.state.flw.following} owner={(this.state.profileId == this.state.userdata.username || this.state.profileId == undefined)} exitScreen={this.exitScreen.bind(this)} removeFromFollowing={this.removeFromFollowing.bind(this)}/>}
                </ul>
              </div>
            </div>
            {(this.state.profileId == this.state.userdata.username || this.state.profileId == undefined)
            ? <>
                <Link to="/profile/edit">
                  Edit profile
                </Link>
                <div>
                  <h1 className="text-center">Your posts</h1>
                  <div className="posts" onScroll={this.handleScroll}>
                    { this.state.posts.map((post, key) => {
                        return (
                          <Post history={this.props.history} post={post} key={key} iter={key} userdata={this.state.userdata} formatDate={this.formatDate} addPoint={(e) => this.addPoint(e, key)}  authUser={this.props.auth.user.id} from="profile" />
                        )
                      })
                    }{ this.state.end ? <div className="text-center f2 mb-8">There are no more posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div> : <div className="text-center f2 mb-8"><button className="btn btn-blue btn-squared p-4" onClick={this.handleScroll}>Load more posts</button></div>}
                  </div>
                </div>
              </>
            : <>
                <div>
                  {this.checkFollowing()
                  ? <>
                      <div className="mx-auto text-center">
                        <button className="btn btn-orange btn-rounder px-11 folbtn" onClick={this.handleUnfollowButton}>Unfollow</button>
                      </div>
                      <div>
                        <h1 className="text-center">{this.state.profileId}</h1>
                        <div className="posts" onScroll={this.handleScroll}>
                          { this.state.posts.map((post, key) => {
                              return (
                                <Post history={this.props.history} post={post} key={key} iter={key} userdata={this.state.userdata} formatDate={this.formatDate} addPoint={(e) => this.addPoint(e, key)}  authUser={this.props.auth.user.id} from="profile" />
                              )
                            })
                          }
                          { this.state.end ? <div className="text-center f2 mb-8">There are no more posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div> : <div className="text-center f2 mb-8"><button className="btn btn-blue btn-squared p-4" onClick={this.handleNewPosts}>Load more posts</button></div>}
                        </div>
                      </div>
                    </>
                  : <>
                      <div className="mx-auto text-center">
                        <button className="btn btn-lightgreen btn-rounder folbtn" onClick={this.handleFollowButton}>Follow</button>
                      </div>
                      <div>
                        <h1 className="text-center">{this.state.profileId}</h1>
                        {!(this.state.isPrivate) &&
                          <div className="posts" onScroll={this.handleScroll}>
                          { this.state.posts.map((post, key) => {
                              return (
                                <Post history={this.props.history} post={post} key={key} iter={key} userdata={this.state.userdata} formatDate={this.formatDate} addPoint={(e) => this.addPoint(e, key)}  authUser={this.props.auth.user.id} from="profile" />
                              )
                            })
                          }{ this.state.end ? <div className="text-center f2 mb-8">There are no more posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div> : <div className="text-center f2 mb-8"><button className="btn btn-blue btn-squared p-4" onClick={this.handleNewPosts}>Load more posts</button></div>}
                        </div>
                        }
                      </div>
                    </>
                  }
                </div>

                
              </>
            }
          </div>
          : <div>User could not be found.</div>
        }</>
        );
      }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired
};
  
  const mapStateToProps = state => ({
      auth: state.auth
  });
  
  export default withRouter(connect(mapStateToProps)(Profile));
