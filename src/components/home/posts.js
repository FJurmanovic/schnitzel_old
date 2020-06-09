import React from 'react';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';


import {Post} from '../../elements/post.js';

import axios from 'axios';

import { getHostname, addPoint, removePoint} from '../classes/callAPI';



class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            posts: [],
            postUsernames: [],
            last: false,
            postFetching: false
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
      //console.log(!this.state.end || this.props.post.isPosted)
      if(!this.state.end || this.props.post.isPosted){
        return axios
        .get(getHostname() + 'api/post/scroll', { headers : {token: user }, params: {current: current, fit: fit, lastDate: lastDate, lastId: lastId}})
        .then(res => {
            //console.log(res.data);

            if(!res.data.end){
              let posts = res.data.post;
              let postList = this.state.posts;
        
              Object.keys(posts).forEach((key) => (
              postList.push(posts[key])
              ))

              let lastPost = postList[postList.length-1];

              //console.log(lastPost)

              this.setState({posts: postList, lastPost: lastPost, last: res.data.last, postsFetching: false})
              /*
              if(!res.data.last){
                  this.getPostss(user, current, fit, lastPost.createdAt, lastPost._id);
                  console.log("Last Date: " + lastPost.createdAt + ", Last User: " + lastPost._id)
              }*/
            }else{
              this.setState({end: true, postsFetching: false})
            }
      
            return res;
        })
        .catch(error => {console.log(error)})
      }
    }
    
    componentWillMount() {
        let isAuthenticated = false;
        if (localStorage.jwtToken) {
          isAuthenticated = true;
          //console.log(isAuthenticated)
        }

        if (!isAuthenticated) { 
            this.props.history.push("/");
        } else {
            const token = jwt_decode(localStorage.jwtToken).user.id
            
            
            this.setState({postsFetching: true}, () => {
              this.getPosts(localStorage.jwtToken, 0, 10, '', '')
            })
            //console.log(token)
            this.setState({
              userdata: this.props.auth.user,
              token: localStorage.jwtToken
            });
        }
    }

    componentWillReceiveProps(props) {
      //console.log(props.post.isPosted)
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
            this.setState({postsFetching: true}, () => {
              this.getPosts(localStorage.jwtToken, 0, 10, '', '')
            })
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

      //console.log(body.offsetHeight)
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

    render() {
      
      return(
        <div className="posts" onScroll={this.handleScroll}>{ this.state.postsFetching 
          ? <>
            <div className="posts-placeholder card col-9 my-6">
              <div className="text-placeholder my-4 mx-1"></div>
              <div className="title-placeholder my-4 mx-1"></div>
              <div className="description-placeholder my-2 mx-1"></div>
              <div className="description-placeholder my-2 mx-1"></div>
              <div className="description-placeholder my-2 mx-1"></div>
            </div>
            <div className="posts-placeholder card col-9 my-6">
              <div className="text-placeholder my-4 mx-1"></div>
              <div className="title-placeholder my-4 mx-1"></div>
              <div className="description-placeholder my-2 mx-1"></div>
              <div className="description-placeholder my-2 mx-1"></div>
              <div className="description-placeholder my-2 mx-1"></div>
            </div>
            </>
          : <>{ this.state.posts.length > 0 
          ? <>
            { this.state.posts.map((post, key) => {
                return (
                  <Post post={post} key={key} iter={key} userdata={this.state.userdata} formatDate={this.formatDate} addPoint={(e) => this.addPoint(e, key)} authUser={this.props.auth.user.id} from="home" />
                )
              })
            }
            { this.state.end ? <div className="text-center f2 mb-8">There are no more posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div> : <div className="text-center f2 mb-8"><button className="btn btn-blue btn-squared p-4" onClick={this.handleScroll}>Load more posts</button></div>}
            </>
          : <div className="text-center f2">There are no posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div>
          }</>
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