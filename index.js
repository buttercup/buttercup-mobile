/**
 * @format
 */

import "./shim";

import { AppRegistry } from "react-native";
import { App } from "./source/App";
import "react-native-gesture-handler";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
