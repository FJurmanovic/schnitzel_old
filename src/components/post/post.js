import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {userData, createPost} from '../classes/callAPI';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            titleVal: '',
            contentVal: '',
            err: {}
         };

         
        this.handleTitle = this.handleTitle.bind(this);
        this.handleContent = this.handleContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        }
    }

    componentWillReceiveProps(props) {
        if (!props.auth.isAuthenticated) {
            props.history.push("/");
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

    handleTitle(event){
        event.preventDefault();

        this.setState({titleVal: event.target.value})
    }

    handleContent(event){
        event.preventDefault();

        this.setState({contentVal: event.target.value})
    }

    handleSubmit(event){
        event.preventDefault();

        console.log("Title: " + this.state.titleVal)
        console.log("Content: " + this.state.contentVal)
        console.log("UserId: " + this.state.userdata._id)

        const title = this.state.titleVal
        const content = this.state.contentVal
        const userid = this.state.userdata._id

        if(title.length > 0 && content.length > 0 && userid.length > 0){
            const postObject = {
                title: title,
                content: content,
                userId: userid
            }
    
            this.props.createPost(postObject, this.props.history);

        }else if(!(title.length > 0)){
            console.log("Error: Title is blank")
        }if(!(content.length > 0)){
            console.log("Error: Content is blank")
        }if(!(userid.length > 0)){
            console.log("Error: User is not authenticated")
        }
    }

    render() {
        const { err } = this.state;
        return(
        <form onSubmit={this.handleSubmit}>
            <label>Title:<br />
            <input type="text" value={this.state.titleVal} onChange={this.handleTitle} />
            </label>
            <br />
            <label>Content:<br />
            <textarea 
                onChange={this.handleContent}
                value={this.state.contentVal}
            />
            </label>
            <br />
            <input type="submit" value="Submit" />
        </form>
        );
    }
}

Post.propTypes = {
    err: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    err: state.err,
    auth: state.auth
  });
  
  export default connect(
    mapStateToProps,
    { createPost }
  )(Post);