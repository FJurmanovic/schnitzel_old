import React, { Component } from 'react';

import { Link, withRouter } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from 'react-redux';

import axios from 'axios';

import { userData, dataByUsername, followUser, unfollowUser } from '../classes/callAPI';


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
            userdata: {}
        };
        this.handleScroll = this.handleScroll.bind(this);
        this.handleFollowButton = this.handleFollowButton.bind(this);
        this.handleUnfollowButton = this.handleUnfollowButton.bind(this);
        this.addFollower = this.addFollower.bind(this);
        this.checkFollowing = this.checkFollowing.bind(this);
      }

      getPosts(user, fit, lastDate, lastId){
  
        return axios
        .get('api/post/scrollProfile', { params: {userId: user, fit: fit, lastDate: lastDate, lastId: lastId}})
        .then(res => {
            console.log(res.data);
            let posts = res.data.post;
            let postList = this.state.posts;
      
            Object.keys(posts).forEach((key) => (
            postList.push(posts[key])
            ))
  
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
        
        flw.following.push({"userId": userId})

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

      componentDidMount() {
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
                  id: user.id
                });
                this.getPosts(user.id, 10, '', '')
              }else{
                this.setState({
                  token: localStorage.jwtToken
                });
              }
            }else{
              dataByUsername(id).then((res)=>{
                this.getPosts(res.data.id, 10, '', '')
                this.setState({
                  id: res.data.id
                })
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
        
        window.addEventListener("scroll", this.handleScroll);
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
                  id: user.id
                });
                this.getPosts(user.id, 10, '', '')
              }else{
                this.setState({
                  token: localStorage.jwtToken
                });
              }
            } else {
              this.setState({
                userdata: user,
                username: user.username
              })
            }
        }
    
        if (props.errors) {
          this.setState({
            err: props.err
          });
        }
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
        console.log(following)
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
      
      showPosts() {
        return(
          <div className="posts">
            { this.state.posts.map((post, key) => {
                return (
                <React.Fragment key={key}>
                  <div className="post">
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

        unfollowUser(this.state.token, this.state.id).then(res => {
          this.removeFollower(this.state.id)
        })
      }

      handleFollowButton(event) {
        event.preventDefault();

        followUser(this.state.token, this.state.id).then(res =>
          {
            this.addFollower(this.state.id)
          }
        )
      }
    
      render() {
        return (
          <div onScroll={this.handleScroll}>
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
                  ? <button onClick={this.handleUnfollowButton}>Unfollow</button>
                  : <button onClick={this.handleFollowButton}>Follow</button>
                  }
                </div>

                <div>
                  <h1>{this.state.profileId}</h1>
                  {this.showPosts()}
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
