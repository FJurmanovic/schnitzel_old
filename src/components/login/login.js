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

        this.props.login(loginObject);
        

      }
    
      render() {
        return (
          <div className="text-center">
            <form onSubmit={this.handleSubmit} className="mx-auto col-7 f4">
                <label>Email:<br />
                <input type="email" value={this.state.emailVal} onChange={this.handleEmail} className="width-full f5 py-2" required />
                </label>
                {this.props.err.type == 'email' && <div>{this.props.err.message}</div>}
                <br />
                <label>Password:<br />
                <input type="password" value={this.state.passVal} onChange={this.handlePass} className="width-full f5 py-2" required />
                </label>
                {this.props.err.type == 'password' && <div>{this.props.err.message}</div>}
                <br />
                <input type="submit" value="Login" className="my-3 width-full btn btn-blue-transparent border-blue" />
            </form>
            
            <div className="my-5"><Link to="/demologin">Login with demo account</Link></div>
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
