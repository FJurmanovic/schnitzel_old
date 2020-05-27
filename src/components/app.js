import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

import setAuthToken from '../utils/setAuthToken';
import { setCurrentUser, setUserFollowers, logout, getFollowUsernames } from './classes/callAPI';
import store from './store';

import Home from './home/home';
import Login from './login/login';
import Logout from './logout/logout';
import Register from './register/register';
import Profile from './profile/profile';
import EditProfile from './profile/edit';
import EditPost from './post/editpost';
import Navbar from './navbar/navbar';
import NoPage from './nopage/nopage';

import { userData } from './classes/callAPI';

//import './app.scss';
import Postscreen from './postscreen/postscreen';

if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  
  //if token is present in localStorage setsAuthToken with it
  userData(token).then(resp => { //gets data for current user and dispatches it into redux store
    let usrData = resp.data;
    
    store.dispatch(setCurrentUser(usrData));
    store.dispatch(setUserFollowers(usrData));
    
  })

  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) { //If token expires, send back to login
    store.dispatch(logout()); 
    window.location.href = "./login";
  }
}

const AppRouter = () =>{

  return(
    <Router>
      <div className="App">
        <Navbar/>
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route path="/profile/edit" component={EditProfile} />
            <Route path="/post/edit/:postId">
              <EditPost />
            </Route>
            <Route path='/post/:postId/1'>
              <Profile />
            </Route>
            <Route exact path='/post/:postId'>
              <Home />
            </Route>
            <Route path='/:profileId'>
              <Profile />
            </Route>
            <Route component={NoPage} />
          </Switch>
          <Route exact path='/post/:postId'>
              <Postscreen />
          </Route>
          <Route path='/post/:postId/1'>
              <Postscreen />
          </Route>
        </div>
      </div>
    </Router>
  );
}


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    
    render() {
    const { user } = this.props.auth

    return(
      <AppRouter state={this.state} />
    );
    }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    flw: state.flw
  };
}

export default connect(mapStateToProps)(App);