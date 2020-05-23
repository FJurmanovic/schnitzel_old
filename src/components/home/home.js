import React, { Component } from 'react';
import './home.scss';

import Post from '../post/post';
import Posts from './posts';

import axios from 'axios';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 

         };
    }
    
    componentWillMount() {
    }

    //If logged in shows feed, else shows welcome page
    render() {
    return(
    <div>
        {localStorage.jwtToken
            ?   <>
                    <Post />
                    <hr />
                    <Posts />
                </>
            :   <div>Welcome</div>
        }
        
        
    </div>
    );
    }
}

export default Home;