import React, { useState } from 'react';

import Aux from '../Aux/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

import classes from './Layout.module.css';
import { connect } from 'react-redux';
import sideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = props => {
   const [sideDrawerVisible, setSideDrawerVisible] =useState(false);

const sideDrawerClosedHandler = () => {
   setSideDrawerVisible(false);
}

const sideDrawerToggleHandler = () => {
    setSideDrawerVisible(!sideDrawerVisible);
}

        return(
            <Aux>
            <Toolbar
            isAuth={props.isAuthenticated} 
            drawerToggleClicked={sideDrawerToggleHandler}/>
            <SideDrawer 
            isAuth={props.isAuthenticated} 
            open={sideDrawerVisible} 
            closed={sideDrawerClosedHandler}/>
            <main className={classes.Content}>
                {props.children}
            </main>
            </Aux>
        )
}

const mapStateToProps = state => {
    return{
        isAuthenticated: state.auth.token !== null
    };
};


export default connect(mapStateToProps)(Layout);