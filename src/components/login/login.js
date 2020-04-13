import React, { Component } from 'react';
import { connect } from 'react-redux';

import { login, userData } from '../classes/callAPI';
import { functions } from '../classes/Functions';
import { createStore } from 'redux';
import {SIGN_IN} from '../../actions/';

//import './login.scss';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = 
        {
            emailVal: '',
            passVal: '',
            session: ''
        };
    
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

        login(loginObject).then(res=>{
          console.log(res);
          userData(res.data.token).then(response=>{
            this.setState({session: res.data.token});
            this.props.dispatch({type: SIGN_IN});
            localStorage.setItem("session", res.data.token);
            this.props.history.push('/');
          });
        });
        

      }
    
      render() {
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

function mapStateToProps(state) {
  return {
    isLogged: state.isLogged
  };
}

export default connect(mapStateToProps)(Login);