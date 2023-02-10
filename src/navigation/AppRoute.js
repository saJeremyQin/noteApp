import *as React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loading from "../components/Loading";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn } from "../redux/slices";
import * as SecureStore from 'expo-secure-store';
import { setSignIn } from "../redux/slices";

import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect } from 'react';
 
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();


const AppRoute = () => {

    const dispatch = useDispatch();
    const [appIsReady, setAppIsReady] = useState(false);
    const isLoggedIn = useSelector(selectIsLoggedIn);

    useEffect(() => {
        async function bootstrapAsync() {
            let token = '';
            try {
                token = await SecureStore.getItemAsync('userToken');
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
                // console.log(token);
                dispatch(setSignIn(
                    {
                        isLoggedIn: Boolean(token),
                        userToken: token
                    }
                ))
            }
        }
        bootstrapAsync();
    }, []);

    
    if (!appIsReady) {
        return null;
    } else {
        SplashScreen.hideAsync();
    }

    return (
        <NavigationContainer>
            {
                isLoggedIn ? <AppNavigator /> : <AuthNavigator />
            }
        </NavigationContainer>

    );

}

export default AppRoute;