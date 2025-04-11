import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingSpinner = ({ 
  loading = true, 
  size = 'large', 
  color = '#3498db',
  text = '',
  fullscreen = false,
  style = {}
}) => {
  if (!loading) return null;
  
  return (
    <View style={[
      styles.container, 
      fullscreen && styles.fullscreen,
      style
    ]}>
      <ActivityIndicator size={size} color={color} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 999,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748b',
  },
});

export default LoadingSpinner; 