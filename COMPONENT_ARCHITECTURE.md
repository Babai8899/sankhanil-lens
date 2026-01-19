# Component Architecture & Data Flow

## App Structure

```
HomeScreen (index.tsx)
    │
    ├─ STATE
    │   ├─ selectedImage: Photo | null
    │   ├─ featuredPhotos: Photo[]
    │   └─ loading: boolean
    │
    ├─ EFFECTS
    │   └─ useEffect → loadFeaturedPhotos()
    │
    └─ RENDER
        ├─ HeroSection
        │   ├─ Props: onExploreClick, onGalleryClick
        │   └─ Features: Animations, Buttons
        │
        ├─ Featured Photos Section (ScrollView)
        │   ├─ Section Title & Subtitle
        │   │
        │   ├─ IF loading
        │   │   └─ LoadingSpinner
        │   │
        │   ├─ ELSE IF photos exist
        │   │   └─ FlatMap: FeaturedPhotoCard[]
        │   │       ├─ Props: photo, isReversed, onImageClick
        │   │       └─ Features: Image, Metadata, Click Handler
        │   │
        │   └─ ELSE
        │       └─ Empty State Message
        │
        └─ ImageModal
            ├─ Props: photo, isVisible, onClose
            └─ Features: Full Image, Metadata, Close Button
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    HOME SCREEN                          │
│                   (index.tsx)                           │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ useEffect()
                   ▼
        ┌──────────────────────┐
        │ loadFeaturedPhotos() │
        └──────────┬───────────┘
                   │
                   │ calls
                   ▼
    ┌──────────────────────────────┐
    │  imageApi.getHomeImages()    │
    │   (services/imageApi.ts)     │
    └──────────┬───────────────────┘
               │
               │ fetch()
               ▼
    ┌──────────────────────────────┐
    │   Backend API                │
    │ /api/images/home             │
    │   (config/api.ts)            │
    └──────────┬───────────────────┘
               │
               │ JSON response
               ▼
        ┌──────────────────────┐
        │ setFeaturedPhotos()  │
        └──────────┬───────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │   Render FeaturedPhotoCard[]     │
    │  (components/FeaturedPhotoCard)  │
    └──────────┬───────────────────────┘
               │
               │ User taps photo
               ▼
        ┌──────────────────────┐
        │ setSelectedImage()   │
        └──────────┬───────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │     Show ImageModal              │
    │  (components/ImageModal.tsx)     │
    └─────────────────────────────────┘
```

---

## Component Hierarchy

### HeroSection
```tsx
HeroSection
├─ Animated.View (fade & slide)
├─ Text: Title "Sankhanil Lens"
├─ Text: Subtitle
├─ View: ButtonContainer
│   ├─ TouchableOpacity: "View Featured Works"
│   └─ TouchableOpacity: "Full Gallery"
└─ View: ScrollIndicator
```

### FeaturedPhotoCard
```tsx
FeaturedPhotoCard
├─ ThemedView: container
├─ TouchableOpacity: imageWrapper
│   └─ Image: photo thumbnail
└─ View: detailsContainer
    ├─ View: metadataRow
    │   ├─ View: categoryBadge
    │   └─ Text: yearText
    ├─ Text: title
    ├─ View: locationContainer
    │   └─ Text: locationText
    ├─ Text: description
    └─ TouchableOpacity: viewButton
```

### ImageModal
```tsx
ImageModal (Modal)
├─ TouchableOpacity: overlay (tap to close)
│   └─ ScrollView
│       └─ TouchableOpacity: modalContent
│           ├─ TouchableOpacity: closeButton
│           ├─ View: imageContainer
│           │   └─ Image: modalImage
│           └─ View: detailsSection
│               ├─ Text: modalTitle
│               ├─ View: metadataContainer
│               │   ├─ Text: location
│               │   └─ Text: year + category
│               └─ Text: description
```

### LoadingSpinner
```tsx
LoadingSpinner
├─ View: container
├─ ActivityIndicator
└─ Text: message
```

---

## File Dependencies

