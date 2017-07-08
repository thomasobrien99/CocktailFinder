import React, { Component } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

import assets from '../assets';
import IngredientCard from '../components/IngredientCard';

export default class CocktailScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cocktail: undefined
    }
  }

  componentDidMount() {
    fetch(`https://cocktailapi.herokuapp.com/api/cocktails/${this.props.cocktail.id}`).then(res => {
      return res.json()
    })
    .then(cocktail => {
      this.setState({ cocktail })
    })
    .catch(err => console.log(err));
  }

  render() {
    if (!this.state.cocktail) return <View/>; // FIX THIS
    return (
      <View>
        <View style={styles.nameCard}>
          <Text style={{fontWeight: '600'}}>{this.state.cocktail.name}</Text>
        </View>
        <View style={styles.glassCard}>
            <Image source={this._getGlassAsset()} style={styles.largeImage} />
        </View>
        <View style={{height: 300}}>
        <FlatList
          data={this.state.cocktail.ingredients.concat(this.state.cocktail.recipe)}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem} />
        </View>
      </View>
    )
  }

  _renderItem = ({item}) => {
    if (item.ingredient) {
      return (
        <IngredientCard ingredient={item.ingredient} amount={item.amount}/>
      );
    }

    return (
      <View style={styles.recipeCard}>
        <Text>{this.state.cocktail.recipe}</Text>
      </View>
    );
  }

  _keyExtractor = (item, index) => `CocktailScreen-${item.name + String(index)}`;

  _getGlassAsset() {
    switch(this.state.cocktail.glass.toLowerCase().replace(/[ ]/g,'_')) {
      case 'martini_glass': return assets.martini_glass;
      case 'hurricane_glass': return assets.hurricane_glass;
      case 'highball_glass': return assets.highball_glass;
      case 'collins_glass': return assets.highball_glass;
      case 'cocktail_glass': return assets.martini_glass;
      case 'shot_glass': return assets.shot_glass;
      case 'irish_coffee_cup': return assets.coffee_glass;
      case 'pitcher': return assets.pitcher_glass;
      case 'white_wine_glass': return assets.wine_glass;
      case 'champagne_flute': return assets.champagne_glass;
      case 'old-fashioned_glass': return assets.old_fashioned_glass;
      default : return assets.default_glass;
    }
  }
}

var styles = StyleSheet.create({
  largeImage:{
    height: 200,
    width: 200
  },
  glassCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'rgb(224, 224, 224)',
    borderBottomWidth: 1
    ,
    paddingVertical: 15
  },
  nameCard: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'rgb(224, 224, 224)',
    borderBottomWidth: 1,
    paddingHorizontal: 15
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgb(224, 224, 224)',
    borderBottomWidth: 1,
    paddingHorizontal: 15
  }
});
