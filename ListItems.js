import React, { Component } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
//import { Icon } from 'react-native-elements';

import { styles, dashboardStyles } from './styles';


export class StaticThresholdAlert extends Component{
  constructor(props) {
    super(props);
    this.threshold = this.props.threshold;
    this.direction = this.props.direction;
    this.stock = this.props.stock;
  }
  getCurrPrice() {
    return 0;
  }
  getDescription() {
    return "You will be notified when "+this.stock+" "+this.direction+" "+this.threshold ;
  }
  getItem(){
    return this.stock;
  }
  render(){
    return(
      <View style = {styles.listItemStaticThreshold}>
        <Text>{this.getDescription()}</Text>
      </View>
    );

  }
}

export class IntervalAlert extends Component{
  constructor(props) {
    super(props);
    this.interval = this.props.interval;
    this.stock = this.props.stock;
  }
  getCurrPrice() {
    return 0;
  }
  getDescription() {
    return "You will be notified of the price of "+this.stock+" every "+this.interval;
  }
  getItem(){
    return this.stock;
  }
  render(){
    return(
      <View style = {styles.listItemContainer}>
        <Text>{this.getDescription()}</Text>
      </View>
    );

  }
}

export class RelativeThresholdAlert{
  constructor(stock, threshold, direction){
    this.stock = stock;
    this.threshold = threshold;
    this.direction = direction;
    this.lastTriggered = '';
    this.currPrice = 0;
  }
  getCurrPrice() {
    return 0;
  }
  getDescription() {
    return "You will be notified when "+this.stock+" rises/falls more than "+this.threshold+"% in one hour.";
  }
  getStyle() {
    return styles.listItemRelativeThreshold;
  }
  getItem(){
    return this.stock;
  }
}
