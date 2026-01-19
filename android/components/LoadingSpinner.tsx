import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, useColorScheme } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={isDark ? '#3B82F6' : '#2563EB'}
      />
      {message && (
        <Text style={[styles.message, { color: isDark ? '#D1D5DB' : '#374151' }]}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
  },
});
