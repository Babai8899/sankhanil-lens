import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from 'react-native';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedPhotoCard } from '@/components/FeaturedPhotoCard';
import { ImageModal } from '@/components/ImageModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { imageApi } from '@/services/imageApi';

interface Photo {
  _id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  location: string;
}

export default function HomeScreen() {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedPhotos();
  }, []);

  const loadFeaturedPhotos = async () => {
    try {
      setLoading(true);
      const homeImages = await imageApi.getHomeImages();
      setFeaturedPhotos(homeImages);
    } catch (error) {
      console.error('Error loading featured photos:', error);
      Alert.alert(
        'Unable to Load Photos',
        'Failed to connect to backend. Make sure the API URL is correct in android/config/api.ts',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExploreClick = () => {
    if (featuredPhotos.length > 0) {
      setSelectedImage(featuredPhotos[0]);
    }
  };

  const handleGalleryClick = () => {
    router.push('/(tabs)/explore');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Section */}
        <HeroSection
          onExploreClick={handleExploreClick}
          onGalleryClick={handleGalleryClick}
        />

        {/* Featured Photos Section */}
        <View
          style={[
            styles.featuredSection,
            {
              backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
            },
          ]}
        >
          {/* Section Header */}
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="title" style={styles.sectionTitle}>
              Featured Works
            </ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              A curated selection of photographs capturing moments in nature and urban life
            </ThemedText>
          </ThemedView>

          {/* Photo Grid */}
          {loading ? (
            <LoadingSpinner message="Loading featured photos..." />
          ) : featuredPhotos.length > 0 ? (
            <View style={styles.photosContainer}>
              {featuredPhotos.map((photo, index) => (
                <FeaturedPhotoCard
                  key={photo._id}
                  photo={photo}
                  isReversed={index % 2 === 1}
                  onImageClick={setSelectedImage}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                No photos available at the moment
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Image Modal */}
      <ImageModal
        photo={selectedImage}
        isVisible={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  featuredSection: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  sectionHeader: {
    marginBottom: 32,
    alignItems: 'center',
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    textAlign: 'center',
    maxWidth: '90%',
  },
  photosContainer: {
    gap: 24,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
  },
});
