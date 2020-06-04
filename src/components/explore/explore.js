import React from 'react';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import { categories, firstUpper } from '../classes/Functions';

import {Post} from '../../elements/post.js';

import axios from 'axios';

import { getHostname, addPoint, removePoint} from '../classes/callAPI';

class Explore extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            posts: [],
            postUsernames: [],
            last: false,
            end: false,
            category: "",
            path: ""
        };
        this.handleScroll = this.handleScroll.bind(this);
        this.addPoint = this.addPoint.bind(this);
    }

    getPosts(user, current, fit, lastDate, lastId, category, first){
      /*getHomePosts(localStorage.jwtToken).then((res) => {
          let posts = res.data;
          let postList = [];

          Object.keys(posts).forEach((key) => (
            postList.push(posts[key])
        ))

        this.setState({posts: postList, lastPost: postList[postList.length-1]})
      });*/

      //console.log(this.state.posts)

      if(!this.state.end || this.props.post.isPosted || first){
        return axios
        .get(getHostname() + 'api/post/scrollExplore', { headers : {token: user }, params: {current: current, fit: fit, lastDate: lastDate, lastId: lastId, category: category}})
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

              if(lastDate == '' && lastId == ''){
                this.setState({posts: posts, lastPost: lastPost, last: res.data.last})
              }else{
                this.setState({posts: postList, lastPost: lastPost, last: res.data.last})
              }

              if(res.data.post.length < 10){
                this.getPosts(localStorage.jwtToken, 0, 10, res.data.post.createdAt, res.data.post.id, props.match.params.categoryId, true)
              }
              /*
              if(!res.data.last){
                  this.getPostss(user, current, fit, lastPost.createdAt, lastPost._id);
                  console.log("Last Date: " + lastPost.createdAt + ", Last User: " + lastPost._id)
              }*/
            }else{
              this.setState({end: true})
            }
      
            return res;
        })
        .catch(error => {console.log(error)})
      }
    }
    
    componentWillMount() {
      const { props } = this

        let isAuthenticated = false;
        if (localStorage.jwtToken) {
          isAuthenticated = true;
          //console.log(isAuthenticated)
        }

        if (!isAuthenticated) { 
            this.props.history.push("/");
        } else {
            const token = jwt_decode(localStorage.jwtToken).user.id
            const { categoryId } = this.props.match.params
            let { category } = this.state;

            if(!!categoryId) {
                let partOf = categories.includes(categoryId)
                if(partOf){
                    category = categoryId
                    this.getPosts(localStorage.jwtToken, 0, 10, '', '', props.match.params.categoryId, true)
                }else{
                    props.history.push("/explore")
                }
            } else if (props.match.path == "/explore") {
              this.getPosts(localStorage.jwtToken, 0, 10, '', '', "all", true)
            } 
            this.setState({
              userdata: this.props.auth.user,
              token: localStorage.jwtToken
            });
        }
    }

    

    componentDidMount() {
      window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }


    componentDidUpdate(prevProps, prevState) {
      //console.log(props.post.isPosted
      const {props} = this;

      if ((prevProps.match.path !== this.props.match.path || (!!props.match.params.categoryId && (prevProps.match.params.categoryId != props.match.params.categoryId))) && (prevProps.match.path != "/post/:postId/2") || (prevProps.match.path == "/post/:postId/2" && this.state.posts.length < 1 )){
        if (!props.auth.isAuthenticated) {
            this.props.history.push("/");
        } else if(props.match.path != "/post/:postId/2") {
              const { user } = props.auth;
              let { categoryId } = props.match.params;

              
              if(this.state.category != categoryId && this.state.path != props.match.path){
                  this.setState({ 
                      path: "",
                      posts: [],
                      end: false
                  })
              }

              if(!!categoryId) {
                  let partOf = categories.includes(categoryId)
                  if(partOf){
                      //if(this.state.category != categoryId){
                          this.getPosts(localStorage.jwtToken, 0, 10, '', '', props.match.params.categoryId, true)
                      //}
                      this.setState({
                          category: categoryId,
                          path: props.match.path
                      })
                      
                  }else{
                      props.history.push("/explore")
                  }
              } else {
                  this.getPosts(localStorage.jwtToken, 0, 10, '', '', "all", true)
                  this.setState({
                      path: props.match.path
                  })
              }

              
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
    }

    handleScroll(event) {
      const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      const windowBottom = windowHeight + window.pageYOffset;

      if (windowBottom >= docHeight) {
        if(!this.state.last){
          this.getPosts(localStorage.jwtToken, 0, 10, this.state.lastPost.createdAt, this.state.lastPost.id, this.props.match.params.categoryId, false);
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
        const {props} = this;

        return (
            <>
                <div className="d-flex">
                    <div className="d-inline-block mx-auto">
                        <Link className="btn btn-lightgreen btn-rounder mx-1 my-1" to={`/explore`}>All</Link>
                        {categories.map((category, key) => {
                            return <React.Fragment key={key}>
                                <Link className="btn btn-lightgreen btn-rounder mx-1 my-1" to={`/explore/f/${category}`}>{firstUpper(category)}</Link>
                            </React.Fragment>
                        })}
                    </div>
                </div>
                
                <hr />

                <div className="posts" onScroll={this.handleScroll}>
                    { this.state.posts.length > 0 
                    ? <>
                        { this.state.posts.map((post, key) => {
                            return (
                            <Post post={post} key={key} iter={key} userdata={this.state.userdata} formatDate={this.formatDate} addPoint={(e) => this.addPoint(e, key)} authUser={this.props.auth.user.id} from="explore" />
                            )
                        })
                        }
                        { this.state.end ? <div className="text-center f2 mb-8">There are no more posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div> : <div className="text-center f2 mb-8"><button onClick={this.handleScroll} className="btn btn-blue btn-squared p-4">Load more posts</button></div>}
                        </>
                    : <div className="text-center f2">There are no posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div>
                    }
                </div>
            </>
        )
    }
}


Explore.propTypes = {
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
  )(Explore));