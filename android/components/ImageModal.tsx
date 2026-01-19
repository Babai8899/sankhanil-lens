import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { imageApi } from '../services/imageApi';

interface Photo {
  _id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  location: string;
}

interface ImageModalProps {
  photo: Photo | null;
  isVisible: boolean;
  onClose: () => void;
}

export function ImageModal({ photo, isVisible, onClose }: ImageModalProps) {
  const isDark = useColorScheme() === 'dark';

  if (!photo) return null;

  const imageUrl = imageApi.getImageUrl(photo._id, 'high');
  const screenHeight = Dimensions.get('window').height;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Background overlay */}
      <TouchableOpacity
        style={[
          styles.overlay,
          {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.9)',
          },
        ]}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {/* Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>

            {/* Photo Details */}
            <View
              style={[
                styles.detailsSection,
                {
                  backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                },
              ]}
            >
              {/* Title */}
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color: isDark ? '#FFFFFF' : '#000000',
                  },
                ]}
              >
                {photo.title}
              </Text>

              {/* Metadata */}
              <View style={styles.metadataContainer}>
                {/* Location */}
                <View style={styles.metadataItem}>
                  <Text
                    style={[
                      styles.metadataLabel,
                      {
                        color: isDark ? '#D1D5DB' : '#6B7280',
                      },
                    ]}
                  >
                    📍 {photo.location}
                  </Text>
                </View>

                {/* Year and Category */}
                <View style={styles.metadataRow}>
                  <Text
                    style={[
                      styles.metadataLabel,
                      {
                        color: isDark ? '#D1D5DB' : '#6B7280',
                      },
                    ]}
                  >
                    {photo.year}
                  </Text>
                  <Text
                    style={[
                      styles.categoryBadge,
                      {
                        backgroundColor: isDark ? '#1E40AF' : '#DBEAFE',
                        color: isDark ? '#93C5FD' : '#1E40AF',
                      },
                    ]}
                  >
                    {photo.category}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text
                style={[
                  styles.description,
                  {
                    color: isDark ? '#D1D5DB' : '#4B5563',
                  },
                ]}
              >
                {photo.description}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '95%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  modalImage: {
    width: '100%',
    height: 400,
  },
  detailsSection: {
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metadataContainer: {
    marginBottom: 16,
  },
  metadataItem: {
    marginBottom: 8,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  metadataLabel: {
    fontSize: 14,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});
