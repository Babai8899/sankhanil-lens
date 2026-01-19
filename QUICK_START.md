# Quick Start Guide - Android App

## 🎯 TL;DR - Get Running in 3 Steps

### Step 1: Update API URL
Edit: `android/config/api.ts`

```typescript
API_BASE_URL: 'http://10.0.2.2:5000/api'  // For local emulator
```

**Other options:**
- Physical device: `http://192.168.1.YOUR_IP:5000/api`
- Production: `https://your-domain.com/api`

### Step 2: Install & Start
```bash
cd android
npm install
npm start
```

### Step 3: Run on Device
- Press `a` for Android Emulator
- OR Scan QR code with Expo Go app

---

## 📱 What You Get

A beautiful home page with:
- 🎨 Hero section with "Sankhanil Lens" title
- 📸 Featured photo cards from your backend
- 🖼️ Full-screen image viewer
- 🌓 Automatic dark mode
- ⚡ Loading states and error handling

---

## 📂 New Files Created

```
android/
├── components/
│   ├── HeroSection.tsx           ← Hero banner
│   ├── FeaturedPhotoCard.tsx     ← Photo display
│   ├── ImageModal.tsx            ← Full-screen viewer
│   └── LoadingSpinner.tsx        ← Loading indicator
├── services/
│   └── imageApi.ts               ← Backend API calls
└── config/
    └── api.ts                    ← Configuration
```

Also updated: `android/app/(tabs)/index.tsx` (Home page)

---

## ⚠️ Important!

**API URL Configuration is CRITICAL**
- Without correct URL, app won't load photos
- Use `10.0.2.2` for Android Emulator
- Use computer IP (192.168.x.x) for physical devices
- Make sure backend server is running

---

## 🔍 Check If It Works

1. Backend running? → Test: `http://your-url/api/images/home`
2. Device connected? → Check network in device settings
3. App started? → Look for "Sankhanil Lens" title

Still not working? → Check `ANDROID_SETUP.md` for troubleshooting

---

## 📞 File Locations

| What | Where |
|------|-------|
| API Configuration | `android/config/api.ts` |
| Home Page | `android/app/(tabs)/index.tsx` |
| Hero Section | `android/components/HeroSection.tsx` |
| Photo Cards | `android/components/FeaturedPhotoCard.tsx` |
| Image Viewer | `android/components/ImageModal.tsx` |
| API Client | `android/services/imageApi.ts` |

---

## ✨ Features

- ✅ Fetches photos from backend API
- ✅ Shows hero section with buttons
- ✅ Displays featured photos with details
- ✅ Full-screen image viewer
- ✅ Dark mode support
- ✅ Loading indicator
- ✅ Error handling
- ✅ Responsive design

---

## 🚀 Next: Gallery Tab

To add the gallery feature, implement: `android/app/(tabs)/explore.tsx`

Same components, just different query (uses `getGalleryImages()` instead of `getHomeImages()`)

---

**Need help?** See `ANDROID_SETUP.md` for detailed guide!
