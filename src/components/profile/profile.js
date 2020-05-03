import React, { Component } from 'react';

import { Link, withRouter } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from 'react-redux';

import axios from 'axios';

import { removePost, dataByUsername, followUser, unfollowUser, getHostname, getFollowUsernames, getPostsProfile } from '../classes/callAPI';


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
            id: '',
            userdata: {},
            flw: {
              followers: [],
              following: []
            }
        };
        this.handleScroll = this.handleScroll.bind(this);
        this.handleFollowButton = this.handleFollowButton.bind(this);
        this.handleUnfollowButton = this.handleUnfollowButton.bind(this);
        this.addFollower = this.addFollower.bind(this);
        this.checkFollowing = this.checkFollowing.bind(this);
        this.removeFromFollower = this.removeFromFollower.bind(this);
        this.removeFromFollowing = this.removeFromFollowing.bind(this);
        this.deletePost = this.deletePost.bind(this);
      }

      getPosts(user, fit, lastDate, lastId){
          getPostsProfile(user, fit, lastDate, lastId).then((res) => {
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
        
              return res;
          })
          .catch(error => {console.log(error)})
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

        console.log(flw.following)

        flw.following.splice(flw.following.findIndex(x => x.userId == userId), 1)

        console.log(flw.following)

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
          console.log(isAuthenticated)
        }

        if (!isAuthenticated) { 
            this.props.history.push("/");
        } else {
            const { user } = this.props.auth

            const id = this.props.match.params.profileId;           

            if(!id){
              if(!(!user)){
                this.setState({
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
                  token: localStorage.jwtToken
                });
              }
            }else{
              dataByUsername(id).then((res)=>{
                if(res.data.id){
                  this.getPosts(res.data.id, 10, '', '')
                  getFollowUsernames(res.data.id).then((ress) => {
                    this.setState({
                      id: res.data.id,
                      flw: {
                        followers: ress.data.followers,
                        following: ress.data.following
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
                profileId: id
              });
            }
          }
        
      }
    
      componentWillReceiveProps(props) {
        if (!props.auth.isAuthenticated) {
            this.props.history.push("/");
        } else{
            const { user } = props.auth
            const id = props.match.params.profileId;     

            if(!id){
              if(!(!user)){
                this.setState({
                  userdata: user,
                  username: user.username,
                  token: localStorage.jwtToken,
                  profileId: user.username,
                  posts: [],
                  flw: {
                    followers: user.followers,
                    following: user.following
                  },
                  id: user.id
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
                if(res.data.id){
                  this.getPosts(res.data.id, 10, '', '')
                  getFollowUsernames(res.data.id).then((ress) => {
                    this.setState({
                      id: res.data.id,
                      flw: {
                        followers: ress.data.followers,
                        following: ress.data.following
                      }
                    })
                  })
                }
              });
              this.setState({
                userdata: user,
                username: user.username,
                token: localStorage.jwtToken,
                posts: [],
                profileId: id
              });
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

      handleScroll() {
        event.preventDefault();
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight) {
          if(!this.state.last){
            console.log("in")
            this.getPosts(this.state.id, 10, this.state.lastPost.createdAt, this.state.lastPost.id);
          }
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
        following = this.state.userdata.following;
        let isFollowing = false;
        if(!(!following)){
          following.map((user) => {
            if(user.userId == this.state.id){
              isFollowing = true;
              console.log(user.userId)
            }
          });
        }
        console.log(isFollowing);
        return isFollowing;
      }

      deletePost(postId) {
        removePost(this.state.token, postId).then((res) => {
          this.removeFromPost(postId)
        })
      }
      
      showPosts() {
        return(
          <div className="posts">
            { this.state.posts.map((post, key) => {
                return (
                <React.Fragment key={key}>
                  <div className="post">
                    {this.state.userdata.id === post.userId && <div><a href="#" onClick={() => this.deletePost(post.id)}>Delete post</a></div>}
                    <h3>{post.title}</h3>
                    <div>{post.content}</div>
                    <div>Author: <Link to={location => `/${post.username}`}>{post.username}</Link></div>
                    <div>Posted on: {this.formatDate(post.createdAt)}</div>
                  </div>
                  <hr />
                </React.Fragment>
                )
              })
            }
          </div>
        );
      }

      handleUnfollowButton(event) {
        event.preventDefault();

        unfollowUser(this.state.userdata.id, this.state.id).then(res => {
          this.removeFollower(this.state.id)
          this.removeFromFollowerState(this.state.id)
        })
      }

      handleFollowButton(event) {
        event.preventDefault();

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

      render() {
        const getFollowers = (
          <>{ !(!this.state.flw.followers) && <>
            { 
              this.state.flw.followers.map((follower, key) => {
                return (
                  <React.Fragment key={key}>
                    <li><Link to={location => `/${follower.username}`}>{follower.username}</Link> {(this.state.profileId == this.state.userdata.username || this.state.profileId == undefined) && <span><a href="#" onClick={() => this.removeFromFollower(follower.userId)}>Remove follower</a></span>}</li>
                  </React.Fragment>
                )
              })
            } </> }
          </>
        )

        const getFollowing = (
          <>{ !(!this.state.flw.following) && <>
            { 
              this.state.flw.following.map((follower, key) => {
                return (
                  <React.Fragment key={key}>
                    <li><Link to={location => `/${follower.username}`}>{follower.username}</Link> {(this.state.profileId == this.state.userdata.username || this.state.profileId == undefined) && <span><a href="#" onClick={() => this.removeFromFollowing(follower.userId)}>Remove following</a></span>}</li>
                  </React.Fragment>
                )
              })
            } </> }
          </>
        )

        return (
          <div onScroll={this.handleScroll}>
            <div>
              <ul>
                <strong>Followers:</strong>
                {getFollowers}
              </ul>
              <ul>
                <strong>Following:</strong>
                {getFollowing}
              </ul>
            </div>
            {(this.state.profileId == this.state.userdata.username || this.state.profileId == undefined)
            ? <>
                <Link to="/profile/edit">
                  Edit profile
                </Link>
                <div>
                  <h1>Your posts: </h1>
                  {this.showPosts()}
                </div>
              </>
            : <>
                <div>
                  {this.checkFollowing()
                  ? <>
                      <button onClick={this.handleUnfollowButton}>Unfollow</button>
                      <div>
                        <h1>{this.state.profileId}</h1>
                        {this.showPosts()}
                      </div>
                    </>
                  : <>
                      <button onClick={this.handleFollowButton}>Follow</button>
                      <div>
                        <h1>{this.state.profileId}</h1>
                      </div>
                    </>
                  }
                </div>

                
              </>
            }
            
          </div>
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
