/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Charts from './component/Charts'
export default function App() {

  useEffect(() => {

  }, [])
  return (
    <View>
      <Charts />
    </View>
  )
}


