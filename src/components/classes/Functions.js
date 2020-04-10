import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';


export const functions = {
    refresh(){
        
    },

    BackToLanding(){
        return (
            <div>
            <Redirect to="../" />
            </div>
            
        );
    }
}
    
