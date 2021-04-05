/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {I18nManager} from 'react-native';
I18nManager.forceRTL(true);
I18nManager.isRTL = true;

import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
