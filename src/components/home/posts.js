import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import {connect, dispatch} from 'react-redux';
import {Link, Switch, Route, withRouter} from 'react-router-dom';
import Postscreen from '../postscreen/postscreen';


import axios from 'axios';

import {userData, getUser, getPosts, getHostname, addPoint, removePoint} from '../classes/callAPI';

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
        this.addPoint = this.addPoint.bind(this);
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
      .get(getHostname() + 'api/post/scroll', { headers : {token: user }, params: {current: current, fit: fit, lastDate: lastDate, lastId: lastId}})
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

      console.log(body.offsetHeight)
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

    addPoint(e, id) {
      e.preventDefault();

      let { posts } = this.state;

      if(!posts[id]["isPointed"]){
        posts[id]["isPointed"] = true;
        posts[id]["points"].push({"userId": this.state.userdata.id})

        addPoint(this.state.token, posts[id].id);
        this.setState({posts: posts})
      }else{
        posts[id]["isPointed"] = false;
        posts[id]["points"].splice(posts[id]["points"].findIndex(x => x.userId == this.state.userdata.id), 1)
        console.log(posts)

        removePoint(this.state.token, posts[id].id);
        this.setState({posts: posts})
      }
      
    }

    render() {
      
      return(
        <div className="posts" onScroll={this.handleScroll}>
        { this.state.posts.map((post, key) => {
            return (
            <>
            <React.Fragment key={key}>
            <>
            {post.type == "post" &&
              <div className="post">
              {(this.state.userdata.id == post.userId || this.props.auth.user.id == post.userId) && <div><a href="">Delete post</a></div>}
              <h3>{post.title}</h3>
              <div>{post.description}</div>
              <div>Author: <span></span>
                {post.username == "DeletedUser" 
                ? <span>DeletedUser</span>
                : <Link to={location => `/${post.username}`}>{post.username}</Link>
                }
              </div>
              <div>Posted on: {this.formatDate(post.createdAt)}</div>
              <div>Points: {post.points.length} <button onClick={(e) => this.addPoint(e, key)}>^</button></div>
              <div><Link to={location => `/post/${post.id}`}>More</Link></div>
              <hr />
            </div>
            }
            </>
            <>
            {post.type == "recipe" &&
            <div className="post">
              {(this.state.userdata.id == post.userId || this.props.auth.user.id == post.userId) && <div><a href="">Delete post</a></div>}
              <h3>{post.title}</h3>
              <div>{post.description}</div>
              <div>{post.ingredients.map((ingredient, j) => {
                return <React.Fragment key={j}>
                  <span>{ingredient.name}</span><span>{ingredient.value}</span><span>{ingredient.unit}</span>
                </React.Fragment>
                })}
              </div>
              <div>{post.directions}</div>
              <div>Author: <span></span>
                {post.username == "DeletedUser" 
                ? <span>DeletedUser</span>
                : <Link to={location => `/${post.username}`}>{post.username}</Link>
                }
              </div>
              <div>Posted on: {this.formatDate(post.createdAt)}</div>
              <div>Points: {post.points.length} <button onClick={(e) => this.addPoint(e, key)}>^</button></div>
              <div><Link to={location => `/post/${post.id}`}>More</Link></div>
              <hr />
            </div>
            }
            </>
            </React.Fragment>
            </>
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
  
  export default withRouter(connect(
    mapStateToProps
  )(Posts));