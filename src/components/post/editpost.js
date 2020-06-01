import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {userData, editPost, getPostForEdit} from '../classes/callAPI';
import {categories, firstUpper} from '../classes/Functions';


class EditPost extends Component {
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
                    "amount": 0,
                    "unit": ""
                }
            ],
            directionsVal: '',
            categoriesVal: [],
            isRecipe: false,
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
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentWillMount() {
        
        let isAuthenticated = false;
        if (localStorage.jwtToken) {
          isAuthenticated = true;
          //console.log(isAuthenticated)
        }

        if (!isAuthenticated) { 
            this.props.history.push("../../");
        } else {
            const token = jwt_decode(localStorage.jwtToken).user.id
            
            const { user } = this.props.auth
            const { postId } = this.props.match.params
            
            getPostForEdit(localStorage.jwtToken, postId).then(res => {
                if (!!res.data.message){
                    this.props.history.goBack();
                }

                let { post } = res.data
                let privacy = '';
                if(post.isPrivate){
                    privacy = "private"
                }else{
                    privacy = "public"
                }

                //console.log(privacy)

                if(post.type == "post"){
                    this.setState({
                        postId: postId,
                        titleVal: post.title,
                        descriptionVal: post.description,
                        typeVal: post.type,
                        privacyVal: privacy,
                        categoriesVal: post.categories
                    })
                }else{
                    this.setState({
                        postId: postId,
                        titleVal: post.title,
                        descriptionVal: post.description,
                        typeVal: post.type,
                        privacyVal: privacy,
                        categoriesVal: post.categories,
                        ingredientsVal: post.ingredients,
                        directionsVal: post.directions
                    })
                }
                
            })
            //console.log(token)
            this.setState({
                userdata: this.props.auth.user,
                token: localStorage.jwtToken
            });
        }
    }

    componentWillReceiveProps(props) {
        if (!props.auth.isAuthenticated) {
            props.history.push("../../");
        } else {
            const { user } = props.auth;
            const { postId } = props.match.params
            
            this.setState({
            postId: postId,
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
            "amount": "",
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

        //console.log("Title: " + this.state.titleVal)
        //console.log("Description: " + this.state.descriptionVal)
        //console.log("UserId: " + this.state.userdata.id)

        const title = this.state.titleVal
        const type = this.state.typeVal
        const privacy = this.state.privacyVal == "private"
        const description = this.state.descriptionVal
        const categories = this.state.categoriesVal
        const userid = this.state.userdata.id
        const ingredients = this.state.ingredientsVal
        const directions = this.state.directionsVal
        

        if(type == "post"){
            if(title.length > 0 && description.length > 0 && userid.length > 0){
                const postObject = {
                    token: this.state.token,
                    id: this.state.postId,
                    title: title,
                    type: type,
                    isPrivate: privacy, 
                    description: description,
                    categories: categories,
                    userId: userid
                }
        
                this.props.editPost(postObject, this.props.history);
                this.props.history.goBack();
            }else if(!(title.length > 0)){
                console.log("Error: Title is blank")
                this.setState({
                    err: {
                        type: "title",
                        message: "Error: Title is blank"
                    }
                })
            }if(!(description.length > 0)){
                console.log("Error: Description is blank")
                this.setState({
                    err: {
                        type: "description",
                        message: "Error: Description is blank"
                    }
                })
            }if(!(userid.length > 0)){
                console.log("Error: User is not authenticated")
                this.setState({
                    err: {
                        type: "user",
                        message: "Error: User is not authenticated"
                    }
                })
            }
        }else if(type == "recipe"){
            if(title.length > 0 && description.length > 0 && userid.length > 0 && categories.length > 0 && ingredients.length > 0 && directions.length > 0){
                const postObject = {
                    token: this.state.token,
                    id: this.state.postId, 
                    title: title,
                    type: type,
                    isPrivate: privacy, 
                    description: description,
                    categories: categories,
                    userId: userid,
                    ingredients: ingredients,
                    directions: directions
                }
        
                this.props.editPost(postObject, this.props.history);
                this.props.history.goBack();
            }else if(!(title.length > 0)){
                console.log("Error: Title is blank")
                this.setState({
                    err: {
                        type: "title",
                        message: "Error: Title is blank"
                    }
                })
            }if(!(description.length > 0)){
                console.log("Error: Description is blank")
                this.setState({
                    err: {
                        type: "description",
                        message: "Error: Description is blank"
                    }
                })
            }if(!(userid.length > 0)){
                console.log("Error: User is not authenticated")
                this.setState({
                    err: {
                        type: "user",
                        message: "Error: User is not authenticated"
                    }
                })
            }if(!(categories.length > 0)){
                console.log("Error: You need to select a category")
                this.setState({
                    err: {
                        type: "category",
                        message: "Error: You need to select a category"
                    }
                })
            }if(!(ingredients.length > 0)){
                console.log("Error: You need to add an ingredient")
                this.setState({
                    err: {
                        type: "ingredient",
                        message: "Error: You need to add an ingredient"
                    }
                })
            }if(!(directions.length > 0)){
                console.log("Error: Directions is blank")
                this.setState({
                    err: {
                        type: "directions",
                        message: "Error: Directions is blank"
                    }
                })
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
                    <input className="ingr-item" type="text" value={ingredient.name} onChange={(e) => this.handleIngredientsName(e, i)} />
                    <input className="ingr-item" type="number" value={ingredient.amount} onChange={(e) => this.handleIngredientsAmount(e, i)} />
                    <input className="ingr-item" type="text" value={ingredient.unit} onChange={(e) => this.handleIngredientsUnit(e, i)} />
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
        <div>  
            <button className="btn btn-link float-right mr-9 mt-n3" onClick={() => this.props.history.goBack()}>Cancel</button>
            <form onSubmit={this.handleSubmit} className="col-7 mx-auto">
                <label>Title:<br />
                <input type="text" value={this.state.titleVal} onChange={this.handleTitle} className="width-full py-3 f4" required />
                { this.state.err.type == 'title' 
                    ?   <div>{this.state.err.message}</div>
                    :   <br />
                }
                </label>
                <br />
                <label>Type:<br />
                <select onChange={this.handleType} className="width-full py-3 f4">
                    <option value="post" selected={this.state.typeVal == "post"}>Showoff</option>
                    <option value="recipe" selected={this.state.typeVal == "recipe"}>Recipe</option>
                </select>
                </label>
                <br />
                <label>Post privacy:<br />
                <select onChange={this.handlePrivacy} className="width-full py-3 f4">
                    <option value="private" selected={this.state.privacyVal == "private"}>Private</option>
                    <option value="public" selected={this.state.privacyVal == "public"}>Public</option>
                </select>
                </label>
                <br />
                <div className="f4">Category:<br />
                    {categories.map((category, key) => {
                        return <React.Fragment key={key}>
                            
                            <div className="btn-checkbox">
                                <input type="checkbox" name={category} checked={this.state.categoriesVal.filter(x => x == category)[0]} onChange={this.handleCategory} value={category} />
                                <label htmlFor={category}> {firstUpper(category)} </label>
                            </div>
                        </React.Fragment>   
                    })}
                    { this.state.err.type == 'category' 
                        ?   <div>{this.state.err.message}</div>
                        :   <br />
                    }
                </div>
                <br />
                <label>Description:<br />
                <textarea 
                    onChange={this.handleDescription}
                    value={this.state.descriptionVal}
                    className="width-full py-3 f4"
                    required
                />
                { this.state.err.type == 'description' 
                    ?   <div>{this.state.err.message}</div>
                    :   <br />
                }
                </label>
                <br />
                {this.state.typeVal == "recipe" &&
                <>
                    <label>Ingredients:<br /></label>
                    {this.showIngredients()}
                        { this.state.err.type == 'ingredient' 
                            ?   <div>{this.state.err.message}</div>
                            :   <br />
                        }
                    <br />
                            <button className="btn btn-default mt-n4 mb-4" onClick={this.handleNumIngredients}>Add new ingredient</button><br />
                    <label>Directions:<br />
                    <textarea 
                        onChange={this.handleDirections}
                        value={this.state.directionsVal}
                        className="width-full py-3 f4"
                        required
                    />
                    { this.state.err.type == 'directions' 
                        ?   <div>{this.state.err.message}</div>
                        :   <br />
                    }
                    </label>
                    <br />
                </>
                }
                <input type="submit" value="Submit" className="btn btn-blue width-full mb-7" />
            </form>
        </div>
        );
    }
}

EditPost.propTypes = {
    err: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    err: state.err,
    auth: state.auth,
    post: state.post
  });
  
  export default withRouter(connect(
    mapStateToProps,
    { editPost }
  )(EditPost));