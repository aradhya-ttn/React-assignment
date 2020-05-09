import React, { Component } from 'react';

import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';




const INGREDIENT_PRICES = {
    salad: 25,
    cheese: 35,
    meat: 30,
    bacon: 35
};

class BurgerBuilder extends Component{
    state = {
        ingredients : null,
        totalPrice: 15,
        purchasable:false,
        purchasing:false,
        loading:false,
        error:false
    }

    componentDidMount(){
        console.log(this.props);
        axios.get('https://react-my-burger-bootcamp.firebaseio.com/ingredients.json')
          .then(response => {
                this.setState({ingredients:response.data})
          })
          .catch(error => {
              this.setState({error:true});
          });
    }

    updatePurchaseState (ingredients) {
       
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum,el) => {
            return sum +el;
        },0);
        this.setState({purchasable: sum > 0})
    }

    purchaseHandler = () => {
        this.setState({purchasing:true});
    }

    addIngredientHandler = (type) => {
        const oldCount= this.state.ingredients[type];
        const updatedCount = oldCount+1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice,ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount= this.state.ingredients[type];
        if(oldCount <=0){
            return;
        }
        const updatedCount = oldCount-1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPriceordered;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice,ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () =>{
        
        const queryParam = [];
        for(let i in this.state.ingredients){
            queryParam.push(encodeURIComponent(i)+ '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParam.push('price='+this.state.totalPrice);
        const queryString = queryParam.join('&');
        this.props.history.push({
            pathname:'/checkout',
            search:'?'+ queryString });
    }


    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        
        
        

        let orderSummary=null;
        
        let burger =this.state.error ? <p>Ingredient can't be loaded></p> : <div style={{alignItems:"center"}}><Spinner /></div>
        if(this.state.ingredients){
            burger =(
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded = {this.addIngredientHandler} 
                        ingredientRemoved = {this.removeIngredientHandler} 
                        disabled={disabledInfo} 
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice} 
                    />
                    </Aux>
            );
        
        orderSummary=<OrderSummary 
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />
        }   
        if(this.state.loading){
            orderSummary=<Spinner />    
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
        
    }
}



export default withErrorHandler(BurgerBuilder,axios);