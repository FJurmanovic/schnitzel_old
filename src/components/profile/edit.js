import React, { Component } from 'react';

import { Link } from "react-router-dom";

import jwt_decode from "jwt-decode";

import PropTypes from "prop-types";
import { connect } from 'react-redux';

import { logout, deactivateUser, userData, editUser} from '../classes/callAPI';

import axios from 'axios';


class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = 
        {
            userVal: '',
            emailVal: '',
            passVal: '',
            pass2Val: '',
            err: {},
            editEmail: false,
            editPassword: false,
            editUsername: false
        };
        
        
        this.handleUsername = this.handleUsername.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handlePass2 = this.handlePass2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      componentDidMount() {
        let isAuthenticated = false;
        if (localStorage.jwtToken) {
          isAuthenticated = true;
          console.log(isAuthenticated)
        }

        if (!isAuthenticated) { 
            this.props.history.push("../");
        } else {
            const token = jwt_decode(localStorage.jwtToken).user.id

            const { user } = this.props.auth
            
            console.log(token)
            if(this.props.auth.isAuthenticated){
              this.setState({
                id: user.id,
                userVal: user.username,
                emailVal: user.email,
                passVal: '',
                token: localStorage.jwtToken,
                deactivate: false,
              });
            }
            //const { user } = this.state.user;
            /*this.setState({
                id: user["_id"],
                userVal: user.username,
                emailVal: user.email,
                passVal: '',
                token: localStorage.jwtToken,
                deactivate: false,
            });*/
        }
      }
    
      componentWillReceiveProps(props) {
        if (!props.auth.isAuthenticated) {
            this.props.history.push("../");
        }else{

          const { user } = props.auth
          this.setState({
            id: user.id,
            userVal: user.username,
            emailVal: user.email,
            passVal: '',
            token: localStorage.jwtToken,
            deactivate: false,
          });
        }
    
        if (props.errors) {
          this.setState({
            err: props.err
          });
        }
      }
    
      handleUsername(event) {
        this.setState({userVal: event.target.value});
      }

      handleEmail(event) {
        this.setState({emailVal: event.target.value});
      }

      handlePass(event) {
        this.setState({passVal: event.target.value});
      }

      handlePass2(event) {
        this.setState({pass2Val: event.target.value});
      }
    
      handleSubmit(event) {
        event.preventDefault();
        const username = this.state.userVal;
        const email = this.state.emailVal;
        const pass = this.state.passVal;
        const pass2 = this.state.pass2Val;

        console.log("SASA")


        if((pass === pass2 && pass.length > 6) || !this.state.editPassword || (this.state.editUsername && username.length > 0)){
          const editObject = 
          {   
            id: this.state.id
          };

          if(this.state.editEmail){
            editObject.email = email
          }
          if(this.state.editUsername){
            editObject.username = username
          }
          if(this.state.editPassword){
            editObject.password = pass
          }

          this.props.editUser(editObject);

          if(!this.props.err){
            this.props.history.push("/profile");
          }
        } 
      }

      noDeactivateButton(event) {
        event.preventDefault();
        this.setState({deactivate: false});
      }

      deactivateButton(event) {
        event.preventDefault();
        this.setState({deactivate: true});
      }

      yesDeactivateButton(event) {
        event.preventDefault();
        const token = this.state.token;
        deactivateUser(token);
      }

      errorMessages(){
          return(
            <>
            <br />
              {this.props.err.type == 'email' && <span>{this.props.err.message}</span>}
              {this.props.err.type == 'username' && <span>{this.props.err.message}</span>}
              {this.props.err.type == 'password' && <span>{this.props.err.message}</span>}
            </>)
      }
    
      render() {
        const { err } = this.state;
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
              {this.state.editUsername 
              ? <label>Username:<br />
                <input type="text" value={this.state.userVal} onChange={this.handleUsername} /> <a href="#" onClick={() => {this.setState({editUsername: false})}}>Cancel</a>
                </label>
              : <span><input type="text" value={this.state.userVal} disabled /> <a href="#" onClick={() => {this.setState({editUsername: true})}}>Edit username</a></span>
              }
                
                <br />
              {this.state.editEmail
              ? <label>Email:<br />
                <input type="email" value={this.state.emailVal} onChange={this.handleEmail} /> <a href="#" onClick={() => {this.setState({editEmail: false})}}>Cancel</a>
                </label>
              : <span><input type="email" value={this.state.emailVal} disabled /> <a href="#" onClick={() => {this.setState({editEmail: true})}}>Edit email</a></span>
              }
                
                <br />

              {this.state.editPassword
              ? <><label>New password:<br />
                <input type="password" value={this.state.passVal} onChange={this.handlePass} />
                </label>
                <br />
                <label>Confirm password:<br />
                <input type="password" value={this.state.pass2Val} onChange={this.handlePass2} /> <a href="#" onClick={() => {this.setState({editPassword: false, passVal: '', pass2Val: ''})}}>Cancel</a>
                </label></>
              : <span><a href="#" onClick={() => {this.setState({editPassword: true, passVal: '', pass2Val: ''})}}>Edit password</a></span>
              }
                <br />
              {(this.state.editUsername || this.state.editEmail || this.state.editPassword) && 
                <input type="submit" value="Submit" />
              }

              {
                <>
                {
                  this.errorMessages()
                }
                </>
              }
                
            </form>
            <br/><br/>
            <div>
                { this.state.deactivate 
                    ?   <span>Are you sure you want to deactivate account? <button onClick={this.yesDeactivateButton.bind(this)}><Link to="../" onClick={
                        this.props.logout}>Yes</Link></button> <button onClick={this.noDeactivateButton.bind(this)}>No</button></span> 
                    :   <button onClick={this.deactivateButton.bind(this)}>Deactivate account</button>
                }
            </div>
          </div>
        );
      }
}

EditProfile.propTypes = {
    logout: PropTypes.func.isRequired,
    editUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    err: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
      auth: state.auth,
      err: state.err
  });
  
  export default connect(mapStateToProps, { editUser, logout })(EditProfile);
