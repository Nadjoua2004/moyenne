import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start from 1 (fully visible)

  useEffect(() => {
    // Start fading out after a short delay
    const timer = setTimeout(() => {
      // Gradually change opacity from 1 to 0 over 2 seconds
      Animated.timing(fadeAnim, {
        toValue: 0, // End at 0 (completely transparent)
        duration: 2000, // Take 2 seconds to fade out
        useNativeDriver: true,
      }).start(() => {
        // When animation is complete, call onFinish
        onFinish();
      });
    }, 2000); // Wait 2 seconds before starting fade out

    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      {/* Text */}
      <Text style={styles.subtitle}>AVG Calculator</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#ecf0f1',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});