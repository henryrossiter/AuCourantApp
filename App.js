import React, { Component } from 'react';

import { Alert, Button, Text, View, ActivityIndicator, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';

import { createTabNavigator, createStackNavigator, createSwitchNavigator, NavigationActions, createBottomTabNavigator } from 'react-navigation';

import { Permissions, Notifications } from 'expo';

import * as firebase from 'firebase';

import { DashboardScreen, AddDashItemScreen, DashNavigator } from './Dashboard';

import { AlertListScreen, AddAlertScreen, AddRelativeThresholdAlertScreen, AddStaticThresholdAlertScreen, AlertDetailScreen, AlertNavigator } from './Alerts';

import { styles, authStyles, colors } from './styles';

import { FontAwesome } from '@expo/vector-icons';


class LoadingScreen extends Component {
  componentDidMount() {
    const { navigate } = this.props.navigation;
    //firebase.auth().onAuthStateChanged(user => {
    //  navigate(user ? 'Main' : 'SignUp')
    navigate('Login');
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

    let expoTok = await Notifications.getExpoPushTokenAsync();
    let senderConfig = {
      fcmSenderId: "1068249737288"
    };
    //let fireTok = await Notifications.getDevicePushTokenAsync(senderConfig);
    let uid = firebase.auth().currentUser.uid;

    firebase.database().ref("users").child(uid).update({
      expoToken: expoTok,
      //fireToken: fireTok,
    })
  }
  render() {
    return (
      <TabNavigator/>
    )
  }
}

export default class App extends Component {
  constructor(){
    super();
    console.ignoredYellowBox = ['Setting a timer'];
    const config = {
      apiKey: "AIzaSyDfw025ab2w3_oA_vXZShimqlmJMAom4rE",
      authDomain: "aucourantexpo.firebaseapp.com",
      databaseURL: "https://aucourantexpo.firebaseio.com",
      storageBucket: "aucourantexpo.appspot.com",
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }
  render() {
    return (
      <AppNavigation/>
    );
  }
}


const TabNavigator = createBottomTabNavigator(
  {
  Dashboard: {screen: DashNavigator,
    navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <FontAwesome name="dashboard" size={32} color={tintColor} />
          )
        }},
  Home: {screen: AlertNavigator,
    navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <FontAwesome name="exclamation-triangle" size={28} color={tintColor} />
          )
        }}
  }, {
  tabBarOptions: {
    activeTintColor: colors.colorOne,
    showLabel: false,
    style: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    tabStyle: {
      alignItems: 'center',
      justifyContent: 'center'
    }
}
}
);

const RootSwitchNavigator = createSwitchNavigator({
  Loading: { screen: LoadingScreen },
  Login: { screen: LoginScreen },
  SignUp: {screen: SignUpScreen },
  Welcome: { screen: WelcomeScreen },

  Main: {screen: TabNavigator }

})
const AppNavigation = () => (
  <RootSwitchNavigator/>
);
