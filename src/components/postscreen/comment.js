import React, { Component } from 'react'


import PropTypes from "prop-types";
import { connect } from 'react-redux';

import {getPostById, newComment} from '../classes/callAPI';

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentVal: '',
            postId: '',
            type: '',
            commentId: '',
            err: {}
        }

        this.handleComment = this.handleComment.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            
            //console.log(token)
            this.setState({
                userdata: this.props.auth.user,
                token: localStorage.jwtToken,
                postId: this.props.postId,
                type: this.props.type || '',
                commentId: this.props.commentId || ''
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

    handleComment(event){
        event.preventDefault();

        this.setState({commentVal: event.target.value})
    }

    handleSubmit(event){
        event.preventDefault();

        if(this.state.type == "comment"){
            const commentObject = {
                comment: this.state.commentVal,
                userId: this.state.userdata.id,
                postId: this.state.postId
            }
    
            this.props.newComment(commentObject, this.props.history);
        } else if (this.state.type == "reply"){
            const replyObject = {
                comment: this.state.commentVal,
                userId: this.state.userdata.id,
                postId: this.state.postId,
                commentId: this.state.commentId
            }

            this.props.newComment(replyObject, this.props.history);
        }

        
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="mb-8">
                <label>New comment: <br />
                    <textarea 
                        onChange={this.handleComment}
                        value={this.state.commentVal}
                        className="width-full"
                    />
                </label>
                <input type="submit" value="Submit" className="btn btn-default btn-squared px-6" />
            </form>
        )
    }
}

Comment.propTypes = {
    err: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    err: state.err,
    auth: state.auth,
    post: state.post
  });
  
  export default connect(
    mapStateToProps,
    { newComment }
  )(Comment);