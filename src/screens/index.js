import { Navigation } from 'react-native-navigation';

import CocktailScreen from './CocktailScreen';
import CocktailsScreen from './CocktailsScreen';
import IngredientsScreen from './IngredientsScreen';

export function registerScreens() {
  Navigation.registerComponent('cocktailFinder.CocktailScreen', () => CocktailScreen);
  Navigation.registerComponent('cocktailFinder.CocktailsScreen', () => CocktailsScreen);
  Navigation.registerComponent('cocktailFinder.IngredientsScreen', () => IngredientsScreen);
}
