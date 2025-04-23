import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Platform,
    TouchableOpacity,
    Alert,
    Animated,
    Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { loginUser } from '../redux/slices/authSlice';
import Input from '../components/Input';  
import Button from '../components/Button';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const passwordInputRef = useRef(null);
    const scrollViewRef = useRef(null);  
    const dispatch = useDispatch();
    const { loading, error: reduxError } = useSelector(state => state.auth);

    const validateInputs = () => {
        let isValid = true;
        setUsernameError('');
        setPasswordError('');

        if (!username.trim()) {
            setUsernameError('Username is required');
            isValid = false;
        }
        if (!password.trim()) {
            setPasswordError('Password is required');
            isValid = false;
        }
        return isValid;
    };

    const handleLogin = async () => {
        Keyboard.dismiss();
        if (!validateInputs()) {
            return;
        }

        try {
            await dispatch(loginUser({ username, password })).unwrap();
         } catch (err) {
           Alert.alert(
               'Login Failed',
               err?.message || 'Please check your credentials and try again.'
           );
           console.error("Login failed:", err);
        }
    };

 
    return (
        <KeyboardAwareScrollView
            ref={scrollViewRef}  
            style={styles.container}
            contentContainerStyle={styles.scrollContent} 
            extraScrollHeight={Platform.select({ios: 50, android: 35})}
            resetScrollToCoords={{ x: 0, y: 0 }}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
        >
          <View style={{height:100}}/>
            <Animated.View style={[styles.logoContainer]}>
                <Image
                    style={styles.logo}
                    source={require('../assets/store_placeholder.jpg')}
                    resizeMode="contain"
                />
                <Text style={styles.title}>FakeStore</Text>
                <Text style={styles.subtitle}>Your One-Stop Shop</Text>
            </Animated.View>

            <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>Welcome back!</Text>
                <Text style={styles.loginText}>Log in to continue</Text>

                {reduxError && <Text style={styles.reduxErrorText}>{reduxError}</Text>}

                <Input
                    label="Username"
                    value={username}
                    onChangeText={(text) => {
                        setUsername(text);
                        if (usernameError) setUsernameError('');
                    }}
                    placeholder="Enter your username"
                    autoCapitalize="none"
                    error={usernameError}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    blurOnSubmit={false}
                />

                <Input
                    ref={passwordInputRef}
                    label="Password"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        if (passwordError) setPasswordError('');
                    }}
                    placeholder="Enter your password"
                    secureTextEntry={!isPasswordVisible}
                    error={passwordError}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    rightIcon={
                        <TouchableOpacity
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={styles.eyeIconTouchable}
                        >
                            <Text style={{ color: '#6b7280', fontSize: 18 }}>
                                {isPasswordVisible ? '👁️' : '👁️‍🗨️'}  
                            </Text>
                        </TouchableOpacity>
                    }
                />

                <Button
                    title="Login"
                    onPress={handleLogin}
                    loading={loading}
                    style={styles.loginButton}
                    disabled={loading}
                />

                <Text style={styles.helpText}>
                    Demo: username: 'johnd', password: 'm38rmF$'
                </Text>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        flexGrow: 1,  
        paddingHorizontal: 20,
        paddingTop: 40,  
        paddingBottom: 60,  
     },
    logoContainer: {
        alignItems: 'center',
     },
    logo: {
        width: 40,
        height: 40,
        marginBottom: 12,  
    },
    title: {
        fontSize: 20,  
        fontWeight: 'bold',
        color: '#1e293b',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 4,
        textAlign: 'center',
        marginBottom: 20,  
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 5,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 8,
    },
    loginText: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 24,
    },
    loginButton: {
        marginTop: 16,
        width: '100%',
    },
    reduxErrorText: {
        color: '#dc2626',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '500',
    },
    helpText: {
        color: '#64748b',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 20,
    },
    eyeIconTouchable: {
        padding: 5,  
    },
});

export default LoginScreen;