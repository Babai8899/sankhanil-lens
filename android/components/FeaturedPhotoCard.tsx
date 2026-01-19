import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { imageApi } from '../services/imageApi';

interface Photo {
  _id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  location: string;
}

interface FeaturedPhotoCardProps {
  photo: Photo;
  isReversed: boolean;
  onImageClick: (photo: Photo) => void;
}

export function FeaturedPhotoCard({
  photo,
  isReversed,
  onImageClick,
}: FeaturedPhotoCardProps) {
  const isDark = useColorScheme() === 'dark';
  const imageUrl = imageApi.getImageUrl(photo._id, 'medium');

  const screenWidth = Dimensions.get('window').width;
  const contentWidth = screenWidth - 32; // Accounting for padding

  return (
    <ThemedView style={styles.container}>
      {/* Image Section */}
      <TouchableOpacity
        style={[styles.imageWrapper]}
        onPress={() => onImageClick(photo)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={(error) => {
            console.error('Image loading error:', error.nativeEvent);
          }}
        />
      </TouchableOpacity>

      {/* Details Section */}
      <View
        style={[
          styles.detailsContainer,
          {
            backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
          },
        ]}
      >
        {/* Category Badge */}
        <View style={styles.metadataRow}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: isDark ? '#1E40AF' : '#DBEAFE',
              },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color: isDark ? '#93C5FD' : '#1E40AF',
                },
              ]}
            >
              {photo.category}
            </Text>
          </View>
          <Text
            style={[
              styles.yearText,
              {
                color: isDark ? '#9CA3AF' : '#6B7280',
              },
            ]}
          >
            {photo.year}
          </Text>
        </View>

        {/* Title */}
        <Text
          style={[
            styles.title,
            {
              color: isDark ? '#FFFFFF' : '#000000',
            },
          ]}
        >
          {photo.title}
        </Text>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Text
            style={[
              styles.locationText,
              {
                color: isDark ? '#D1D5DB' : '#4B5563',
              },
            ]}
          >
            📍 {photo.location}
          </Text>
        </View>

        {/* Description */}
        <Text
          style={[
            styles.description,
            {
              color: isDark ? '#D1D5DB' : '#4B5563',
            },
          ]}
          numberOfLines={3}
        >
          {photo.description}
        </Text>

        {/* View Image Button */}
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => onImageClick(photo)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewButtonText}>View Image →</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageWrapper: {
    width: '100%',
    height: 300,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 20,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  categoryBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  yearText: {
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  viewButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  viewButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});
