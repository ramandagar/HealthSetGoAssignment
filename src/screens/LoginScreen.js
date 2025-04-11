import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    
    try {
      await dispatch(loginUser({ username, password })).unwrap();
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your credentials and try again');
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 25}
    >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../assets/store_placeholder.png')}
            />
            <Text style={styles.title}>FakeStore</Text>
            <Text style={styles.subtitle}>Your One-Stop Shop</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.loginText}>Log in to your account</Text>
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <Input
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              autoCapitalize="none"
            />
            
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
            
            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
            
            <Text style={styles.helpText}>
              For demo, use: username: 'johnd', password: 'm38rmF$'
            </Text>
          </View>
          
          <LoadingSpinner loading={loading} fullscreen />
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  loginText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 8,
    width: '100%',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  helpText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default LoginScreen; 