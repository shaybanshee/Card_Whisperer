import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, ActivityIndicator} from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraButton from './CameraButton';

export default class App extends Component {
  constructor(props)
  {
    super(props)

    this.state = {
      loading: false
    }
  }

  takePicture()
  {
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
        
      })
      .catch((e) => {
        // e is the error code
        this.setState({loading: false})
      })
      .finally(() => {
        this.camera.resumePreview();
        this.setState({loading: false}) // this will make the button clickable again
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Card Whisperer</Text>
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

