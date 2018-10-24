import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, ActivityIndicator, Alert} from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraButton from './CameraButton';
import axios from 'axios';
export default class App extends Component {
  constructor(props)
  {
    super(props)

    this.state = {
      loading: false,
      bearerToken: [],
      identifiedAs: '',
      initialTokenTime: null,
    }
    this.getJWTToken=this.getJWTToken.bind(this);
    console.log("Hello")
  }
  
  takePicture()
  {
    console.log("start of take picture")
    this.camera.pausePreview();
    this.setState({loading: true});

    //Set the options for the camera
    const options = {
      base64: true
    };

    // Get the base64 version of the image
    this.camera.takePictureAsync(options)
      .then(data => {
        // data is your base64 string
        console.log("taking picture")
        this.identifyImage(data.base64);
        
      })
      .catch((e) => {
        // e is the error code
        console.log(e)
        
      })
      .finally(() => {
        this.camera.resumePreview();
        this.setState({loading: false}) // this will make the button clickable again
      })
  }
  componentDidMount(){
    //onload
    this.getJWTToken()
    this.setState({initialTokenTime: Date.now()})
  }
  getJWTToken() {
    //const assertion = ""
    axios
    .get("http://10.1.10.184:8081")
    .then((response) => {
      const assertion = response.data
      console.log(response)
      axios({
        method: 'post',
        url: "https://www.googleapis.com/oauth2/v4/token",
        data: {
          "grant_type" : "urn:ietf:params:oauth:grant-type:jwt-bearer",
          "assertion": assertion
        }
      })
        .then((response) => {
          this.setState({bearerToken: response.data});      
        })
    })
    .catch((error) => {
      console.log(error)
    })
    
  }

  identifyImage(imageData){
    const payload =  {
        "payload": {
          "image": {
            "imageBytes": imageData
          },
        }
    };

      axios({
        method: 'post',
        url: "https://automl.googleapis.com/v1beta1/projects/totemic-ground-219514/locations/us-central1/models/ICN6280896592581654906:predict",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + this.state.bearerToken.access_token 
        }, 
        data: payload    
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) =>{
        console.log(error.response)
      })
  }
  
  displayAnswer(identifiedImage){

    // Dismiss the acitivty indicator
    this.setState((prevState, props) => ({
        identifiedAs:identifiedImage,
        loading:false
    }));

// Show an alert with the answer on
     Alert.alert(
        this.state.identifiedAs,
        '',
        { cancelable: false }
    )

    // Resume the preview
    this.camera.resumePreview();
}


  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Card Whisperer {this.state.bearerToken.access_token}</Text>
        <RNCamera ref={ref => {this.camera = ref;}} style={styles.preview}>
          <ActivityIndicator size="large" style={styles.loadingIndicator} color="#fff" animating={this.state.loading}/>
          <CameraButton buttonDisabled={this.state.loading} onClick={this.takePicture.bind(this)}/>
        </RNCamera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  loadingIndicator: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  }

});

