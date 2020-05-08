import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {userData, createPost} from '../classes/callAPI';


class Post extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            titleVal: '',
            typeVal: 'post',
            descriptionVal: '',
            numIngredientsVal : 1,
            ingredientsVal: [
                {
                    "name": "test",
                    "amount": 0,
                    "unit": "gram"
                }
            ],
            directionsVal: '',
            isRecipe: false,
            err: {}
         };

         
        this.handleTitle = this.handleTitle.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleNumIngredients = this.handleNumIngredients.bind(this);
        this.handleIngredientsName = this.handleIngredientsName.bind(this);
        this.handleIngredientsAmount = this.handleIngredientsAmount.bind(this);
        this.handleIngredientsUnit = this.handleIngredientsUnit.bind(this);
        this.handleDirections = this.handleDirections.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentWillMount() {
        
        let isAuthenticated = false;
        if (localStorage.jwtToken) {
          isAuthenticated = true;
          console.log(isAuthenticated)
        }

        if (!isAuthenticated) { 
            this.props.history.push("/");
        } else {
            const token = jwt_decode(localStorage.jwtToken).user.id
            
            console.log(token)
            this.setState({
                userdata: this.props.auth.user,
                token: localStorage.jwtToken
            });
        }
    }

    componentWillReceiveProps(props) {
        if (!props.auth.isAuthenticated) {
            props.history.push("/");
        } else {
            const { user } = props.auth;
            
            this.setState({
            userdata: user,
            token: localStorage.jwtToken
            })
        }

        if (props.errors) {
            this.setState({
            err: props.err
            });
        }
    }

    handleTitle(event){
        event.preventDefault();

        this.setState({titleVal: event.target.value})
    }

    handleType(event){
        event.preventDefault();

        this.setState({typeVal: event.target.value})
    }

    handleDescription(event){
        event.preventDefault();

        this.setState({descriptionVal: event.target.value})
    }

    handleNumIngredients(event){
        event.preventDefault();
        let ingredients = this.state.ingredientsVal;
        ingredients.push({
            "name": "",
            "value": "",
            "unit": ""
        });

        this.setState({numIngredientsVal: ++this.state.numIngredientsVal, ingredientsVal: ingredients})
    }

    handleIngredientsName(event, id){
        let ingredients = this.state.ingredientsVal
        ingredients[id].name = event.target.value;

        this.setState({ingredientsVal: ingredients})
    }

    handleIngredientsAmount(event, id){
        let ingredients = this.state.ingredientsVal
        ingredients[id].amount = event.target.value;

        this.setState({ingredientsVal: ingredients})
    }

    handleIngredientsUnit(event, id){
        let ingredients = this.state.ingredientsVal
        ingredients[id].unit = event.target.value;

        this.setState({ingredientsVal: ingredients})
    }

    handleDirections(event){
        event.preventDefault();

        this.setState({directionsVal: event.target.value});
    }

    handleSubmit(event){
        event.preventDefault();

        console.log("Title: " + this.state.titleVal)
        console.log("Description: " + this.state.descriptionVal)
        console.log("UserId: " + this.state.userdata.id)

        const title = this.state.titleVal
        const type = this.state.typeVal
        const description = this.state.descriptionVal
        const userid = this.state.userdata.id
        const ingredients = this.state.ingredientsVal
        const directions = this.state.directionsVal
        

        if(title.length > 0 && description.length > 0 && userid.length > 0){
            const postObject = {
                title: title,
                type: type,
                description: description,
                userId: userid,
                ingredients: ingredients,
                directions: directions
            }
    
            this.props.createPost(postObject, this.props.history);
            this.setState({enablePost: false});
        }else if(!(title.length > 0)){
            console.log("Error: Title is blank")
        }if(!(description.length > 0)){
            console.log("Error: Description is blank")
        }if(!(userid.length > 0)){
            console.log("Error: User is not authenticated")
        }
    }

    showIngredients(){
        let ingredients = this.state.ingredientsVal || []
        return(
        <div className="ingredients">
        {ingredients.map((ingredient, i) => {
            return (
            <React.Fragment key={i}>
                <div className="ingredient">
                    <label>Ingredient: 
                        <input type="text" value={ingredient.name} onChange={(e) => this.handleIngredientsName(e, i)} />
                    </label>
                    <label>Amount: 
                        <input type="number" value={ingredient.amount} onChange={(e) => this.handleIngredientsAmount(e, i)} />
                    </label>
                    <label>Unit:
                        <input type="text" value={ingredient.unit} onChange={(e) => this.handleIngredientsUnit(e, i)} />
                    </label>
                </div>
            </React.Fragment>)
        })}
        </div>);
    }

    render() {
        const { err } = this.state;
        return(
        <>
            {this.state.enablePost
            ?   <form onSubmit={this.handleSubmit}>
                    <label>Title:<br />
                    <input type="text" value={this.state.titleVal} onChange={this.handleTitle} />
                    </label>
                    <br />
                    <label>Type:<br />
                    <select onChange={this.handleType}>
                        <option value="post">Showoff</option>
                        <option value="recipe">Recipe</option>
                    </select>
                    </label>
                    <br />
                    <label>Description:<br />
                    <textarea 
                        onChange={this.handleDescription}
                        value={this.state.descriptionVal}
                    />
                    </label>
                    <br />
                    {this.state.typeVal == "recipe" &&
                    <>
                        <label>Ingredients:<br /></label>
                        {this.showIngredients()}
                        <br />
                        <label>Directions:<br />
                        <textarea 
                            onChange={this.handleDirections}
                            value={this.state.directionsVal}
                        />
                        </label>
                        <br />
                    </>
                    }
                    <button onClick={this.handleNumIngredients}>Add new ingredient</button><br />
                    <input type="submit" value="Submit" />
                </form>
            :   <button onClick={() => this.setState({enablePost: true})}>New Post</button>
            } 
        </>
        
        );
    }
}

Post.propTypes = {
    err: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    err: state.err,
    auth: state.auth,
    post: state.post
  });
  
  export default connect(
    mapStateToProps,
    { createPost }
  )(Post);