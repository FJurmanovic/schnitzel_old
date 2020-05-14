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

         this.onChange = this.onChange.bind(this);
         this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    
    componentWillMount() {
    }

    onFormSubmit(e){
        e.preventDefault();
        const data = new FormData() 
        data.append('file', this.state.selectedFile)

        axios.post("http://localhost:4000/api/post/image-upload", data, {headers: {id: "test"}})
            .then((response) => {   
                alert("The file is successfully uploaded");
            }).catch((error) => {
        });
    }
  
    onChange(e) {
        this.setState({
            selectedFile: e.target.files[0],
            loaded: 0,
          })
    }

    render() {
    return(
    <div>
        {localStorage.jwtToken
            ?   <>
                    <Post />
                    <hr />
                    <Posts />
                </>
            :   <form>
                    <input type="file" className="custom-file-input" name="myImage" onChange= {this.onChange} />
                    {console.log(this.state.file)}
                    <button className="upload-button" onClick={this.onFormSubmit}>Upload to DB</button>
                </form>
        }
        
        
    </div>
    );
    }
}

export default Home;