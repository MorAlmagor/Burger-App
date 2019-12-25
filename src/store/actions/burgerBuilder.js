import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (ingName) => {
    return {
        type: actionTypes.ADD_INGREDIENTS,
        ingredientName: ingName
    };
};


export const removeIngredient = (ingName) => {
    return {
        type: actionTypes.REMOVE_INGREDIENTS,
        ingredientName: ingName
    };
};

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    };
};

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    };
}

//fetch data from Firebase
export const initIngredients = () => {
    return dispatch => {
        axios.get('https://react-burger-7e3d7.firebaseio.com/ingredients.json')
            .then(res => {
                dispatch(setIngredients(res.data))
            })
            .catch(error => {
            dispatch(fetchIngredientsFailed())
            });
    };
};