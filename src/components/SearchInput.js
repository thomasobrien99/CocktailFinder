import React, { Component } from 'react';
import { TextInput, View } from 'react-native';

export default class CocktailsScreen extends Component {
  render() {
    return (
      <View>
        <TextInput onChange={this.props.onChange} value={this.props.value} />
      </View>
    )
  }
}
