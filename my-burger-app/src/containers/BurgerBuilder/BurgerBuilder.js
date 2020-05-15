import React, { Component } from 'react';
import axios from '../../axios-orders'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';

class BurgerBuilder extends Component{
    state = {
        purchasing:false,

    }

    componentDidMount(){
       
        this.props.oninitIngredients();
        
    }

    updatePurchaseState (ingredients) {
       
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum,el) => {
            return sum +el;
        },0);
        return sum > 0;
    }

    purchaseHandler = () => {
        if(this.props.isAuthenticated){
            this.setState({purchasing:true});
        }else{
            this.props.onSetAuthRedirectpath('/checkout');
            this.props.history.push('/auth');
        }
        
    }

    
    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () =>{
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }


    render(){
        const disabledInfo = {
            ...this.props.ings
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        
        
        

        let orderSummary=null;
        
        let burger =this.props.error ? <p>Ingredient can't be loaded </p> : <div style={{alignItems:"center"}}><Spinner /></div>
        if(this.props.ings){
            burger =(
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                        ingredientAdded = {this.props.onIngredientAdded} 
                        ingredientRemoved = {this.props.onIngredientRemoved} 
                        disabled={disabledInfo} 
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                        price={this.props.price} 
                    />
                    </Aux>
            );
        
        orderSummary=<OrderSummary 
            ingredients={this.props.ings}
            price={this.props.price}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />
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

const mapStateToProps = state => {
    return{
        ings:state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error:state.burgerBuilder.error,
        isAuthenticated: state.auth.token !==null
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onIngredientAdded : (ingName)  => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved : (ingName)  => dispatch(actions.removeIngredient(ingName)),
        oninitIngredients : () => dispatch(actions.initIngredients()),
        onInitPurchase: () =>dispatch(actions.purchaseInit()),
        onSetAuthRedirectpath: (path)=> dispatch(actions.setAuthRedirectPath(path))
          
    }
}


export default connect(mapStateToProps,mapDispatchToProps) (withErrorHandler(BurgerBuilder,axios));