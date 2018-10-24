import React, { Component }  from 'react';
import { StyleSheet, Image, TouchableHighlight, Dimensions } from 'react-native';

export default class CameraButton extends Component {
    render()
    {
        return (
        <TouchableHighlight onPress={this.props.onClick}  >
            <Image style={styles.captureButton} accessible={true} accessibilityLabel="Take picture"/>
        </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    captureButton: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      backgroundColor: 'rgba(0,0,0,0)'
    }
});
