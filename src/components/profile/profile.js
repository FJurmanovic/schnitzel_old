import React, { Component } from 'react';

import { Link, withRouter } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from 'react-redux';

import axios from 'axios';

import { userData, dataByUsername } from '../classes/callAPI';


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
            id: ''
        };
        this.handleScroll = this.handleScroll.bind(this);
      }

      getPosts(user, fit, lastDate, lastId){
  
        return axios
        .get('http://localhost:4000/post/scrollProfile', { params: {userId: user, fit: fit, lastDate: lastDate, lastId: lastId}})
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

            dataByUsername(id).then((res)=>{
              this.getPosts(res.data.id, 10, '', '')
              this.setState({
                id: res.data.id
              })
            });

            if(!id){
              this.setState({
                username: user.username,
                token: localStorage.jwtToken,
                profileId: user.username
              });
            }else{
              this.setState({
                username: user.username,
                token: localStorage.jwtToken,
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
            this.setState({
              username: user.username,
              token: localStorage.jwtToken
            });
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
    
      render() {
        return (
          <div onScroll={this.handleScroll}>
            {(this.state.profileId == this.state.username || this.state.profileId == undefined)
            ? <Link to="/profile/edit">
                Edit profile
              </Link>
            : <div>
                <h1>{this.state.profileId}</h1>
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
              </div>
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
