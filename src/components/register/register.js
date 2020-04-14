import React, { Component } from 'react';
import { connect } from 'react-redux';

import { register, login, userData } from '../classes/callAPI';
import {SIGN_IN} from '../../actions/';
//import './login.scss';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = 
        {
            usernameVal: '',
            emailVal: '',
            email2Val: '',
            passVal: '',
            pass2Val: ''
        };
    
        this.handleUsername = this.handleUsername.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handleEmail2 = this.handleEmail2.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handlePass2 = this.handlePass2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
      handleUsername(event) {
        this.setState({usernameVal: event.target.value});
      }

      handleEmail(event) {
        this.setState({emailVal: event.target.value});
      }

      handleEmail2(event) {
        this.setState({email2Val: event.target.value});
      }

      handlePass(event) {
        this.setState({passVal: event.target.value});
      }

      handlePass2(event) {
        this.setState({pass2Val: event.target.value});
      }
    
      handleSubmit(event) {
        event.preventDefault();
        
        const username = this.state.usernameVal;
        const email = this.state.emailVal;
        const emailConfirm = this.state.email2Val;
        const pass = this.state.passVal;
        const passConfirm = this.state.pass2Val;
        
        if (email !== emailConfirm){
            this.setState({mailsMatch: false});
        }else{
            this.setState({mailsMatch: true});
        }
        if (pass !== passConfirm){
            this.setState({passMatch: false});
        }else{
            this.setState({passMatch: true});
        }

        if (email === emailConfirm && pass === passConfirm){
            this.setState({
                mailsMatch: true,
                passMatch: true
            });
            const registerObject = 
            { 
                username: username,
                email: email, 
                password: pass 
            };

            const loginObject = {
              email: email,
              password: pass
            };
            console.log(registerObject);
            
            register(registerObject).then(res=>{
              this.setState({succRegister: true});
              login(loginObject).then(res=>{
                console.log(res);
                userData(res.data.token).then(response=>{
                  this.setState({session: res.data.token});
                  this.props.dispatch({type: SIGN_IN});
                  localStorage.setItem("session", res.data.token);
                  this.props.history.push('/');
                });
              });
            }).catch((err)=>console.log(err))

            
        }   
      }
    
      render() {
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
                <label>Username:<br />
                <input type="username" value={this.state.usernameVal} onChange={this.handleUsername} />
                </label>
                <br />
                <label>Email:<br />
                <input type="email" value={this.state.emailVal} onChange={this.handleEmail} />
                </label>
                <br />
                <label>Confirm Email:<br />
                <input type="email" value={this.state.email2Val} onChange={this.handleEmail2} />
                    { this.state.mailsMatch === false 
                        ?   <div>Please make sure you entered correct emails.</div>
                        :   <br />
                    }
                </label>
                <label>Password:<br />
                <input type="password" value={this.state.passVal} onChange={this.handlePass} />
                </label>
                <br />
                <label>Confirm Password:<br />
                <input type="password" value={this.state.pass2Val} onChange={this.handlePass2} />
                    { this.state.passMatch === false
                        ?   <div>Please make sure you entered correct passwords.</div>
                        :   <br />
                    }
                </label>
                <input type="submit" value="Submit" />
            </form>
            { this.state.succRegister === true &&
                <div>Succesfully registred</div>
            }
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

export default connect(mapStateToProps)(Register);