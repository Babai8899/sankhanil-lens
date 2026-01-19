import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';

interface HeroSectionProps {
  onExploreClick: () => void;
  onGalleryClick: () => void;
}

export function HeroSection({ onExploreClick, onGalleryClick }: HeroSectionProps) {
  const isDark = useColorScheme() === 'dark';
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#111827' : '#F9FAFB',
        },
      ]}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Main Title */}
        <Text
          style={[
            styles.title,
            {
              color: isDark ? '#FFFFFF' : '#000000',
            },
          ]}
        >
          Sankhanil Lens
        </Text>

        {/* Subtitle */}
        <Text
          style={[
            styles.subtitle,
            {
              color: isDark ? '#D1D5DB' : '#4B5563',
            },
          ]}
        >
          Capturing moments in nature and street photography
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: '#2563EB',
              },
            ]}
            onPress={onExploreClick}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>View Featured Works</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                borderColor: '#2563EB',
              },
            ]}
            onPress={onGalleryClick}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Full Gallery</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Scroll Indicator */}
      <View style={styles.scrollIndicator}>
        <Text
          style={{
            color: isDark ? '#6B7280' : '#9CA3AF',
            fontSize: 12,
          }}
        >
          ↓ Scroll to see more
        </Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('window').height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 28,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    maxWidth: 400,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
