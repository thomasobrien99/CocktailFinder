import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class CocktailCard extends PureComponent {
  _handlePress = () => {
    this.props.onPress(this.props.id);
  };

  render() {
    return (
      <TouchableOpacity onPress={this._handlePress} style={styles.cocktailCard}>
        <Text>{this.props.name}</Text>
        {this._renderRightContent()}
      </TouchableOpacity>
    );
  }

  _renderRightContent() {
    return this.props.isFavorite
      ? (
        <TouchableOpacity onPress={this.props.onPressRemoveCocktail}>
          <Icon name="star" size={24} color="yellow" />
        </TouchableOpacity>
      )
      : (
        <TouchableOpacity onPress={this.props.onPressAddCocktail}>
          <Icon name="star-o" size={24} color="grey" />
        </TouchableOpacity>
      )
  }
}

var styles = StyleSheet.create({
  cocktailCard: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgb(224, 224, 224)',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 15
  }
});
