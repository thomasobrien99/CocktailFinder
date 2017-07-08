import React, { Component } from 'react';
import {
  AsyncStorage,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Search from 'react-native-search-box';

import CocktailCard from '../components/CocktailCard';

export default class CocktailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cocktails: [],
      filter: 'all',
      refreshing: true,
      searchTerm: ''
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    fetch("https://cocktailapi.herokuapp.com/api/cocktails/?type=ids")
    .then(res => res.json())
    .then(cocktails => {
      this.setState({
        cocktails,
        refreshing: false
      });
    })
    .catch(error => console.log(error));

    AsyncStorage.getItem('userCocktailIds')
    .then(userCocktailIds => {
			userCocktailIds = JSON.parse(userCocktailIds) || [];
			this.setState({ userCocktailIds })
		})
    .catch(err => console.log(err));

    AsyncStorage.getItem('userIngredientIds')
    .then(userIngredientIds => {
      userIngredientIds = JSON.parse(userIngredientIds)
      let queryString = userIngredientIds.join('^')

      return fetch(`https://cocktailapi.herokuapp.com/api/cocktails/?filter=ingredients&type=ids&params=${queryString}`)
    })
    .then(res => res.json())
    .then(mixableCocktails => this.setState({ mixableCocktails }))
    .catch(err => console.log(err))
  }

  render() {
    const isFilterAll = this.state.filter === 'all';
    const isFilterFavorite = this.state.filter === 'favorite';
    const isFilterMake = this.state.filter === 'make';

    const iconColor = "grey";
    const activeIconColor = "white";

    const filteredCocktails = this._filterCocktails(this.state.cocktails);
    const searchTermRegEx = new RegExp('\\b' + this.state.searchTerm.replace(/\W/g, '.'), 'gi');
    const displayCocktails = filteredCocktails.filter(cocktail => searchTermRegEx.test(cocktail.name));

    return (
      <View style={styles.screenContainer}>
        <View style={styles.filterButtonsContainer}>
          {this._renderFilterButtons()}
        </View>
        <Search onChangeText={this._handleChangeSearchText}/>
        <FlatList
          data={displayCocktails}
          keyExtractor={this._keyExtractor}
          onRefresh={() => {}}
          refreshing={this.state.refreshing}
          renderItem={this._renderItem} />
      </View>
    );
  }

  onNavigatorEvent(event) {
    if (event.id === 'bottomTabSelected') {
      AsyncStorage.getItem('userIngredientIds')
      .then(userIngredientIds => {
        userIngredientIds = JSON.parse(userIngredientIds)
        let queryString = userIngredientIds.join('^')

        return fetch(`https://cocktailapi.herokuapp.com/api/cocktails/?filter=ingredients&type=ids&params=${queryString}`)
      })
      .then(res => res.json())
      .then(mixableCocktails => this.setState({ mixableCocktails }))
      .catch(err => console.log(err))
    }
  }

  _filterCocktails(cocktails) {
    if(this.state.filter === 'all') return cocktails;
    if(this.state.filter === 'favorite') {
      return cocktails.filter(cocktail => this.state.userCocktailIds.includes(cocktail.id));
    }
    if(this.state.filter === 'make') {
      return this.state.mixableCocktails;
    }
  }

  _renderFilterButtons() {
    const iconColor = "white";
    const activeIconColor = "grey";

    return ['all', 'favorite', 'make'].map(filter => {
      const isFilterActive = this.state.filter === filter;
      return (
        <TouchableOpacity disabled={isFilterActive} key={`CocktailsScreen-${filter}`} onPress={this._handlePressFilterButton.bind(this, filter)} style={[styles.filterButton, isFilterActive && styles.filterButtonActive]}>
            <Icon color={isFilterActive ? activeIconColor : iconColor} name={this._getFilterIconName(filter)} size={24} />
            <Text style={[styles.filterButtonText, isFilterActive && styles.filterButtonActiveText]}>{filter.toUpperCase()}</Text>
        </TouchableOpacity>
      );
    });
  }

  _getFilterIconName(filter) {
    switch(filter) {
      case 'all': return 'list';
      case 'favorite': return 'star';
      case 'make': return 'glass';
    }
  }

  _keyExtractor = (item, index) => `CocktailsScreen-${item.id}`;

  _renderItem = ({item}) => {
    const cocktail = item;
    return (
      <CocktailCard
        id={cocktail.id}
        isFavorite={this.state.userCocktailIds.includes(cocktail.id)}
        onPressAddCocktail={this._handlePressAddCocktail.bind(this, cocktail.id)}
        onPressRemoveCocktail={this._handlePressRemoveCocktail.bind(this, cocktail.id)}
        onPress={this._handlePressCocktailCard.bind(this, cocktail)}
        name={cocktail.name} />
    );
  }

  _handlePressFilterButton(filter) {
    this.setState({ filter });
  }

  _handlePressAddCocktail = id => {
    AsyncStorage.getItem('userCocktailIds')
    .then(userCocktailIds => {
        userCocktailIds = JSON.parse(userCocktailIds) || [];
        userCocktailIds.push(id);
        return AsyncStorage.setItem('userCocktailIds', JSON.stringify(userCocktailIds))
    })
    .then(() => AsyncStorage.getItem('userCocktailIds'))
    .then(userCocktailIds => this.setState({ userCocktailIds: JSON.parse(userCocktailIds) }))
    .catch(error => console.log(error))
  }

  _handlePressRemoveCocktail = id => {
    AsyncStorage.getItem('userCocktailIds')
    .then(userCocktailIds => {
        userCocktailIds = JSON.parse(userCocktailIds) || [];
        userCocktailIds = userCocktailIds.filter(userCocktailId => userCocktailId !== id)
        return AsyncStorage.setItem('userCocktailIds', JSON.stringify(userCocktailIds))
    })
    .then(() => AsyncStorage.getItem('userCocktailIds'))
    .then(userCocktailIds => this.setState({ userCocktailIds: JSON.parse(userCocktailIds) }))
    .catch(error => console.log(error))
  }

  _handlePressCocktailCard = cocktail => {
    this.props.navigator.push({
      screen: 'cocktailFinder.CocktailScreen',
      title: 'Cocktail',
      passProps: { cocktail },
    });
  }

  _handleChangeSearchText = searchTerm => {
    this.setState({ searchTerm });
  }
}

var styles = StyleSheet.create({
  filterButtonsContainer: {
    backgroundColor: 'grey',
    flexDirection: 'row',
    height: 64,
    paddingVertical: 5
  },
  filterButton: {
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'grey',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 5
  },
  filterButtonActive: {
    backgroundColor: '#f7f7f7'
  },
  filterButtonActiveText: {
    color: 'grey'
  },
  filterButtonText: {
    color: 'white',
    marginLeft: 10
  },
  screenContainer: {
    flex: 1,
  }
});
