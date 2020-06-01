import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";

import PropTypes from "prop-types";

import { register } from '../classes/callAPI';
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
            pass2Val: '',
            err: {},
            privacy: "private"
        };
    
        this.handleUsername = this.handleUsername.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handleEmail2 = this.handleEmail2.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handlePass2 = this.handlePass2.bind(this);
        this.handlePrivacy = this.handlePrivacy.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      componentDidMount() {
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/");
        }
      }
    
      componentWillReceiveProps(props) {
        if (props.err) {
          this.setState({
            err: props.err
          });
        }
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
        const isPrivate = !(this.state.privacy === "public");
        
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
                password: pass,
                isPrivate: isPrivate
            };

            const loginObject = {
              email: email,
              password: pass
            };
            //console.log(registerObject);
            
            this.props.register(registerObject, this.props.history);

            
        }   
      }

      handlePrivacy(event){
        this.setState({
          privacy: event.target.value
        });
      }
    
      render() {
        const { err } = this.state;

        return (
          <div className="text-center">
            <form onSubmit={this.handleSubmit} className="col-7 mx-auto f4">
                <label>Username:<br />
                  <input type="username" value={this.state.usernameVal} onChange={this.handleUsername} className="width-full f5 py-2" required />
                    { this.props.err.type == 'username' 
                        ?   <div>Username is already registered</div>
                        :   <br />
                    }
                </label>
                <label>Email:<br />
                  <input type="email" value={this.state.emailVal} onChange={this.handleEmail} className="width-full f5 py-2" required />
                    { this.props.err.type == 'email' 
                        ?   <div>Email is already registered</div>
                        :   <br />
                    }
                </label>
                <label>Confirm Email:<br />
                  <input type="email" value={this.state.email2Val} onChange={this.handleEmail2} className="width-full f5 py-2" required />
                    { this.state.mailsMatch === false 
                        ?   <div>Please make sure you entered correct emails.</div>
                        :   <br />
                    }
                </label>
                <label>Password:<br />
                <input type="password" value={this.state.passVal} onChange={this.handlePass} className="width-full f5 py-2" required />
                </label>
                <br />
                <label>Confirm Password:<br />
                  <input type="password" value={this.state.pass2Val} onChange={this.handlePass2} className="width-full f5 py-2" required />
                    { this.state.passMatch === false
                        ?   <div>Please make sure you entered correct passwords.</div>
                        :   <br />
                    }
                </label>
                <label>Profile privacy:<br />
                  <label className="mx-2">Private <input type="radio" value="private" checked={this.state.privacy === "private"} onChange={this.handlePrivacy}/></label>
                  <label className="mx-2">Public <input type="radio" value="public" checked={this.state.privacy === "public"} onChange={this.handlePrivacy}/></label>
                  <br />
                </label>
                <input type="submit" value="Register" className="width-full f3 btn btn-blue-transparent border-blue" />
            </form>
            { this.state.succRegister === true &&
                <div>Succesfully registred</div>
            }
            
            <div className="my-5"><Link to="/demologin">Login with demo account</Link></div>
          </div>
        );
      }
}

Register.propTypes = {
  register: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  err: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  err: state.err
});

export default connect(
  mapStateToProps,
  { register }
)(withRouter(Register));