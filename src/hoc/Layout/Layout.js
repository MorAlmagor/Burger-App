import React, { useState } from 'react';
import { connect } from 'react-redux';
import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout= props => {
    const [sideDrawerisVisible, setSideDrawerisVisible] = useState(false)

    const sideDrawerClosedHandler = () => {
        setSideDrawerisVisible(false);
    }

    const sideDrawertoggleHandler = () => {
        setSideDrawerisVisible(!sideDrawerisVisible);
    };

    return (
        <Aux>
            <Toolbar 
            isAuth={props.isAuth}
                drawerToggleClicked={sideDrawertoggleHandler}/>
            <SideDrawer 
                isAuth={props.isAuth}
                open={sideDrawerisVisible} 
                closed={sideDrawerClosedHandler} />
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    )
};

const mapStateToProps = state => {
    return {
        isAuth: state.auth.token !== null
    };
};

export default connect(mapStateToProps)(Layout);