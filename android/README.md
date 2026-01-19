# Sankhanil Lens - Android Mobile App 📸

This is the React Native Expo implementation of the Sankhanil Lens photography portfolio app for Android.

## Features Implemented

- **Hero Section**: Beautiful welcome screen with title, subtitle, and call-to-action buttons
- **Featured Works**: Display of curated home page images from the backend
- **Image Modal**: Full-screen image viewer with detailed metadata (title, location, year, category, description)
- **Responsive Design**: Optimized for various Android screen sizes
- **Dark Mode Support**: Full support for light and dark themes
- **Error Handling**: Graceful error messages and loading states

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android device or emulator

### Installation

1. Navigate to the android directory:
   ```bash
   cd android
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Configure the API URL** (Important):
   - Open `android/app/config/api.ts`
   - Replace `http://your-backend-url:5000/api` with your actual backend server URL
   
   **URL Examples:**
   - **Android Emulator (local)**: `http://10.0.2.2:5000/api`
   - **Physical Device (local)**: `http://192.168.x.x:5000/api` (replace x.x with your computer's IP)
   - **Production**: `https://your-domain.com/api`

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on Android:
   - **Android Emulator**: Press `a` in the terminal
   - **Physical Device**: Scan the QR code with Expo Go app

## Directory Structure

```
android/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx                # Home page (main screen)
│   │   └── explore.tsx              # Gallery/Explore tab
│   ├── components/
│   │   ├── HeroSection.tsx          # Hero banner
│   │   ├── FeaturedPhotoCard.tsx    # Photo card component
│   │   ├── ImageModal.tsx           # Full-screen image viewer
│   │   └── LoadingSpinner.tsx       # Loading indicator
│   ├── services/
│   │   └── imageApi.ts              # API client
│   ├── config/
│   │   └── api.ts                   # API configuration
│   └── hooks/
│       └── use-color-scheme.ts      # Dark mode hook
├── components/                      # Shared components
├── constants/                       # App constants
└── package.json
```

## Key Components

### HeroSection
- Welcome message and call-to-action buttons
- Animated entrance with fade and slide effects
- "View Featured Works" and "Full Gallery" buttons

### FeaturedPhotoCard
- Featured photo display with image and metadata
- Category badge, title, location, and description
- Clickable for full-screen view

### ImageModal
- Full-screen image viewer
- Shows high-quality image with complete metadata
- Easy close functionality

### LoadingSpinner
- Loading indicator with message
- Theme-aware (dark/light mode)

## API Endpoints Used

- `GET /api/images/home` - Get home page images
- `GET /api/images/view/:id` - Get watermarked image
- `GET /api/images/token/:id` - Get secure access token

## Troubleshooting

### Images not loading?
1. Check that your backend server is running
2. Verify the `API_BASE_URL` in `app/config/api.ts` is correct
3. Check network connectivity

### Connection refused?
- **Android Emulator**: Use `10.0.2.2` instead of `localhost`
- **Physical Device**: Use your computer's local IP address
- Ensure backend server is accessible from the device

### Dark mode issues?
- Check that your device has dark mode enabled
- Restart the app after changing device theme
