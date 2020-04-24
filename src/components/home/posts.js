import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import {connect, dispatch} from 'react-redux';
import {Link} from 'react-router-dom';

import axios from 'axios';

import {userData, getHomePosts, getUser} from '../classes/callAPI';

import { UNSET_POSTED } from "../../actions";

class Posts extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            posts: [],
            postUsernames: []
         };
    }

    getPosts(){
      getHomePosts(localStorage.jwtToken).then((res) => {
          let posts = res.data;
          let postList = [];

          Object.keys(posts).forEach((key) => (
            postList.push(posts[key])
        ))

        this.setState({posts: postList, lastPost: postList[postList.length-1]})
        axios
        .get('http://localhost:4000/post/scroll', { headers : {token: localStorage.jwtToken }, params: {current: 2, fit: 10, lastDate: "2020-04-20T19:25:01.460Z", lastId: "5e9e00b33f678e3f4c0bee0b"}})
        .then(res => {
            console.log(res.data)
        })
        .catch(error => {console.log(error)})
     });
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
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    err: state.err,
    auth: state.auth,
    post: state.post
  });
  
  export default connect(
    mapStateToProps
  )(Posts);