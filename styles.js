export const colors = {
  colorOne: '#fc8419',
  colorOneAccent: '#dfa7b3',
  colorTwo: '#212121',
  colorTwoAccent: '#aebdc4',
  colorThree: '#aaaaaa',
  colorBlack: '#000000',
  colorRed: '#8b0000',
  colorBlue: '#483d8b'
}

export const styleScheme = {
  itemRadius: 0,
  borderWidth: 2,
  margin: 2,
  padding: 8,
}

export const authStyles = {
  container: {
     padding: styleScheme.padding,
     flex: 1,
     flexDirection: 'column',
     alignItems: 'stretch',
     justifyContent: 'center',
     backgroundColor: colors.colorTwo
    },
    input:{
        height: 40,
        backgroundColor: 'rgba(225,225,225,0.2)',
        padding: styleScheme.padding,
        margin: styleScheme.margin,
        color: '#000000'
    },
    buttonContainer:{
        height: 40,
        backgroundColor: colors.colorOne,
        padding: styleScheme.padding,
        margin: styleScheme.margin,
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    }
}

export const dashboardStyles = {
  listItemContainer: {
    borderWidth: styleScheme.borderWidth,
    margin: styleScheme.margin,
    borderColor: colors.colorBlack,
    borderBottomLeftRadius: styleScheme.itemRadius,
    borderBottomRightRadius: styleScheme.itemRadius,
    borderTopLeftRadius: styleScheme.itemRadius,
    borderTopRightRadius: styleScheme.itemRadius,
    padding: styleScheme.padding,
    flexDirection: 'column'
  },
  listItemDetailsContainer: {
    flexDirection: 'row',
    margin: styleScheme.margin/2,
    padding: styleScheme.padding/2
  },
  listItemSummaryContainer: {
    flexDirection: 'row',
    margin: styleScheme.margin/2,
    padding: styleScheme.padding/2
  },
  listItemIdContainer: {
    flex: .13,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  listItemPriceContainer: {
    flex: .87,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  listItemExpandContainer: {
    flexDirection: 'row'
  },
  listItemMoreDataContainer: {
    flex: .5,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: styleScheme.borderWidth,
    margin: styleScheme.margin,
    borderColor: colors.colorBlue,
    borderBottomLeftRadius: styleScheme.itemRadius,
    borderBottomRightRadius: styleScheme.itemRadius,
    borderTopLeftRadius: styleScheme.itemRadius,
    borderTopRightRadius: styleScheme.itemRadius,
    padding: styleScheme.padding,
  },
  listItemDeleteContainer: {
    flex: .5,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: styleScheme.borderWidth,
    margin: styleScheme.margin,
    borderColor: colors.colorRed,
    borderBottomLeftRadius: styleScheme.itemRadius,
    borderBottomRightRadius: styleScheme.itemRadius,
    borderTopLeftRadius: styleScheme.itemRadius,
    borderTopRightRadius: styleScheme.itemRadius,
    padding: styleScheme.padding,
  },
  itemIdText: {
    fontWeight: 'bold',
    fontSize: 24
  },
  priceText: {
    fontSize: 32
  },
  detailText: {
    fontSize: 18
  },
  MoreLessText: {
    fontSize: 18,
    textDecorationLine: 'underline'
  }
}

export const styles = {
  bodyContainer: {
    margin: styleScheme.margin,
    flex: 1,
    flexWrap: 'wrap',
  },
  addAlertBodyContainer: {
    margin: styleScheme.margin,
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  inputContainer: {
    height: 50,
    flexDirection: 'row'
  },
  headerContainer: {
    flexDirection:'column',
    marginTop: 24,
    height: 40,
    borderWidth: styleScheme.borderWidth,
    margin: 2,
    borderColor: '#000000',
    borderBottomLeftRadius: styleScheme.itemRadius,
    borderBottomRightRadius: styleScheme.itemRadius,
    borderTopLeftRadius: styleScheme.itemRadius,
    borderTopRightRadius: styleScheme.itemRadius,
  },
  listContainer: {
    flex: .9
  },
  headerStyle: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '100'
  },
  buttonText: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '100'
  },
  listItemStaticThreshold: {
    borderWidth: styleScheme.borderWidth,
    margin: styleScheme.margin,
    borderColor: colors.colorOne,
    borderBottomLeftRadius: styleScheme.itemRadius,
    borderBottomRightRadius: styleScheme.itemRadius,
    borderTopLeftRadius: styleScheme.itemRadius,
    borderTopRightRadius: styleScheme.itemRadius,
    padding: styleScheme.padding,
    backgroundColor: colors.colorOneAccent
  },
  listItemRelativeThreshold: {
    //height: 80,
    borderWidth: styleScheme.borderWidth,
    margin: styleScheme.margin,
    borderColor: colors.colorTwo,
    borderBottomLeftRadius: styleScheme.itemRadius,
    borderBottomRightRadius: styleScheme.itemRadius,
    borderTopLeftRadius: styleScheme.itemRadius,
    borderTopRightRadius: styleScheme.itemRadius,
    padding: 10,
    backgroundColor: colors.colorTwoAccent
  },
  addListItem: {
    height: 40,
    borderWidth: styleScheme.borderWidth,
    margin: styleScheme.margin,
    borderColor: '#000000',
    borderBottomLeftRadius: styleScheme.itemRadius,
    borderBottomRightRadius: styleScheme.itemRadius,
    borderTopLeftRadius: styleScheme.itemRadius,
    borderTopRightRadius: styleScheme.itemRadius,
  }
}

export const newAlertStyles = {
  staticThresholdAlert: {
    borderWidth: styleScheme.borderWidth,
    margin: styleScheme.margin,
    padding: styleScheme.padding,
    borderColor: colors.colorOne,
    borderBottomLeftRadius: styleScheme.itemRadius,
    borderBottomRightRadius: styleScheme.itemRadius,
    borderTopLeftRadius: styleScheme.itemRadius,
    borderTopRightRadius: styleScheme.itemRadius,
    backgroundColor: colors.colorOneAccent
  },
  relativeThresholdAlert: {
    borderWidth: styleScheme.borderWidth,
    margin: styleScheme.margin,
    padding: styleScheme.padding,
    borderColor: colors.colorTwo,
    borderBottomLeftRadius: styleScheme.itemRadius,
    borderBottomRightRadius: styleScheme.itemRadius,
    borderTopLeftRadius: styleScheme.itemRadius,
    borderTopRightRadius: styleScheme.itemRadius,
    backgroundColor: colors.colorTwoAccent
  },
  newAlertTitleText: {
    fontSize: 24,
    textAlign: 'left',
    fontWeight: 'bold'
  },
  newAlertDescText: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'normal'
  }
}
