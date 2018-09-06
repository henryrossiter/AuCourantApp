import React, { Component } from 'react';

import { Alert, Button, Text, View, ActivityIndicator, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';

import { createDrawerNavigator, createStackNavigator, createSwitchNavigator, NavigationActions, createMaterialTopTabNavigator } from 'react-navigation';

import { Permissions, Notifications } from 'expo';

import * as firebase from 'firebase';

import { DashboardScreen, AddDashItemScreen, DashNavigator } from './Dashboard'

import { AlertListScreen, AddAlertScreen, AddRelativeThresholdAlertScreen, AddStaticThresholdAlertScreen, AlertDetailScreen, AlertNavigator } from './Alerts'

import { styles, authStyles } from './styles'


class LoadingScreen extends Component {
  componentDidMount() {
    const { navigate } = this.props.navigation;
    //firebase.auth().onAuthStateChanged(user => {
    //  navigate(user ? 'Main' : 'SignUp')
    navigate('SignUp')
    //})
  }
  render() {
    return (
      <View>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

class SignUpScreen extends Component {
  constructor(){
    super();
    this.state = { email: '', password: '', errorMessage: null }
  }

  handleSignUp = () => {
    const { navigate } = this.props.navigation;
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => navigate('Welcome'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }
  render() {
    const { navigate } = this.props.navigation;
    return (

      <View style={authStyles.container}>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
        style = {authStyles.input}
          autoCapitalize="none"
          placeholder="Email"
          keyboardType='email-address'
          returnKeyType="next"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={authStyles.input}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <TouchableOpacity style = {authStyles.buttonContainer} onPress={this.handleSignUp}>
          <Text  style={authStyles.buttonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {authStyles.buttonContainer} onPress={() => navigate('Login')}>
          <Text  style={authStyles.buttonText}>{"Already have an account? Log in"}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class LoginScreen extends Component {
  constructor(){
    super();
    this.state = { email: '', password: '', errorMessage: null }
  }

  handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('Welcome'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }
    render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={authStyles.container}>
          {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
              {this.state.errorMessage}
            </Text>}
          <TextInput
          style = {authStyles.input}
            autoCapitalize="none"
            placeholder="Email"
            keyboardType='email-address'
            returnKeyType="next"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            secureTextEntry
            style={authStyles.input}
            autoCapitalize="none"
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <TouchableOpacity style = {authStyles.buttonContainer} onPress={this.handleLogin}>
            <Text  style={authStyles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style = {authStyles.buttonContainer} onPress={() => navigate('SignUp')}>
            <Text  style={authStyles.buttonText}>{"Don't have an account? Sign Up"}</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

class WelcomeScreen extends Component {
  constructor(){
    super();
  }

  componentDidMount() {
    this.registerForPushNotifications();
  }

  registerForPushNotifications = async () => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = status;
    console.log(finalStatus);
    if (status !== 'granted'){
      const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') { return; }

    let token = await Notifications.getExpoPushTokenAsync();

    let uid = firebase.auth().currentUser.uid;
    firebase.database().ref("users").child(uid).update({
      userToken: token
    })
  }
  render() {
    return (
      <DrawerNavigator/>
    )
  }
}

export default class App extends Component {
  constructor(){
    super();
    var config = {
      apiKey: "AIzaSyDfw025ab2w3_oA_vXZShimqlmJMAom4rE",
      authDomain: "aucourantexpo.firebaseapp.com",
      databaseURL: "https://aucourantexpo.firebaseio.com",
      storageBucket: "aucourantexpo.appspot.com",
    };
    firebase.initializeApp(config);
  }

  render() {
        return (
        <AppNavigation/>
        );
  }
}


const DrawerNavigator = createMaterialTopTabNavigator(
  {
  Dashboard: {screen: DashNavigator},
  Home: {screen: AlertNavigator}
  }, {
  tabBarOptions: {
    scrollEnabled: false,
    labelStyle: {
      fontSize: 12,
    },

    style: {
      backgroundColor: '#fc8419',
    },
    indicatorStyle: {
      backgroundColor: '#fff'
    }
  },
}
);

const RootStackNavigator = createSwitchNavigator({
  Loading: { screen: LoadingScreen },
  Login: { screen: LoginScreen },
  SignUp: {screen: SignUpScreen },
  Welcome: { screen: WelcomeScreen },

  Main: {screen: DrawerNavigator }

})
const AppNavigation = () => (
  //<DrawerNavigator/>
  <RootStackNavigator/>
);
