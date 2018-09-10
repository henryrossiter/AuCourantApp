import React, { Component } from 'react';
import { Alert, Button, Text, View, ScrollView, TouchableOpacity, AppRegistry, ActivityIndicator, TextInput, Picker, AsyncStorage } from 'react-native';

import { Notifications } from 'expo';

import { colors, styleScheme, dashboardStyles, styles, newAlertStyles } from './styles';

import { IntervalAlert } from './ListItems'

import { createStackNavigator, NavigationActions } from 'react-navigation';

import * as firebase from 'firebase';

import { FontAwesome, MaterialIcons } from '@expo/vector-icons';


export class DashPriceDetailScreen extends Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }
  static navigationOptions = {
    title: 'Alert Details',
  };
  componentDidMount() {
    URL = 'https://www.quandl.com/api/v3/datasets/LME/AB_'+this.props.itemKey+'.json?column_index=1&api_key=bARjQpZVvriz3zaVD6Qa';
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
    const itemId = this.props.itemKey;
    this.itemKey = itemId;
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
          <Text>{item.toString().split(",")[0]+": $"+item.toString().split(",")[1]}</Text>
        </View>
      );
    })
    return (
      <View style={styles.scrollViewStyle}>
        <ScrollView>
          {priceData}
        </ScrollView>
      </View>

    );
  }
}

export class PriceDetailScreen extends Component {
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
          <Text>{item.toString().split(",")[0]+": $"+item.toString().split(",")[1]}</Text>
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
