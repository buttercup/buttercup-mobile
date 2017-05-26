import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Provider } from "react-redux";
import { getRouter } from "./source/routing.js";
import { patchKeyDerivation } from "./source/library/buttercup.js";

import store from "./source/store.js";

export default class Buttercup extends Component {

    constructor(...args) {
        super(...args);
        // Setup native key derivation immediately
        patchKeyDerivation();
    }

    render() {
        return (
            <Provider store={store}>
                {getRouter()}
            </Provider>
        );
        // return (
        //     <View style={styles.container}>
        //         <Text style={styles.welcome}>
        //             Welcome to React Native!
        //         </Text>
        //         <Text style={styles.instructions}>
        //             To get started, edit index.ios.js
        //         </Text>
        //         <Text style={styles.instructions}>
        //             Press Cmd+R to reload,{'\n'}
        //             Cmd+D or shake for dev menu
        //         </Text>
        //     </View>
        // );
    }

}

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

AppRegistry.registerComponent('Buttercup', () => Buttercup);
