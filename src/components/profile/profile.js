import React, { Component } from 'react';

import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from 'react-redux';

import { userData } from '../classes/callAPI';


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = 
        {
            userVal: '',
            emailVal: '',
            passVal: '',
            err: {}
        };
      }

      componentDidMount() {
        if (!this.props.auth.isAuthenticated) {  
            this.props.history.push("/");
        } else {
            const { user } = this.props.auth
            this.setState({
                userVal: user.username,
                emailVal: user.email,
                passVal: '',
                token: localStorage.jwtToken,
                deactivate: false
            });
        }
      }
    
      componentWillReceiveProps(props) {
        if (!props.auth.isAuthenticated) {
            this.props.history.push("/");
        }
    
        if (props.errors) {
          this.setState({
            err: props.err
          });
        }
      }
    
      render() {
        const { err } = this.state;
        return (
          <div>
            <Link to="profile/edit">
                Edit profile
            </Link>
          </div>
        );
      }
}

Profile.propTypes = {
  };
  
  const mapStateToProps = state => ({
      auth: state.auth
  });
  
  export default connect(mapStateToProps)(Profile);
