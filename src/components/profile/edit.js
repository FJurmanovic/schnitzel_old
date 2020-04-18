import React, { Component } from 'react';

import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from 'react-redux';

import { logout, deactivateUser} from '../classes/callAPI';


class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = 
        {
            userVal: '',
            emailVal: '',
            passVal: '',
            err: {}
        };
    
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
    
      render() {
        const { err } = this.state;
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
                <label>Username:<br />
                <input type="email" value={this.state.userVal} onChange={this.handleEmail} />
                </label>
                <br />
                <label>Email:<br />
                <input type="email" value={this.state.emailVal} onChange={this.handleEmail} />
                </label>
                <br />
                <label>New password:<br />
                <input type="password" value={this.state.passVal} onChange={this.handlePass} />
                </label>
                <br />
                <label>Confirm password:<br />
                <input type="password" value={this.state.passVal} onChange={this.handlePass} />
                </label>
                <br />
                <input type="submit" value="Submit" />
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
  };
  
  const mapStateToProps = state => ({
      auth: state.auth
  });
  
  export default connect(mapStateToProps, { logout })(EditProfile);
