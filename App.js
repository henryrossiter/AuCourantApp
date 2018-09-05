import React, { Component } from 'react';

import { Alert, Button, Text, View, ActivityIndicator, TextInput, AsyncStorage } from 'react-native';

import { createDrawerNavigator, createStackNavigator, createSwitchNavigator, NavigationActions } from 'react-navigation';

import { Permissions, Notifications } from 'expo';

import * as firebase from 'firebase';

import { DashboardScreen, AddDashItemScreen, DashNavigator } from './Dashboard'

import { AlertListScreen, AddAlertScreen, AddRelativeThresholdAlertScreen, AddStaticThresholdAlertScreen, AlertDetailScreen, AlertNavigator } from './Alerts'


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
      <View>
        <Text>Sign Up</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />
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
        <View>
          <Text>Login</Text>
          {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
              {this.state.errorMessage}
            </Text>}
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <Button title="Login" onPress={this.handleLogin} />
          <Button
            title="Don't have an account? Sign Up"
            onPress={() => navigate('SignUp')}
          />
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
      expoPushToken: token
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
        <RootStackNavigator/>
        );
  }
}


const DrawerNavigator = createDrawerNavigator({
  Dashboard: {screen: DashNavigator},
  Home: {screen: AlertNavigator}

});

const RootStackNavigator = createSwitchNavigator({
  Loading: { screen: LoadingScreen },
  Login: { screen: LoginScreen },
  SignUp: {screen: SignUpScreen },
  Welcome: { screen: WelcomeScreen },

  Main: {screen: DrawerNavigator }

})
const AppNavigation = () => (
  <RootStackNavigator/>
);
