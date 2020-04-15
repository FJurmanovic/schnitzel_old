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
            emailVal: '',
            passVal: '',
            errors: {}
        };
    
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      componentDidMount() {
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/");
        }
      }
    
      componentWillReceiveProps(props) {
        if (props.auth.isAuthenticated) {
          this.props.history.push("/");
        }
    
        if (props.errors) {
          this.setState({
            errors: props.errors
          });
        }
      }
    
      handleEmail(event) {
        this.setState({emailVal: event.target.value});
      }

      handlePass(event) {
        this.setState({passVal: event.target.value});
      }
    
      handleSubmit(event) {
        event.preventDefault();
        const loginObject = 
        { 
            email: this.state.emailVal, 
            password: this.state.passVal 
        };
        console.log(loginObject);

        this.props.login(loginObject);
        

      }
    
      render() {
        const { errors } = this.state;
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
                <label>Email:<br />
                <input type="email" value={this.state.emailVal} onChange={this.handleEmail} />
                </label>
                <br />
                <label>Password:<br />
                <input type="password" value={this.state.passVal} onChange={this.handlePass} />
                </label>
                <br />
                <input type="submit" value="Submit" />
            </form>
            
            <div></div>
          </div>
        );
      }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
