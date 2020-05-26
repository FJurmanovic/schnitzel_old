import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const path = require("path"); 

import {userData, createPost, uploadImage} from '../classes/callAPI';
import {categories, firstUpper} from '../classes/Functions';


class Post extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            titleVal: '',
            typeVal: 'post',
            privacyVal: 'private',
            descriptionVal: '',
            numIngredientsVal : 1,
            ingredientsVal: [
                {
                    "name": "",
                    "amount": "",
                    "unit": ""
                }
            ],
            directionsVal: '',
            categoriesVal: [],
            checkedCats: new Map(),
            isRecipe: false,
            selectedFile: null,
            err: {}
         };

         
        this.handleTitle = this.handleTitle.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handlePrivacy = this.handlePrivacy.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleNumIngredients = this.handleNumIngredients.bind(this);
        this.handleIngredientsName = this.handleIngredientsName.bind(this);
        this.handleIngredientsAmount = this.handleIngredientsAmount.bind(this);
        this.handleIngredientsUnit = this.handleIngredientsUnit.bind(this);
        this.handleDirections = this.handleDirections.bind(this);
        this.isChecked = this.isChecked.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentWillMount() {
        
        let isAuthenticated = false;
        if (localStorage.jwtToken) {
          isAuthenticated = true;
          //console.log(isAuthenticated)
        }

        if (!isAuthenticated) { 
            this.props.history.push("/");
        } else {
            const token = jwt_decode(localStorage.jwtToken).user.id
            
            //console.log(token)
            this.setState({
                userdata: this.props.auth.user,
                token: localStorage.jwtToken,
                selectedFile: null
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
            token: localStorage.jwtToken,
            selectedFile: null
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

    handlePrivacy(event){
        event.preventDefault();

        this.setState({privacyVal: event.target.value})
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

    handleImage(e){
        this.setState({
            selectedFile: e.target.files[0]
          })
    }

    handleSubmit(event){
        event.preventDefault();

        console.log("Title: " + this.state.titleVal)
        console.log("Description: " + this.state.descriptionVal)
        console.log("UserId: " + this.state.userdata.id)

        const title = this.state.titleVal
        const type = this.state.typeVal
        const privacy = this.state.privacyVal == "private"
        const description = this.state.descriptionVal
        const categories = this.state.categoriesVal
        const userid = this.state.userdata.id
        const ingredients = this.state.ingredientsVal
        const directions = this.state.directionsVal
        
        let data = new FormData() 
        data.append('file', this.state.selectedFile)

        if(type == "post"){
            if(title.length > 0 && description.length > 0 && userid.length > 0){
                let postObject = {
                    title: title,
                    type: type,
                    isPrivate: privacy, 
                    description: description,
                    categories: categories,
                    userId: userid
                }
                if(this.state.selectedFile == null){
                    postObject["hasPhoto"] = false
                    this.props.createPost(postObject, this.props.history)
                    this.setState({enablePost: false, selectedFile: null});
                }else{
                    if(!this.state.selectedFile.name.match(/.(jpg|jpeg|png|gif)$/i)){
                        console.log("Error: File is not a valid format")
                    }else{
                        postObject["hasPhoto"] = true
                        postObject["photoExt"] = path.extname(this.state.selectedFile.name)
                        this.props.createPost(postObject, data, this.props.history)
                        this.setState({enablePost: false, selectedFile: null});
                    } 
                }
                
                
            }else if(!(title.length > 0)){
                console.log("Error: Title is blank")
            }if(!(description.length > 0)){
                console.log("Error: Description is blank")
            }if(!(userid.length > 0)){
                console.log("Error: User is not authenticated")
            }
        }else if(type == "recipe"){
            if(title.length > 0 && description.length > 0 && userid.length > 0 && categories.length > 0 && ingredients.length > 0 && directions.length > 0){
                let postObject = {
                    title: title,
                    type: type,
                    isPrivate: privacy, 
                    description: description,
                    categories: categories,
                    userId: userid,
                    ingredients: ingredients,
                    directions: directions
                }
                if(this.state.selectedFile == null){
                    postObject["hasPhoto"] = false
                    this.props.createPost(postObject, this.props.history)
                    this.setState({enablePost: false, selectedFile: null});
                }else{
                    if(!this.state.selectedFile.name.match(/.(jpg|jpeg|png|gif)$/i)){
                        console.log("Error: File is not a valid format")
                    }else{
                        postObject["hasPhoto"] = true
                        postObject["photoExt"] = path.extname(this.state.selectedFile.name)
                        this.props.createPost(postObject, data, this.props.history)
                        this.setState({enablePost: false, selectedFile: null});
                    }
                    
                }
            }else if(!(title.length > 0)){
                console.log("Error: Title is blank")
            }if(!(description.length > 0)){
                console.log("Error: Description is blank")
            }if(!(userid.length > 0)){
                console.log("Error: User is not authenticated")
            }if(!(categories.length > 0)){
                console.log("Error: You need to select a category")
            }if(!(ingredients.length > 0)){
                console.log("Error: You need to add an ingredient")
            }if(!(directions.length > 0)){
                console.log("Error: Directions is blank")
            }
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
                        <input className="ingr-item" type="text" value={ingredient.name} placeholder="Ingredient" onChange={(e) => this.handleIngredientsName(e, i)} />
                        <input className="ingr-item" type="number" value={ingredient.amount} placeholder="Amount" onChange={(e) => this.handleIngredientsAmount(e, i)} />
                        <input className="ingr-item" type="text" value={ingredient.unit} placeholder="Unit" onChange={(e) => this.handleIngredientsUnit(e, i)} />
                </div>
            </React.Fragment>)
        })}
        </div>);
    }

    isChecked(event){
        event.preventDefault();

        return categories.includes(event.target.value)
    }

    handleCategory(e){
        const item = e.target.name;
        const isChecked = e.target.checked;

        let categoryList = this.state.categoriesVal || [];

        if(isChecked){
            categoryList.push(item)
        }else{
            categoryList.splice(categoryList.findIndex(x => x == item), 1)
        }

        this.setState({categoriesVal: categoryList });
    }

    render() {
        const { err } = this.state;
        return(
        <>
            {this.state.enablePost
            ?   
            <div>
                <button className="btn btn-link float-right mr-9 mt-n3" onClick={() => this.setState({enablePost: false})}>Cancel</button>
                <form onSubmit={this.handleSubmit} className="col-7 mx-auto">
                    <label>Title:<br />
                    <input type="text" value={this.state.titleVal} onChange={this.handleTitle} className="width-full py-3 f4" />
                    </label>
                    <br />
                    <label>Type:<br />
                    <select onChange={this.handleType} className="width-full py-3 f4">
                        <option value="post">Showoff</option>
                        <option value="recipe">Recipe</option>
                    </select>
                    </label>
                    <br />
                    <label>Post privacy:<br />
                    <select onChange={this.handlePrivacy} className="width-full py-3 f4">
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                    </label>
                    <br />
                    <label>Image:<br />
                    <input type="file" onChange= {this.handleImage} />
                    </label>
                    <br />
                    <div className="f4">Category:<br /> 
                        {categories.map((category, key) => {
                            return <React.Fragment key={key}>
                                <div className="btn-checkbox">
                                    <input type="checkbox" name={category} id={category} checked={this.state.categoriesVal.filter(x => x == category)[0]} onChange={this.handleCategory} value={category} />
                                    <label htmlFor={category}> {firstUpper(category)}</label>
                                </div>
                                
                            </React.Fragment>   
                        })}
                    </div>
                    <br />
                    <label>Description:<br />
                    <textarea 
                        onChange={this.handleDescription}
                        value={this.state.descriptionVal}
                        className="width-full py-3 f4"
                    />
                    </label>
                    <br />
                    {this.state.typeVal == "recipe" &&
                    <>
                        <label>Ingredients:<br /></label>
                        {this.showIngredients()}
                        <br />
                        <button className="btn btn-default mt-n4 mb-4" onClick={this.handleNumIngredients}>Add new ingredient</button><br />
                        <label className="">Directions:<br />
                            <textarea 
                                onChange={this.handleDirections}
                                value={this.state.directionsVal}
                                className="width-full py-3 f4"
                            />
                        </label>
                        <br />
                    </>
                    }
                    <input type="submit" value="Submit" className="btn btn-blue width-full" />
                </form>
            </div>
            :   <button className="btn btn-blue-transparent d-block width-full py-4" onClick={() => this.setState({enablePost: true})}>New Post</button>
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
    { createPost, uploadImage }
  )(Post);