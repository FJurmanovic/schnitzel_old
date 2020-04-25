import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import {connect, dispatch} from 'react-redux';
import {Link} from 'react-router-dom';

import axios from 'axios';

import {userData, getHomePosts, getUser, getPosts} from '../classes/callAPI';

import { UNSET_POSTED } from "../../actions";


class Posts extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            posts: [],
            postUsernames: [],
            last: false
         };
    }

    getPostss(user, current, fit, lastDate, lastId){
      return axios
      .get('http://localhost:4000/post/scroll', { headers : {token: user }, params: {current: current, fit: fit, lastDate: lastDate, lastId: lastId}})
      .then(res => {
          console.log(res.data);
          let posts = res.data.post;
          let postList = this.state.posts;
    
          Object.keys(posts).forEach((key) => (
          postList.push(posts[key])
          ))

          let lastPost = postList[postList.length-1];

          console.log(lastPost)

          this.setState({posts: postList, lastPost: postList[postList.length-1]})
    
          if(!res.data.last){
              this.getPostss(user, current, fit, lastPost.createdAt, lastPost._id);
              console.log("Last Date: " + lastPost.createdAt + ", Last User: " + lastPost._id)
          }
    
          return res;
      })
      .catch(error => {console.log(error)})
    }

    getPosts(){
      /*getHomePosts(localStorage.jwtToken).then((res) => {
          let posts = res.data;
          let postList = [];

          Object.keys(posts).forEach((key) => (
            postList.push(posts[key])
        ))

        this.setState({posts: postList, lastPost: postList[postList.length-1]})
      });*/

      if(this.state.lastPost && this.state.lastPost){ 
        this.getPostss(localStorage.jwtToken, 0, 10, this.props.post.post[this.props.post.post.length].createdAt, this.props.post.post[this.props.post.post.userId]);
        console.log("Ovo")
      }else{
        this.getPostss(localStorage.jwtToken, 0, 10, '', '')
        console.log("Ono")
      }
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
            const token = jwt_decode(localStorage.jwtToken).user.id
            
            this.getPosts();
            console.log(token)
            this.setState({
              userdata: this.props.auth,
              token: localStorage.jwtToken
            });
        }
    }

    componentWillReceiveProps(props) {
      console.log(props.post.isPosted)
      if (!props.auth.isAuthenticated) {
          this.props.history.push("/");
      } else {
          const { user } = props.auth;
          const post  = props.post.isPosted;
          this.setState({
          userdata: user,
          isPosted: post,
          token: localStorage.jwtToken
          })
          if(post){
            this.getPosts()
          }
      }

      if (props.errors) {
          this.setState({
          err: props.err
          });
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

    render() {

      
      
      return(
      <div className="posts">
        { this.state.posts.map((post, key) => {
            return (<React.Fragment key={key}><div className="post">
              <h3>{post.title}</h3>
              <div>{post.content}</div>
              <div>Author: <Link to={location => `/${post.username}`}>{post.username}</Link></div>
              <div>Posted on: {this.formatDate(post.createdAt)}</div>
            </div>
            <hr /></React.Fragment>
            )
        })
        }

      </div>
      );
    }
}

Posts.propTypes = {
    err: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    err: state.err,
    auth: state.auth,
    post: state.post
  });
  
  export default connect(
    mapStateToProps
  )(Posts);