import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class IngredientCard extends PureComponent {
  render() {
    return (
      <TouchableOpacity onPress={this._handlePress} style={styles.ingredientCard}>
        <Text>{this.props.ingredient.name}</Text>
        {this._renderRightContent()}
      </TouchableOpacity>
    );
  }

  _renderRightContent() {
    if (this.props.amount) return <Text>{this.props.amount}</Text>;
    return this.props.inBar
      ? (
        <TouchableOpacity onPress={this.props.onPressRemoveIngredient}>
          <Icon name="minus" size={24} color="red" />
        </TouchableOpacity>
      )
      : (
        <TouchableOpacity onPress={this.props.onPressAddIngredient}>
          <Icon name="plus" size={24} color="green" />
        </TouchableOpacity>
      )
  }

  _handlePress = () => {
    if (this.props.onPress) this.props.onPress(this.props.id);
  };

  _handlePressAddIngredient = id => {
		AsyncStorage.getItem('cocktailFinder-userIngredients')
    .then(userIngredients => {
		    userIngredients = JSON.parse(userIngredients) || [];
				userIngredients.push(newIngredientId);
        return AsyncStorage.setItem('userIngredients', JSON.stringify(userIngredients))
    })
    .then(() => console.log('success'))
    .catch(err => console.log('error'))
  }

  _handlePressRemoveIngredient = () => {
  }
}

var styles = StyleSheet.create({
  ingredientCard: {
    alignItems: 'center',
    borderBottomColor: 'rgb(224, 224, 224)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: 15
  }
});
