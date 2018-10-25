import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraButton from './CameraButton';
import axios from 'axios';
import Tts from 'react-native-tts';

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      bearerToken: [],
      identifiedAs: '',
      initialTokenTime: null,
      mlresults: {
        payload: ["waiting for picture"]
      },
      ADN: []
    }
    this.getJWTToken = this.getJWTToken.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.speakResults = this.speakResults.bind(this);

  }

  takePicture(camera) {
    //camera.pausePreview(); // there is curretly a bug with pausePreview which causes takePictureAsync to fail if you call it on Android pre taking a picture
    this.setState({ loading: true });

    //Set the options for the camera
    const options = {
      base64: true
    };

    // Get the base64 version of the image
    camera.takePictureAsync(options)
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
        //camera.resumePreview();
        this.setState({ loading: false }) // this will make the button clickable again
      })
  }

  componentDidMount() {
    //onload
    this.getJWTToken()
    this.setState({ initialTokenTime: Date.now() })
  }
  getJWTToken() {
    //const assertion = ""
    axios
      .get("http://192.168.1.126:8081")
      .then((response) => {
        const assertion = response.data
        console.log(response)
        axios({
          method: 'post',
          url: "https://www.googleapis.com/oauth2/v4/token",
          data: {
            "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
            "assertion": assertion
          }
        })
          .then((response) => {
            this.setState({ bearerToken: response.data });
          })
      })
      .catch((error) => {
        console.log(error)
      })

  }

  identifyImage(imageData) {
    console.log("identifying image!")
    const payload = {
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
        this.setState({ mlresults: response.data })

      })
      .then(() => {
        this.speakResults()

      })
      .catch((error) => {

        console.log(error.response)
      })
  }
  speakResults() {
    console.log("speak those results")
    
    this.setState({ADN:this.state.mlresults.payload.filter((element) =>
      element.classification.score > 0.9})

    if (ADN.length() >= 3) {
      ADN.map((element) => {
        Tts.speak(element)
      })
    }
    this.setState({ disName: ADN })


  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} accessible={true}>
          {this.state.disName((element) => {
            { element }
          })}</Text>
        <RNCamera ref={ref => { this.camera = ref; }} style={styles.preview}>
          <CameraButton onClick={() => { this.takePicture(this.camera) }} />
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




