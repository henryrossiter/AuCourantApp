import React, { Component } from 'react';
import { Alert, Button, Text, View, ScrollView, TouchableOpacity, AppRegistry, ActivityIndicator, Picker, AsyncStorage } from 'react-native';

import { colors, styleScheme, dashboardStyles, styles, newAlertStyles } from './styles';

import { createStackNavigator, NavigationActions } from 'react-navigation';

import { Notifications } from 'expo';

import * as firebase from 'firebase';

function addCom(newStock) {
  this.state.stockList.unshift(newStock)
  this.saveKey(this.state.stockList)
  this.getKey()
  this.saveDashToFirebase()
}
function removeCom(index){
  this.state.stockList.splice(index,1)
  this.saveKey(this.state.stockList);
  this.getKey();
  this.saveDashToFirebase();
}
function clearCom(){
  this.clearList();
  this.saveDashToFirebase();
}

export class DashboardScreen extends Component {
  constructor(){
    super();
    this.state = {
      stockList: [],
      isLoading: true
    }
    addCom = addCom.bind(this);
    removeCom = removeCom.bind(this);
    clearCom = clearCom.bind(this);
  }
  static navigationOptions = {
    title: 'Current Prices',
  };
  async getKey() {
    try {
      const value = await AsyncStorage.getItem('dash');
      if (value != null){
        //Alert.alert(value)
        this.setState({ stockList: [] })
        this.setState({ stockList: JSON.parse(value) });
      } else {
        this.setState({ stockList: [] });
      }
    } catch (error) {
      console.log("Error retrieving stockList data" + error);
    }
  }
  async saveKey(value) {
    try {
      await AsyncStorage.setItem('dash', JSON.stringify(value));
    } catch (error) {
      console.log("Error saving stockList data" + error);
    }
  }
  async clearList() {
    try {
      await AsyncStorage.removeItem('dash');
      //const value = await AsyncStorage.getItem('dash');
      this.setState({stockList: []});
    } catch (error) {
      console.log("Error resetting stockList data" + error);
    }
  }
  saveDashToFirebase(){
    let uid = firebase.auth().currentUser.uid;
    firebase.database().ref("users").child(uid).update({
      dash: this.state.stockList
    })

  }
  componentDidMount(){
    let uid = firebase.auth().currentUser.uid;
    firebase.database().ref("users").child(uid).child("dash").once('value').then((snapshot) => {
        if (snapshot.val() && snapshot.val().length>0){
          this.setState({ stockList: snapshot.val(),
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

    var stocks = this.state.stockList.map((type, index)=> {
    return(
      <Commodity key={index} stock={type} index={index}></Commodity>
    );
  })

    return (
      <View style={styles.bodyContainer}>
        <ScrollView>
          {stocks}
        </ScrollView>
        <TouchableOpacity onPress={() => {
            if (this.state.stockList.length > 10) {
              Alert.alert('You have already added that maximum amount of items on your dashboard!');
            }
            else {
              navigate('NewDashItem')
            }
          }} style={styles.addListItem}>
          <Text style={styles.buttonText}>New</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            clearCom();
          }} style={styles.addListItem}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


class Commodity extends Component{
  constructor(props){
    super(props);
    this.state ={ isLoading: true,
                  isExpanded: false}
    this.stock = this.props.stock;
    this.currPrice = 0;
  }
  getItem(){
    return this.props.stock;
  }
  componentDidMount() {
    URL = 'https://www.quandl.com/api/v3/datasets/LME/AB_'+this.props.stock+'.json?column_index=1&api_key=bARjQpZVvriz3zaVD6Qa';
    return fetch(URL)
    .then((response) => response.json())
    .then((responseJson) => {
    this.setState({
      isExpanded: false,
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
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      );
    }
    else if (this.state.isExpanded==false) {
      return (
        <View style = {styles.listItemContainer}>
          <View style = {dashboardStyles.listItemSummaryContainer}>
            <View style = {dashboardStyles.listItemIdContainer}>
              <Text style= {dashboardStyles.itemIdText}>{this.stock.charAt(0).toUpperCase()+this.stock.substring(1)+": "}</Text>
            </View>
            <View style = {dashboardStyles.listItemPriceContainer}>
              <Text style= {dashboardStyles.priceText}>{"$"+this.state.dataSource[0].toString().split(",")[1]}</Text>
            </View>
          </View>
          <View style = {dashboardStyles.listItemDetailsContainer}>
            <Text style= {dashboardStyles.detailText}>{"Last updated: "+this.state.dataSource[0].toString().split(",")[0]+" | "}</Text>
            <TouchableOpacity onPress={ () => {this.setState({isExpanded: true})}}>
              <Text style = {dashboardStyles.MoreLessText}>More</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style = {dashboardStyles.listItemContainer}>
          <View style = {dashboardStyles.listItemSummaryContainer}>
            <View style = {dashboardStyles.listItemIdContainer}>
              <Text style= {dashboardStyles.itemIdText}>{this.stock.charAt(0).toUpperCase()+this.stock.substring(1)+": "}</Text>
            </View>
            <View style = {dashboardStyles.listItemPriceContainer}>
              <Text style= {dashboardStyles.priceText}>{"$"+this.state.dataSource[0].toString().split(",")[1]}</Text>
            </View>
          </View>
          <View style = {dashboardStyles.listItemDetailsContainer}>
            <Text style= {dashboardStyles.detailText}>{"Last updated: "+this.state.dataSource[0].toString().split(",")[0]+" | "}</Text>
            <TouchableOpacity onPress={() => { this.setState({isExpanded: false}) }}>
              <Text style = {dashboardStyles.MoreLessText}>Less</Text>
            </TouchableOpacity>
          </View>
          <View style={dashboardStyles.listItemExpandContainer}>
            <TouchableOpacity style = {dashboardStyles.listItemMoreDataContainer}>
              <Text>More Data</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              removeCom(this.props.index);
            }}
            style = {dashboardStyles.listItemDeleteContainer}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

  }
}


export class AddDashItemScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      item: "al"
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'New Price Tile',
    };
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style ={styles.addAlertBodyContainer}>
      <Text style = {{}}>{'Within the '}</Text>
      <View style={styles.inputContainer}>
        <Picker
          style={{height: 50, flex:1}}
          selectedValue={"LME"}>
          <Picker.Item label="London Metal Exchange" value="LME" />
        </Picker>
        </View>
      <Text style = {{}}>{'I would like to track the price of '}</Text>
      <View style={styles.inputContainer}>
        <Picker
          style={{height: 50, flex:1}}
          selectedValue={this.state.item}
          onValueChange={(itemValue, itemIndex) => this.setState({item: itemValue})}>
          <Picker.Item label="Aluminum" value="al" />
          <Picker.Item label="Copper" value="cu" />
          <Picker.Item label="Zinc" value="zi"/>
        </Picker>
        </View>

        <Button
          title = "Add to Dashboard"
          onPress={() => {
            addCom(this.state.item);
            navigate('Dash');
          }}
          style={styles.addListItem}>
        </Button>
      </View>
    );
  }
}

export const DashNavigator = createStackNavigator({
  Dash: {screen: DashboardScreen},
  NewDashItem: {screen: AddDashItemScreen}
});
