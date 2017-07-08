import React, { Component } from 'react';
import {
  AsyncStorage,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Search from 'react-native-search-box';

import IngredientCard from '../components/IngredientCard';

export default class IngredientsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients: [],
      refreshing: true,
      searchTerm: ''
    }
  }

  componentDidMount() {
    fetch("https://cocktailapi.herokuapp.com/api/ingredients/?type=ids")
    .then(res => res.json())
    .then(ingredients => {
      this.setState({
        ingredients,
        refreshing: false
      });
    })
    .catch(error => console.log(error));

    AsyncStorage.getItem('userIngredientIds').then(userIngredientIds => {
			userIngredientIds = JSON.parse(userIngredientIds) || [];
			this.setState({ userIngredientIds })
		})
    .catch(err => console.log(err));
  }

  render() {
    const searchTermRegEx = new RegExp('\\b' + this.state.searchTerm.replace(/\W/g, '.'), 'gi');
    const searchedIngredients = this.state.ingredients.filter(ingredient => searchTermRegEx.test(ingredient.name));

    return (
      <View style={styles.screenContainer}>
        <Search onChangeText={this._handleChangeSearchText}/>
        <FlatList
          data={searchedIngredients.slice(0, 100)}
          initialNumToRender={10}
          removeClippedSubviews
          keyExtractor={this._keyExtractor}
          onRefresh={() => {}}
          refreshing={this.state.refreshing}
          renderItem={this._renderItem} />
      </View>
    );
  }

  _keyExtractor = (item, index) => `IngredientsScreen-${item.id}`;

  _renderItem = ({item}) => {
    const ingredient = item;
    return (
      <IngredientCard
        id={ingredient.id}
        inBar={this.state.userIngredientIds.includes(ingredient.id)}
        onPressAddIngredient={this._handlePressAddIngredient.bind(this, ingredient.id)}
        onPressRemoveIngredient={this._handlePressRemoveIngredient.bind(this, ingredient.id)}
        // onPress={this._handlePressIngredientCard.bind(this, ingredient)}
        ingredient={ingredient} />
    );
  }

  _handlePressAddIngredient = id => {
    AsyncStorage.getItem('userIngredientIds')
    .then(userIngredientIds => {
        userIngredientIds = JSON.parse(userIngredientIds) || [];
        userIngredientIds.push(id);
        return AsyncStorage.setItem('userIngredientIds', JSON.stringify(userIngredientIds))
    })
    .then(() => AsyncStorage.getItem('userIngredientIds'))
    .then(userIngredientIds => this.setState({ userIngredientIds: JSON.parse(userIngredientIds) }))
    .catch(error => console.log(error))
  }

  _handlePressRemoveIngredient = id => {
    AsyncStorage.getItem('userIngredientIds')
    .then(userIngredientIds => {
        userIngredientIds = JSON.parse(userIngredientIds) || [];
        userIngredientIds = userIngredientIds.filter(userIngredientId => userIngredientId !== id)
        return AsyncStorage.setItem('userIngredientIds', JSON.stringify(userIngredientIds))
    })
    .then(() => AsyncStorage.getItem('userIngredientIds'))
    .then(userIngredientIds => this.setState({ userIngredientIds: JSON.parse(userIngredientIds) }))
    .catch(error => console.log(error))
  }

  // _handlePressIngredientCard = ingredient => {
  //   this.props.navigator.push({
  //     screen: 'ingredientFinder.IngredientScreen',
  //     title: 'Ingredient',
  //     passProps: { ingredient },
  //   });
  // }

  _handleChangeSearchText = searchTerm => {
    this.setState({ searchTerm });
  }
}

var styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  }
});
