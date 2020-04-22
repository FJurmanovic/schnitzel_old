import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

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
            this.props.history.push("../");
        } else {
            const token = jwt_decode(localStorage.jwtToken).user.id
            
            console.log(token)
            userData(localStorage.jwtToken).then((res) => {
              this.setState({
                userdata: res.data,
                token: localStorage.jwtToken
              });
            });

            getHomePosts(localStorage.jwtToken).then((res) => {
                let posts = res.data;
                let postList = [];

                Object.keys(posts).map((key) => (
                  postList.push(posts[key])
               ))

               this.setState({posts: postList})
            });
            //const { user } = this.state.user;
            /*this.setState({
                id: user["_id"],
                userVal: user.username,
                emailVal: user.email,
                passVal: '',
                token: localStorage.jwtToken,
                deactivate: false,
            });*/
        }
    }

    render() {

      
      
      return(
      <div className="posts">
        { this.state.posts.map((post, key) => {
            return (<React.Fragment key={key}><div className="post">
              <h3>{post.title}</h3>
              <div>{post.content}</div>
              <div>Author: {post.username}</div>
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
    err: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    err: state.err
  });
  
  export default connect(
    mapStateToProps
  )(Posts);