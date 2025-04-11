import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoadingSpinner from './src/components/LoadingSpinner';

function App() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={<LoadingSpinner loading={true} fullscreen text="Loading..." />} 
        persistor={persistor}
      >
        <GestureHandlerRootView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <AppNavigator />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App; 