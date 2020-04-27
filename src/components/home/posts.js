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
        this.handleScroll = this.handleScroll.bind(this);
    }

    getPosts(user, current, fit, lastDate, lastId){
      /*getHomePosts(localStorage.jwtToken).then((res) => {
          let posts = res.data;
          let postList = [];

          Object.keys(posts).forEach((key) => (
            postList.push(posts[key])
        ))

        this.setState({posts: postList, lastPost: postList[postList.length-1]})
      });*/

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

          //console.log(lastPost)

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
            
            
            this.getPosts(localStorage.jwtToken, 0, 10, '', '')
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
          
          if(post){ 
            this.setState({
            userdata: user,
            isPosted: post,
            token: localStorage.jwtToken,
            posts: []
            })    
            this.getPosts(localStorage.jwtToken, 0, 10, '', '')
          }
          else{
            this.setState({
              userdata: user,
              isPosted: post,
              token: localStorage.jwtToken
              })
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

    handleScroll(event) {
      const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      const windowBottom = windowHeight + window.pageYOffset;
      if (windowBottom >= docHeight) {
        if(!this.state.last){
          this.getPosts(localStorage.jwtToken, 0, 10, this.state.lastPost.createdAt, this.state.lastPost.id);
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

    render() {

      
      
      return(
      <div className="posts" onScroll={this.handleScroll}>
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