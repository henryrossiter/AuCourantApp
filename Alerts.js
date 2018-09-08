import React, { Component } from 'react';
import { Alert, Button, Text, View, ScrollView, TouchableOpacity, AppRegistry, ActivityIndicator, TextInput, Picker, AsyncStorage } from 'react-native';

import { Notifications } from 'expo';

import { colors, styleScheme, dashboardStyles, styles, newAlertStyles } from './styles';

import { IntervalAlert } from './ListItems'

import { createStackNavigator, NavigationActions } from 'react-navigation';

import * as firebase from 'firebase';

import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

function addNot(newItem, newInt) {
  console.log(Array.from(arguments));
  this.state.notList.unshift(Array.from(arguments));
  this.saveKey(this.state.notList);
  this.getKey();
  this.saveAlertsToFirebase();
}
function clearAlerts(){
  this.clearList();
  this.saveAlertsToFirebase();
}

export class AlertListScreen extends Component {
  constructor(){
    super();
    this.state = {
      notList: [[]]
    }
    addNot = addNot.bind(this);
    clearAlerts = clearAlerts.bind(this);
  }
  static navigationOptions = {
    title: 'Active Alerts',
  };
  async getKey() {
    try {
      const value = await AsyncStorage.getItem('alerts');
      if (value != null){
        //Alert.alert(value)
        this.setState({ notList: JSON.parse(value) });
      } else {
        this.setState({notList: []})
      }
    } catch (error) {
      console.log("Error retrieving notList data" + error);
    }
  }
  async saveKey(value) {
    try {
      await AsyncStorage.setItem('alerts', JSON.stringify(value.slice(0)));
    } catch (error) {
      console.log("Error saving notList data" + error);
    }
  }
  saveAlertsToFirebase() {
    //add alert to firebase
    let uid = firebase.auth().currentUser.uid;
    firebase.database().ref("users").child(uid).update({
      alerts : this.state.notList.slice(0)
    })
  }
  async clearList() {
    try {
      await AsyncStorage.removeItem('alerts');
      this.setState({notList: []});
    } catch (error) {
      console.log("Error resetting notList data" + error);
    }
  }
  componentDidMount(){
    let uid = firebase.auth().currentUser.uid;
    firebase.database().ref("users").child(uid).child("alerts").once('value').then((snapshot) => {
      if (snapshot.val() && snapshot.val().length>0){
        this.setState({ notList: snapshot.val(),
                          isLoading: false});
      } else {
        this.setState({isLoading: false});
      }

    });
  }
  render() {
    const { navigate } = this.props.navigation;
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      );
    }

    var notList = this.state.notList.map((params, index) => {
      return (
        <TouchableOpacity onPress={() => navigate('AlertDetails', {itemKey: params[0]})}
                          key={index}>
          <IntervalAlert stock={params[0]}
                                interval={params[1]}>
          </IntervalAlert>
        </TouchableOpacity>
      );
    })
    return (
      <View style={styles.bodyContainer}>
        <ScrollView>
          { notList }
        </ScrollView>
        <TouchableOpacity onPress={() => {
            if (this.state.notList.length > 10){
              Alert.alert('You have already added that maximum amount of alerts!');
            }
            else {
              navigate('NewAlert')
            }
          }} style={styles.addListItem}>
          <Text style={styles.buttonText}>New</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            clearAlerts();
          }} style={styles.addListItem}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export class AddAlertScreen extends Component {
  static navigationOptions = {
    title: 'Choose New Alert Type',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView>
        <TouchableOpacity onPress={() => navigate('AddIntervalAlert')} style={styles.listItemContainer}>
          <Text style = {newAlertStyles.newAlertTitleText}>Interval Alert</Text>
          <Text style = {newAlertStyles.newAlertDescText}>Receive price alerts at a scheduled time interval</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

export class AddIntervalAlertScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      item: "al",
      interval: "day"
    }
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Schedule new Alert',
    };
  };
  render() {
    const { navigate } = this.props.navigation;
    var item = "al";
    var interval = "day";
    return (
      <View style ={styles.bodyContainer}>
        <Text style = {{}}>{'Notify me with the price of '}</Text>
        <View style={styles.inputContainer}>
          <Picker
            style={{height: 50, flex:.5}}
            selectedValue={this.state.item}
            onValueChange={(itemValue, itemIndex) => this.setState({item: itemValue})}>
            <Picker.Item label="Aluminum" value="al" />
            <Picker.Item label="Copper" value="cu" />
            <Picker.Item label="Zinc" value="zi"/>
          </Picker>
          <Text>{" every "}</Text>
          <Picker
            style={{height: 50, flex:.5}}
            selectedValue={this.state.interval}
            onValueChange={(itemValue, itemIndex) => this.setState({interval: itemValue})}>
            <Picker.Item label="hour" value="hour" />
            <Picker.Item label="day" value="day" />
            <Picker.Item label="week" value="week" />
            <Picker.Item label="month" value="month" />
          </Picker>
        </View>
        <TouchableOpacity
          onPress={() => {
            addNot(this.state.item, this.state.interval);
            navigate('Home')
          }}>
          <View style = {styles.listItemContainerCentered}>
            <MaterialIcons name="playlist-add" size={32} color={colors.colorOne} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}



export class AlertDetailScreen extends Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
    this.itemKey = "CU"
  }
  static navigationOptions = {
    title: 'Alert Details',
  };
  componentDidMount() {
    URL = 'https://www.quandl.com/api/v3/datasets/LME/AB_'+this.itemKey+'.json?column_index=1&api_key=bARjQpZVvriz3zaVD6Qa';
    return fetch(URL)
    .then((response) => response.json())
    .then((responseJson) => {
    this.setState({
      isLoading: false,
      dataSource: responseJson.dataset.data,
    }, function(){
      });
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  render() {

    const { navigation } = this.props;
    const itemId = navigation.getParam('itemKey', 'NO-ID');
    this.itemKey = itemId;
    const { navigate } = this.props.navigation;
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    var priceData = this.state.dataSource.map((item, index) => {
      return (
        <View key={index}>
          <Text>{item.toString()}</Text>
        </View>
      );
    })
    return (
      <ScrollView>
        {priceData}
      </ScrollView>
    );
  }
}

export const  AlertNavigator = createStackNavigator({
  Home: {screen: AlertListScreen},
  AlertDetails: {screen: AlertDetailScreen},
  NewAlert: {screen: AddAlertScreen},
  AddIntervalAlert: {screen: AddIntervalAlertScreen}
});
