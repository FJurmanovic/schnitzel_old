import React, { Component } from 'react';

import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from 'react-redux';

import { login, userData } from '../classes/callAPI';

//import './login.scss';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = 
        {
            err: {}
        };
      }

      componentDidMount() {
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/");
        }else{
          const loginObject = 
        { 
            email: "demo@demo.com", 
            password: "demoacc" 
        };

        this.props.login(loginObject);
        }
      }
    
      componentWillReceiveProps(props) {
        if (props.auth.isAuthenticated) {
          this.props.history.push("/");
        }
    
        if (props.errors) {
          this.setState({
            err: props.err
          });
        }
      }
    
      handleSubmit(event) {
        event.preventDefault();
        
        

      }
    
      render() {
        return (
          <div>
            You are logging in as demo
          </div>
        );
      }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  err: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  err: state.err,
  flw: state.flw
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
