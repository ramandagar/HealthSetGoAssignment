import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  type = 'primary', 
  style = {},
  textStyle = {},
}) => {
  const getButtonStyle = () => {
    if (type === 'secondary') {
      return styles.secondaryButton;
    } else if (type === 'outline') {
      return styles.outlineButton;
    }
    return styles.primaryButton;
  };

  const getTextStyle = () => {
    if (type === 'secondary') {
      return styles.secondaryText;
    } else if (type === 'outline') {
      return styles.outlineText;
    }
    return styles.primaryText;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={type === 'primary' ? 'white' : '#3498db'} 
          size="small" 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#f1f5f9',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 16,
  },
  outlineText: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Button; 