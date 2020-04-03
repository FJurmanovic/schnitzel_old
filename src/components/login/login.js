import React, { Component } from 'react';
import axios from 'axios';
//import './login.scss';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = 
        {
            value: '', 
            passval: ''
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
      handleChange(event) {
        this.setState({value: event.target.value});
      }

      handlePass(event) {
        this.setState({passval: event.target.value});
      }
    
      handleSubmit(event) {
        event.preventDefault();
        const loginObject = 
        { 
            email: this.state.value, 
            password: this.state.passval 
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
                return<div>data</div>
                
            })
        })
        .catch((err)=>console.log(err))
      }
    
      render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input type="email" value={this.state.value} onChange={this.handleChange} />
            </label>
              <br />
            <label>Password:
              <input type="password" value={this.state.passval} onChange={this.handlePass} />
            </label>
            <br />
            <input type="submit" value="Submit" />
          </form>
        );
      }
}

export default Login;