import axios from 'axios';

export const login = user => {
    return axios.post('http://localhost:4000/user/login', user)
        .then(res => { 
            console.log(res.data.token)
            return res;
        })
        .catch(error => {
            console.log(error.res)
    });
}

export const userData = user => {
    return axios.get('http://localhost:4000/user/me', { headers : {token: user }})
        .then(res => {
            console.log(res.data.username);
            return res;
            
        })
        .catch(error => {console.log(error)})
}



export const register = user => {
    return axios.post('http://localhost:4000/user/signup', user)
        //.then((res) => res.json())
        .then((data) => {
            console.log(data.token);
            return data;
        })
        .catch((err)=>console.log(err))
}