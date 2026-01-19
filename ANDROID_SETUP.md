# Android App Setup Guide

## Quick Start

### Step 1: Configure Backend URL

The most important step is setting up the correct API URL so the app can communicate with your backend server.

Open: `android/app/config/api.ts`

```typescript
export const API_CONFIG = {
  API_BASE_URL: 'http://10.0.2.2:5000/api', // ← Change this!
};
```

**Choose the correct URL for your setup:**

| Environment | Backend URL | Notes |
|---|---|---|
| Android Emulator (local) | `http://10.0.2.2:5000/api` | Special IP to access host machine |
| Physical Android Device | `http://192.168.1.X:5000/api` | Replace X with your computer's IP |
| Production/Cloud | `https://your-domain.com/api` | Your production domain |

### Step 2: Install Dependencies

```bash
cd android
npm install
```

### Step 3: Run the App

```bash
npm start
```

Then:
- Press `a` for Android Emulator
- Or scan QR code with Expo Go app on physical device

## Finding Your Computer's IP Address

**Windows:**
```powershell
ipconfig
```
Look for "IPv4 Address" under your network adapter (usually 192.168.x.x)

**Mac/Linux:**
```bash
ifconfig
```
Look for inet address

## Home Page Features

The implemented home page includes:

### 🎨 Hero Section
- Beautiful header with "Sankhanil Lens" title
- Subtitle: "Capturing moments in nature and street photography"
- Two action buttons: "View Featured Works" and "Full Gallery"
- Smooth animations on load

### 📸 Featured Photos Section
- Loads images from `/api/images/home` endpoint
- Displays featured photo cards with:
  - High-quality image
  - Title and category badge
  - Location (with 📍 icon)
  - Year
  - Description text
  - "View Image" button

### 🖼️ Image Modal
- Full-screen image viewer
- Tap to close or use X button
- Complete metadata display:
  - High-quality image
  - Title
  - Location
  - Category badge
  - Year
  - Full description

### 🌓 Dark Mode
- Automatically respects device theme
- All colors adapt to light/dark mode
- No manual theme switching needed

### ⚡ Loading & Error Handling
- Loading spinner while fetching images
- Error alerts for network issues
- Helpful error messages

## File Structure

```
android/app/
├── (tabs)/
│   └── index.tsx                      # Main home page
├── components/
│   ├── HeroSection.tsx                # Hero banner with animations
│   ├── FeaturedPhotoCard.tsx          # Photo card display
│   ├── ImageModal.tsx                 # Full-screen image viewer
│   └── LoadingSpinner.tsx             # Loading indicator
├── services/
│   └── imageApi.ts                    # Backend API calls
└── config/
    └── api.ts                         # API configuration
```

## Customization

### Change Hero Text

Edit `android/app/components/HeroSection.tsx`:

```typescript
<Text style={styles.title}>
  Your Custom Title Here  {/* ← Change this */}
</Text>
<Text style={styles.subtitle}>
  Your Custom Subtitle Here  {/* ← And this */}
</Text>
```

### Adjust Colors

Colors are theme-aware and located in components. To change:

Edit individual components (e.g., `HeroSection.tsx`):

```typescript
backgroundColor: '#2563EB'  // ← Blue button color
```

### Add More Features

The architecture supports easy additions:
- Add tabs to explore.tsx for Gallery
- Create detail screens for individual photos
- Add filtering/search functionality
- Add favorite images feature

## Common Issues & Solutions

### "Failed to fetch home images"
- Ensure backend server is running
- Check API_BASE_URL in api.ts is correct
- Test URL in browser: `http://your-url/api/images/home`

### Images show broken
- Verify image endpoint: `/api/images/view/:id`
- Check that images exist in backend
- Ensure watermarking is working (if enabled)

### Android Emulator connection issues
- Use `10.0.2.2` not `localhost`
- Ensure phone/emulator is on same network (physical device)
- Check firewall allows connections to port 5000

### App freezes when loading
- Check network connection
- Increase timeout values if backend is slow
- Check device logs: `expo logs`

## Next Steps

1. ✅ **Home Page** (Done)
   - Hero section
   - Featured photos
   - Image viewer

2. 📋 **Gallery Tab** (Next)
   - Implement explore.tsx
   - Add category filtering
   - Grid/list view

3. 🔐 **Admin Features** (Optional)
   - Admin login
   - Image upload
   - Content management

4. 🎯 **Additional Features**
   - Search functionality
   - Favorite/like feature
   - Share images
   - Image details/EXIF data

## Testing the App

1. Start backend: `npm start` (in server directory)
2. Start app: `npm start` (in android directory)
3. Open in emulator or physical device
4. Should see hero section immediately
5. Scroll down to see featured photos loading
6. Tap a photo to see full-screen view

## Environment Variables (Optional)

Create `android/.env`:
```
VITE_API_URL=http://10.0.2.2:5000/api
```

This is an alternative to editing `api.ts` directly.

---

**Need help?** Check the errors in:
- Terminal output from `npm start`
- Device console: `expo logs`
- Browser network tab when testing API directly
