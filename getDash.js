import * as firebase from 'firebase';

export class FirebaseFetcher {
  constructor(){
    this.currentSnapshot = null;
    this.uid = firebase.auth().currentUser.uid;
    this.ref = firebase.database().ref("users")
  }
  getDataFromFirebase() {

  }
  getListings() {
    this.ref.once("value", setListing, showError);
  };

  setListing(snapshot){
      currentSnapshot = snapshot..child(this.uid).child("dash").val()
  }

  showError(e){
      console.log(e);
  }
  getData(){
    this.getListings();
    return this.currentSnapshot;
  }
}
