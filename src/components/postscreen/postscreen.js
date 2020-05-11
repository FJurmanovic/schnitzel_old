import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';

import Comment from './comment';

import PropTypes from "prop-types";
import { connect } from 'react-redux';

import {getPostById, newComment, addPointToComment, removePointToComment} from '../classes/callAPI';

import './postscreen.scss';


class Postscreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            post: {}
         };

         
        this.goBack = this.goBack.bind(this);
        this.stayHere = this.stayHere.bind(this);
        this.addPoint = this.addPoint.bind(this);
    }

    componentWillReceiveProps(props) {
        if (!props.auth.isAuthenticated) {
            this.props.history.push("/");
        } else {
            const { user } = props.auth;
            const comment = props.post.isCommented;

            if(comment){
                this.setState({
                    userdata: user,
                    isCommented: comment,
                    token: localStorage.jwtToken,
                    post: {}
                }) 
                getPostById(localStorage.jwtToken, this.props.match.params.postId).then(res => {
                    this.setState({post: res.data.post})
                    });
            } else {
                this.setState({
                    userdata: user,
                    token: localStorage.jwtToken,
                    post: {}
                }) 
            }
               
            
        }
    }

    componentWillMount(){
        document.body.style.overflow = "hidden";

        let isAuthenticated = false;
        if (localStorage.jwtToken) {
          isAuthenticated = true;
        }

        if (!isAuthenticated) { 
            this.props.history.push("/");
        } else {
            getPostById(localStorage.jwtToken, this.props.match.params.postId).then(res => {
                this.setState({post: res.data.post})
              });
            this.setState({
              userdata: this.props.auth,
              token: localStorage.jwtToken
            });
        }
    }

    componentWillUnmount(){
        document.body.style.overflow = "visible";
    }

    goBack(){
        this.props.history.goBack();
    }

    stayHere(event){
        event.stopPropagation();
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
        
        console.log("this")

        let { post } = this.state
        let { comments } = this.state.post;
  
        if(!comments[id]["isPointed"]){
            comments[id]["isPointed"] = true;
            comments[id]["points"].push({"userId": this.state.userdata.id})
          addPointToComment(this.state.token, post.id, "comment", comments[id].id);
          post["comments"] = comments;
          this.setState({post: post})
        }else{
            comments[id]["isPointed"] = false;
            comments[id]["points"].splice(comments[id]["points"].findIndex(x => x.userId == this.state.userdata.id), 1)
          removePointToComment(this.state.token, post.id, "comment", comments[id].id);
          post["comments"] = comments;
          this.setState({post: post})
        }
        
      }

    render() {
        return (
            <>
                <div className='overlay' onClick={this.goBack}>
                    <div className='poston' onClick={this.stayHere}>
                        <Link to='/'>Back</Link>
                        {this.state.post.type == "post" &&
                            <div className="post">
                            {(this.state.userdata.id == this.state.post.userId || this.props.auth.user.id == this.state.post.userId) && <div><a href="">Delete post</a></div>}
                            <h3>{this.state.post.title}</h3>
                            <div>{this.state.post.description}</div>
                            <div>Author: <span></span>
                                {this.state.post.username == "DeletedUser" 
                                ? <span>DeletedUser</span>
                                : <Link to={location => `/${this.state.post.username}`}>{this.state.post.username}</Link>
                                }
                            </div>
                            <div>Posted on: {this.formatDate(this.state.post.createdAt)}</div>
                            <hr />
                            <Comment 
                                postId = {this.state.post.id}
                            />
                            {this.state.post.comments.map((comment, k) => {
                                return <React.Fragment key={k}>
                                    <div>{comment.comment}</div>
                                    <div>Author: <span></span>
                                        {comment.username == "DeletedUser" 
                                        ? <span>DeletedUser</span>
                                        : <Link to={location => `/${comment.username}`}>{comment.username}</Link>
                                        }
                                    </div>
                                    <div>Points: {comment.points.length} <button onClick={(e) => this.addPoint(e, k)}>^</button></div>
                                </React.Fragment>  
                            })}
                            </div>
                            }
                            {this.state.post.type == "recipe" &&
                            <div className="post">
                            {(this.state.userdata.id == this.state.post.userId || this.props.auth.user.id == this.state.post.userId) && <div><a href="">Delete post</a></div>}
                            <h3>{this.state.post.title}</h3>
                            <div>{this.state.post.description}</div>
                            <div>{this.state.post.ingredients.map((ingredient, j) => {
                                return <React.Fragment key={j}>
                                <span>{ingredient.name}</span><span>{ingredient.value}</span><span>{ingredient.unit}</span>
                                </React.Fragment>
                                })}
                            </div>
                            <div>{this.state.post.directions}</div>
                            <div>Author: <span></span>
                                {this.state.post.username == "DeletedUser" 
                                ? <span>DeletedUser</span>
                                : <Link to={location => `/${this.state.post.username}`}>{this.state.post.username}</Link>
                                }
                            </div>
                            <div>Posted on: {this.formatDate(this.state.post.createdAt)}</div>
                            <hr />
                            {this.state.post.comments.map((comment, k) => {
                                return <React.Fragment key={k}>
                                    <div>{comment.comment}</div>
                                    <div>Author: <span></span>
                                        {comment.username == "DeletedUser" 
                                        ? <span>DeletedUser</span>
                                        : <Link to={location => `/${comment.username}`}>{comment.username}</Link>
                                        }
                                    </div>
                                    <div>Points: {comment.points.length} <button onClick={(e) => this.addPoint(e, k)}>^</button></div>
                                </React.Fragment>  
                            })}
                            </div>
                            }
                    </div>
                </div>
                
                
            </>
        );
    }
}

Postscreen.propTypes = {
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    auth: state.auth,
    post: state.post
});

export default withRouter(connect(mapStateToProps)(Postscreen));
