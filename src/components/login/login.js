import React, { Component } from 'react';
//import axios from 'axios';
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

        /*
        axios.post('http://localhost:4000/user/login', {
            email: this.state.value, 
            password: this.state.passval
        })
        .then(response => { 
            console.log(response.data.token)
            axios.get('http://localhost:4000/user/me', { token: response.data.token })
            .then(res => {console.log(res)})
            .catch(error => {console.log(error)})
        })
        .catch(error => {
            console.log(error.response)
        });*/

        fetch('http://localhost:4000/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginObject)
        }).then((res) => res.json())
        .then((data) => {
            console.log(data.token);

            fetch('http://localhost:4000/user/me', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            headers: {
                token: data.token
            }
            }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                this.setState({session: data});
                
            })
        })
        .catch((err)=>console.log(err))
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
            { this.state.session != '' &&
            <div>Welcome {this.state.session.username} </div>

            }
            <div></div>
          </div>
        );
      }
}

export default Login;