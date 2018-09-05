import React, { Component } from 'react';
import { Alert, Button, Text, View, ScrollView, TouchableOpacity, AppRegistry, ActivityIndicator, TextInput, Picker, AsyncStorage } from 'react-native';

import { Notifications } from 'expo';

import { colors, styleScheme, dashboardStyles, styles, newAlertStyles } from './styles';

import { IntervalAlert } from './ListItems'

import { createStackNavigator, NavigationActions } from 'react-navigation';

import * as firebase from 'firebase';

function addNot(newAlert) {
  this.state.notList.push(newAlert)
  this.saveKey(this.state.notList)
  this.getKey( this.state.notList )
}
function clearAlerts(){
  this.clearList();
}
function getPrice(stock){
  URL = 'https://www.quandl.com/api/v3/datasets/LME/AB_al.json?column_index=1&api_key=bARjQpZVvriz3zaVD6Qa';
  fetch(URL).then(response => {
    return response.json();
  })
  .then(data => {
  // Work with JSON data here
  console.log(data.dataset.data[0].toString());
}).catch(err => {
  // Do something for an error here
});
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
      await AsyncStorage.setItem('alerts', JSON.stringify(value));
    } catch (error) {
      console.log("Error saving notList data" + error);
    }
  }
  async clearList() {
    try {
      await AsyncStorage.removeItem('alerts');
      this.setState({notList: []});
    } catch (error) {
      console.log("Error resetting notList data" + error);
    }
  }

  componentDidMount() {
    this.getKey();

  }
  render() {
    const { navigate } = this.props.navigation;
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
        <TouchableOpacity onPress={() => navigate('AddIntervalAlert')} style={newAlertStyles.staticThresholdAlert}>
          <Text style = {newAlertStyles.newAlertTitleText}>Interval Alert</Text>
          <Text style = {newAlertStyles.newAlertDescText}>Receive price alerts at a scheduled time interval</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

export class AddRelativeThresholdAlertScreen extends Component {
  constructor(){
    super();
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'New Relative Alert',
    };
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style ={styles.bodyContainer}>
      <TouchableOpacity
        onPress={() => {
          //newAlert = new RelativeThresholdAlert('SBX', 55, 'up')
          addNot(['SBX', 55, 'up'])

          //add to firebase database


          navigate('Home')}}
        style={styles.addListItem}>
        <Text style={styles.buttonText}>New</Text>
      </TouchableOpacity>
      </View>
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
    return (
      <View style ={styles.addAlertBodyContainer}>
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
        <Button
          title = "Save"
          onPress={() => {
          newAlert = [this.state.item, this.state.interval]
          addNot(newAlert)

          //add alert to firebase
          let uid = firebase.auth().currentUser.uid;
          firebase.database().ref("users").child(uid).update({
            newIntervalAlert : {
              item : this.state.item,
              interval : this.state.interval
            }
          })

          navigate('Home')}} style={styles.addListItem}>
        </Button>
      </View>
    );
  }
}

export class AddStaticThresholdAlertScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      threshold: '0',
      item: "al",
      direction: "rises"
    }
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'New Static Threshold Alert',
    };
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style ={styles.addAlertBodyContainer}>
        <Text style = {{}}>{'Notify me when the price of '}</Text>
        <View style={styles.inputContainer}>
          <Picker
            style={{height: 50, flex:.5}}
            selectedValue={this.state.item}
            onValueChange={(itemValue, itemIndex) => this.setState({item: itemValue})}>
            <Picker.Item label="Aluminum" value="al" />
            <Picker.Item label="Copper" value="cu" />
            <Picker.Item label="Zinc" value="zi"/>
          </Picker>
          <Picker
            style={{height: 50, flex:.5}}
            selectedValue={this.state.direction}
            onValueChange={(itemValue, itemIndex) => this.setState({direction: itemValue})}>
            <Picker.Item label="rises above" value="rises above" />
            <Picker.Item label="falls below" value="falls below" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={{height: 50, flex: 1}}
            keyboardType='numeric'
            maxLength={5}
            onChangeText={(text) => this.setState({threshold: text})}
            value={this.state.threshold}
          />
        </View>
        <Button
          title = "Save"
          onPress={() => {
          newAlert = [this.state.item, this.state.threshold, this.state.direction]//new StaticThresholdAlert(this.state.item, this.state.threshold, this.state.direction)
          addNot(newAlert)
          navigate('Home')}} style={styles.addListItem}>
        </Button>
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
  AddStaticThreshold: {screen: AddStaticThresholdAlertScreen},
  AddRelativeThreshold: {screen: AddRelativeThresholdAlertScreen},
  AddIntervalAlert: {screen: AddIntervalAlertScreen}
});
