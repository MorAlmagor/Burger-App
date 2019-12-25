import React, { useState, useEffect, useCallback } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import axios from '../../axios-orders';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

//This Component use the Hooks insdead of the connect we use from redux. we import hooks from redux



const BurgerBuilder = props =>  {
    const [purchasing, setPurchasing] = useState(false);
    const dispatch = useDispatch();

    //Dispatches
    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()),[dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    //The props from the store

    const ings = useSelector((state) => state.burgerBuilder.ingredients);
    const price = useSelector((state) => state.burgerBuilder.totalPrice);
    const error = useSelector((state) => state.burgerBuilder.error);
    const isAuth = useSelector((state) => state.auth.token !== null);

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients])

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((acc, value)=> acc + value);
        return sum > 0;
    };   

    const purchaseHandler = () => {
        if ( isAuth ) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push("/auth");
        };
        
    };

    const purchaseCancelHandeler = () => {
        setPurchasing(false);
    };

    const purchaseContinueHandler = () => {
        // const queryParams = [];
        // for ( let i in this.state.ingredients) {
        //     queryParams.push(i + '=' + this.state.ingredients[i]);
        // }
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        onInitPurchase();
        props.history.push('/checkout');
    };

    const disabledInfo = {
        ...ings
    };

    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    };
    let orderSummary = null;
    let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />  ;
    if ( ings ) {
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onIngredientAdded}
                    ingredientRemove={onIngredientRemoved}
                    disabled={disabledInfo}
                    purchaseable={updatePurchaseState(ings)}
                    ordered={purchaseHandler}
                    isAuth={isAuth}
                    price={price} />
            </Aux>
        );
        orderSummary = <OrderSummary 
            ingredients={ings}
            price={price}
            purchaseCancelled={purchaseCancelHandeler}
            purchaseContinued={purchaseContinueHandler}/>
    };
    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandeler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );

};

// const mapStateToProps = state => {
//     return {
//         ings: state.burgerBuilder.ingredients,
//         price: state.burgerBuilder.totalPrice,
//         error: state.burgerBuilder.error,
//         isAuth: state.auth.token !== null
//     };
// };


//Changed by Redux hooks
// const mapDispatchToProps = dispatch => {
//     return {
//         onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
//         onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
//         onInitIngredients: () => dispatch(actions.initIngredients()),
//         onInitPurchase: () => dispatch(actions.purchaseInit()),
//         onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
//     };
// }

export default withErrorHandler(BurgerBuilder, axios);