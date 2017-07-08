import React, { Component } from 'react';

import { Navigation } from 'react-native-navigation';

import { registerScreens } from './src/screens'

registerScreens();

Navigation.startTabBasedApp({
  tabs: [
    {
      label: 'Ingredients',
      screen: 'cocktailFinder.IngredientsScreen', // this is a registered name for a screen
      // icon: require('../img/one.png'),
      // selectedIcon: require('../img/one_selected.png'), // iOS only
      title: 'Ingredients'
    },
    {
      label: 'Cocktails',
      screen: 'cocktailFinder.CocktailsScreen',
      title: 'Cocktails'
    }
  ]
});

// export default class CocktailFinder extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit index.ios.js
//         </Text>
//         <Text style={styles.instructions}>
//           Press Cmd+R to reload,{'\n'}
//           Cmd+D or shake for dev menu
//         </Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

// AppRegistry.registerComponent('CocktailFinder', () => CocktailFinder);
