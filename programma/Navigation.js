import React from 'react';
import {StyleSheet, View,Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import SetupScreen2 from './screens/SetupScreen2';
import ConfigureScreen from './screens/ConfigureScreen';
import LoadingScreen from './screens/LoadingScreen';
import Riepilogo from './screens/Riepilogo';

const Stack = createStackNavigator();

function Navigation() {
    return (
        <Stack.Navigator
         initialRouteName={"loading"}
         >
            <Stack.Screen
                name="loading"
                component={LoadingScreen}
                options={{ headerTitleAlign: 'center',  headerStyle: {
                    backgroundColor: '#121212',
                    shadowColor: 'white',
                    elevation: 0,
                  },headerTintColor: '#121212',}}
            />
            
            <Stack.Screen
                name="configure"
                component={ConfigureScreen}
                options={{ headerTitleAlign: 'center',headerStyle: {
                    backgroundColor: '#121212',
                    elevation: 0,
                  },headerTintColor: '#121212',
                  headerTitle: () => (
                    <View style={{ backgroundColor: '#121212', marginTop:6 }}>
                        <Image source={require('./assets/logo2.png')} style={styles.image}/>
                    </View>
                  ),
                  headerLeft: null,
                   }} />

            <Stack.Screen
                name="setup"
                component={SetupScreen2}
                options={{ headerTitleAlign: 'center',  headerStyle: {
                    backgroundColor: '#121212',
                    shadowColor: 'white',
                    elevation: 0,
                  },headerTintColor: '#121212',
                  headerTitle: () => (
                    <View style={{ backgroundColor: '#121212', marginTop:6 }}>
                        <Image source={require('./assets/logo2.png')} style={styles.image}/>
                    </View>
                  ),
                  headerLeft: null,
                 }}
                
                 />
            <Stack.Screen
                name="riepilogo"
                component={Riepilogo}
                options={{ headerTitleAlign: 'center',  headerStyle: {
                    backgroundColor: '#121212',
                    shadowColor: 'white',
                    elevation: 0,
                  },headerTintColor: '#121212',
                  headerTitle: () => (
                    <View style={{ backgroundColor: '#121212', marginTop:6 }}>
                        <Image source={require('./assets/logo2.png')} style={styles.image}/>
                    </View>
                  ),
                  headerLeft: null,
                 }}
                
                 />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    image: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center',
        resizeMode: 'contain',
        width: 194,
        height: 60,
    }
});

export default Navigation;