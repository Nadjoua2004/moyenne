
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/SplashScreen';
import MainScreen from './screens/MainScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('APP_FIRST_LAUNCH');
      if (hasLaunched === 'true') {
        // Not first launch - show splash for shorter time
        setTimeout(() => setShowSplash(false), 2000);
      } else {
        // First launch - show full splash
        await AsyncStorage.setItem('APP_FIRST_LAUNCH', 'true');
        setTimeout(() => setShowSplash(false), 5000);
      }
    } catch (error) {
      // If error, default to 3 seconds
      setTimeout(() => setShowSplash(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (isLoading) {
    return null; // Or a small loading component
  }

  return (
    <View style={{ flex: 1 }}>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <MainScreen />
      )}
    </View>
  );
}

