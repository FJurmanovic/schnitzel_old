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
            err: {}
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
            err: props.err
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
        const { err } = this.state;
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
                <label>Email:<br />
                <input type="email" value={this.state.emailVal} onChange={this.handleEmail} />
                </label>
                {this.props.err.message && <div>User does not exist</div>}
                <br />
                <label>Password:<br />
                <input type="password" value={this.state.passVal} onChange={this.handlePass} />
                </label>
                {this.props.err.errors && <div>Please enter a valid password</div>}
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
  err: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  err: state.err
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
