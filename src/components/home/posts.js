import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {userData, getHomePosts, getUser} from '../classes/callAPI';

class Posts extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            posts: [],
            postUsernames: []
         };
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
            
            console.log(token)
            this.setState({
              userdata: this.props.auth,
              token: localStorage.jwtToken
            });

            getHomePosts(localStorage.jwtToken).then((res) => {
                let posts = res.data;
                let postList = [];

                Object.keys(posts).map((key) => (
                  postList.push(posts[key])
               ))

               this.setState({posts: postList})
            });
        }
    }

    componentWillReceiveProps(props) {
      if (!props.auth.isAuthenticated) {
          this.props.history.push("/");
      } else {
          const { user } = props.auth;
          this.setState({
          userdata: user,
          token: localStorage.jwtToken
          })
      }

      if (props.errors) {
          this.setState({
          err: props.err
          });
      }
  }

    render() {

      
      
      return(
      <div className="posts">
        { this.state.posts.map((post, key) => {
            return (<React.Fragment key={key}><div className="post">
              <h3>{post.title}</h3>
              <div>{post.content}</div>
              <div>Author: <Link to="/{post.username}">{post.username}</Link></div>
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
    auth: state.auth
  });
  
  export default connect(
    mapStateToProps
  )(Posts);