```
index.tsx (Home Page)
    │
    ├─ imports HeroSection
    │   └─ HeroSection.tsx
    │       └─ uses useColorScheme()
    │
    ├─ imports FeaturedPhotoCard
    │   └─ FeaturedPhotoCard.tsx
    │       ├─ uses useColorScheme()
    │       ├─ imports imageApi
    │       │   └─ imageApi.ts
    │       │       └─ imports API_CONFIG
    │       │           └─ api.ts
    │       └─ imports ThemedView
    │
    ├─ imports ImageModal
    │   └─ ImageModal.tsx
    │       ├─ uses useColorScheme()
    │       └─ imports imageApi
    │           └─ imageApi.ts
    │
    └─ imports LoadingSpinner
        └─ LoadingSpinner.tsx
            └─ uses useColorScheme()
```

---

## State & Props Flow

### HomeScreen State
```typescript
interface HomeScreenState {
  selectedImage: Photo | null              // For modal
  featuredPhotos: Photo[]                  // From API
  loading: boolean                         // API loading
}
```

### Photo Interface
```typescript
interface Photo {
  _id: string              // MongoDB ID
  title: string            // Photo title
  description: string      // Photo description
  category: string         // Category (e.g., "landscape")
  year: string             // Year taken
  location: string         // Location taken
}
```

### Props Passed Down
```
HeroSection
  ├─ onExploreClick: () => void
  └─ onGalleryClick: () => void

FeaturedPhotoCard
  ├─ photo: Photo
  ├─ isReversed: boolean
  └─ onImageClick: (photo: Photo) => void

ImageModal
  ├─ photo: Photo | null
  ├─ isVisible: boolean
  └─ onClose: () => void

LoadingSpinner
  └─ message?: string
```

---

## Event Handlers

```
User Interaction          → Handler              → Action
──────────────────────────────────────────────────────────
Page loads               → useEffect()           → Fetch photos
"View Featured Works"   → onExploreClick()      → Show first photo
"Full Gallery"          → onGalleryClick()      → Navigate to gallery
Tap on photo card       → onImageClick()        → Show modal
Tap X button            → onClose()             → Hide modal
Tap outside modal       → onClose()             → Hide modal
```

---

## Styling Strategy

### Theme Support
```typescript
const isDark = useColorScheme() === 'dark';

// Colors adapt based on isDark
backgroundColor: isDark ? '#111827' : '#FFFFFF'
color: isDark ? '#FFFFFF' : '#000000'
```

### Responsive Design
```typescript
const screenWidth = Dimensions.get('window').width;
const contentWidth = screenWidth - 32; // Accounting for padding
```

### Common Style Patterns
```typescript
// Light/Dark adaptive colors
backgroundColor: isDark ? dark : light

// Responsive sizing
width: '100%' or specific pixel values

// Flexbox layouts
flexDirection: 'column' | 'row'
justifyContent: 'center' | 'space-between'
alignItems: 'center'
```

---

## Data Loading Flow

```
1. Component Mount
   └─ useEffect runs

2. Load Featured Photos
   ├─ setLoading(true)
   ├─ Call imageApi.getHomeImages()
   │   ├─ fetch() from API_BASE_URL
   │   ├─ Convert to JSON
   │   └─ Return Photo[]
   ├─ setFeaturedPhotos(data)
   └─ setLoading(false)

3. Render
   ├─ IF loading: Show LoadingSpinner
   ├─ ELSE IF data: Show FeaturedPhotoCard[]
   ├─ ELSE: Show empty state

4. User Interaction
   ├─ Tap photo
   ├─ setSelectedImage(photo)
   └─ Show ImageModal
```

---

## Error Handling Flow

```
try {
  // Fetch photos
  const homeImages = await imageApi.getHomeImages();
  setFeaturedPhotos(homeImages);
} catch (error) {
  // Show alert
  Alert.alert('Error', 'Failed to load...');
  // Log for debugging
  console.error(error);
} finally {
  // Always set loading to false
  setLoading(false);
}
```

---

## Performance Optimizations

1. **Image Loading**
   - Uses `quality` parameter to load appropriate resolution
   - Lazy loading for off-screen images
   - Caching via timestamp parameter

2. **Re-renders**
   - useCallback for event handlers (if needed)
   - Proper dependency arrays in useEffect
   - Memoization where beneficial

3. **Memory**
   - Proper cleanup of modals
   - No memory leaks in listeners
   - Efficient state updates

---

This architecture ensures:
✅ Clean separation of concerns
✅ Reusable components
✅ Easy to maintain and extend
✅ Proper state management
✅ Good performance
✅ Type-safe with TypeScript
