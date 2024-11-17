/**
 * @format
 */
import { AppRegistry, Platform } from 'react-native';

import App from './App';
import { expo } from './app.json';

if (Platform.OS === 'web') {
    const expo = require('expo');
    expo.registerRootComponent(App);
} else {
    AppRegistry.registerComponent(expo.name, () => App);
}
