# Sankhanil Lens - Photography Portfolio

## Project Overview

**Client:** Sankhanil  
**Profession:** Photographer specializing in nature and street photography  
**Objective:** Create a portfolio web application to showcase photographs

## Technical Stack

- ⚛️ **React** with Vite
- 🎨 **Tailwind CSS** for styling
- 🌼 **Daisy UI** component library
- 🎬 **Framer Motion** for animations
- 🖼️ **Logo:** `logo.png` available in public folder

## Design Requirements

### Theme
- **Dark mode** aesthetic
- Avoid bright colors
- Professional and elegant appearance

### Home Page Features

#### Layout & Navigation
- Scrollable home page
- Navigation menu with sections:
  - 🏠 Home
  - 👤 About
  - 📧 Contact
  - 🖼️ Gallery

#### Featured Photos Section
- **Animation Requirements:**
  - Images and details fade in when scrolled into view
  - Images and details fade out when scrolled out of view
  - Alternating layout pattern:
    - First image: Left side (image) + Right side (details)
    - Second image: Right side (image) + Left side (details)
    - Continue alternating pattern

#### Content Display
- Featured photographs with accompanying details
- Smooth scrolling experience
- Responsive design

## Development Phases

### Phase 1: Home Page ✅ Current Focus
- Implement scrollable home page
- Create featured photos section with alternating layout
- Add fade animations using Framer Motion
- Set up basic navigation structure

### Phase 2: Additional Pages 🔄 Future
- About page
- Contact page
- Gallery page
- *Additional instructions will be provided after home page completion*

## About Page Requirements

### Content Structure
- **Professional Introduction**: Brief introduction about Sankhanil as a photographer
- **Photography Journey**: Story of how he started and developed his passion for photography
- **Specialization**: Focus on nature and street photography
- **Philosophy**: His approach to capturing moments and subjects
- **Experience**: Years of experience and notable achievements
- **Equipment**: Brief mention of camera equipment used (if relevant)

### Design Requirements
- **Consistent Theme**: Maintain the dark mode aesthetic from the home page
- **Layout**: Clean, professional layout with good typography
- **Image Integration**: Include a professional profile photo
- **Animations**: Subtle fade-in animations for text sections
- **Responsive**: Ensure mobile-friendly design

### Content Tone
- **Professional yet Personal**: Balance between professional credibility and personal connection
- **Passionate**: Convey genuine love for photography
- **Accessible**: Easy to read and understand for all audiences
- **Inspiring**: Should inspire viewers to explore his gallery

### Navigation Integration
- Accessible via main navigation menu
- Smooth transitions between pages
- Consistent header/footer with other pages

## Content Protection Requirements

### Image Watermark Protection 🛡️
- **Normal Viewing**: Images display without any visible watermarks
- **Download Protection**: When users attempt to:
  - Right-click and "Save image as"
  - Copy image 
  - Drag image out of browser
- **Watermark Application**: 
  - "SANKHANIL" text should appear repeatedly across the entire image
  - Diagonal pattern covering the full image
  - Semi-transparent overlay that doesn't obscure but protects
- **Implementation**: Watermark only appears in the downloaded/copied version, not during normal viewing

### Screenshot Protection 🚫
- **Complete Screenshot Blocking**: Prevent any screenshot attempts
- **Black Screen Response**: If anyone tries to take a screenshot, the entire screen should turn black
- **Detection Methods**: Monitor for:
  - Screenshot keyboard shortcuts (PrtScn, Cmd+Shift+3/4/5, etc.)
  - Screenshot tools and applications
  - Browser developer tools access
  - Screen capture attempts
- **Duration**: Black screen should persist for 3 seconds then return to normal
- **Coverage**: Protection should work across the entire application

### Image Files
- Use dummy photos from `public/` folder:
  - `1000070291.jpg`
  - `1000070292.jpg` 
  - `1000070293.jpg`
- Apply protection to all displayed images

### Navigation Updates
- Remove icons from navigation menu
- Remove "Contact" from navigation
- Navigation items: Home, About, Gallery only
- Add contact details to footer instead

## Notes
- Focus on home page completion first
- Maintain consistent dark theme throughout
- Ensure smooth animations and user experience
- Responsive design for all devices

## Gallery Page Requirements 🖼️

### Overview
- Two separate carousels showcasing different photography categories
- Infinite sliding carousel with smooth animations
- Interactive navigation with hover effects

### Carousel Structure

#### Two Categories
1. **Street Photography Carousel**
   - Title: "Street Photography"
   - Displays urban and street photography images
   
2. **Nature Photography Carousel**
   - Title: "Nature Photography"
   - Displays landscape and nature photography images

#### Carousel Features
- **Infinite Loop**: Carousel slides infinitely in both directions
- **Sliding Effect**: Smooth spring-based animations using Framer Motion
- **Adjacent Images Visibility**: 
  - 15% of previous image visible on the left
  - 15% of next image visible on the right
  - Adjacent images are slightly smaller and have 50% opacity
- **Main Image**: 
  - Centered and larger scale
  - Full prominence with shadow effect
  - Higher z-index than adjacent images

### Image Data Structure
Each image should include:
- `id`: Unique identifier
- `src`: Image source path
- `title`: Descriptive name of the photograph
- `location`: Where the photo was taken
- `year`: Year the photo was captured

Example:
```javascript
{
  id: 1,
  src: '/1000070291.jpg',
  title: 'Urban Reflections',
  location: 'Downtown District',
  year: '2024'
}
```

### Hover Effects
Apply the same hover effects as Home page images:
1. **Image Scale**: Zoom to 110% on hover (700ms transition)
2. **Gradient Overlay**: Black to transparent gradient appears on hover
3. **Information Display**: 
   - Title appears at bottom
   - Location and year shown with separator
   - Smooth fade-in animation (500ms)

### Navigation Controls

#### Arrow Buttons
- Left and right chevron icons
- Positioned on left and right sides of carousel
- Circular buttons with semi-transparent background
- Using Heroicons for icons

#### Radio Buttons
- Located below the carousel
- DaisyUI styled radio buttons
- Primary color theme
- Shows number of images and current position
- Click to jump directly to any image

#### Drag/Swipe Support
- Users can drag images left or right to navigate
- Touch-friendly for mobile devices
- Cursor changes to grab/grabbing during interaction

### Information Display

#### Hover Overlay (on main image)
- Title: Large, bold text
- Location and year: Smaller text with separator

#### Permanent Display (below carousel)
- **Title**: Large heading (2xl, bold)
- **Location**: With map pin icon
- **Year**: With calendar icon
- Icons from Heroicons library
- Centered alignment

### Dimensions
- Container: `max-w-5xl` (maximum width)
- Carousel height: `400px`
- Adjacent images height: 75% of container height
- Main image: Full height of container

### Animations
- **Slide transition**: Spring physics (stiffness: 300, damping: 30)
- **Opacity transition**: 200ms duration
- **Scale transition**: 200ms duration
- **Hover effects**: 
  - Transform: 700ms
  - Opacity: 500ms

### Spacing
- Section padding: `py-16 px-4`
- Carousel spacing: `mb-24` between carousels
- Radio buttons gap: `gap-3`
- Details margin: `mt-6`

### Responsive Design
- Maintains aspect ratio on all screen sizes
- Touch-optimized for mobile devices
- Proper spacing on smaller screens

---

*Good Morning! Let's create an amazing portfolio for Sankhanil! 📸✨*

## Recent Updates - Light Mode Removal ❌

### Theme System Removal (Latest)
- **REQUIREMENT**: Remove all light mode implementation and theme switching functionality
- **OBJECTIVE**: Return to dark mode only design

#### Files Deleted ✅
- `src/contexts/ThemeContext.jsx` - Complete theme context removal
- `tailwind.config.js` - Tailwind configuration removed
- `src/contexts/` directory - Entire contexts folder deleted

#### Components Reverted ✅
1. **App.jsx**
   - Removed ThemeProvider wrapper
   - Fixed background to `bg-gray-900 text-white`
   - Removed theme-related imports

2. **Navbar.jsx**
   - Removed theme toggle buttons (desktop and mobile)
   - Removed theme-related imports (SunIcon, MoonIcon, useTheme)
   - Fixed styles to dark mode only
   - Updated navigation styling: `bg-gray-900/95`, `text-white`

3. **CSS Files**
   - `index.css`: Reverted to simple `@import "tailwindcss"`
   - Restored dark theme scrollbar styles only
   - Removed theme root variables and transitions

#### Bulk Theme Class Replacements ✅
Applied across all components (About.jsx, AllImages.jsx, Events.jsx, Home.jsx, Gallery.jsx, Footer.jsx):

- ❌ `text-gray-900 dark:text-white` → ✅ `text-white`
- ❌ `text-gray-700 dark:text-gray-300` → ✅ `text-gray-300`
- ❌ `text-gray-600 dark:text-gray-400` → ✅ `text-gray-400`
- ❌ `bg-gray-100 dark:bg-base-200` → ✅ `bg-base-200`
- ❌ `bg-gray-100 dark:bg-gray-900` → ✅ `bg-gray-900`
- ❌ All `transition-colors duration-300` removed
- ❌ All conditional theme classes removed

#### Specific Component Fixes ✅

**About.jsx**:
- Background: `bg-gray-100 dark:bg-gray-900` → `bg-gray-900`
- All text content updated to dark mode classes

**Footer.jsx**:
- Main container: `bg-gray-100 dark:bg-gray-900` → `bg-gray-900`
- Social media icons: `bg-gray-200 dark:bg-gray-800` → `bg-gray-800`
- Contact form modal: `bg-white dark:bg-gray-900` → `bg-gray-900`
- All form inputs: `bg-white dark:bg-gray-800` → `bg-gray-800`
- LinkedIn icon fix: Removed light background styling

**AllImages.jsx**:
- Filter buttons: All light mode classes removed
- Active state: `text-blue-600 dark:text-primary` → `text-primary`
- Inactive state: `text-gray-700 dark:text-base-content/70` → `text-base-content/70`

**Home.jsx**:
- Hero section: Updated gradient to support only dark mode
- Featured works: All text content converted to dark mode classes
- Photo cards: Consistent dark theme styling

**Gallery.jsx**:
- Headers and sections: All theme-aware classes converted to dark mode only

#### EmailJS Integration Maintained ✅
- Contact form functionality preserved
- All EmailJS configuration intact
- Form styling updated to dark mode only

#### Final State ✅
- **Theme System**: Completely removed
- **Design**: Consistent dark mode throughout
- **Performance**: No theme context overhead
- **Code Quality**: Clean, simplified styling
- **User Experience**: Professional dark photography portfolio aesthetic

### Current Status
✅ **Dark Mode Only**: Portfolio now uses fixed dark theme  
✅ **No Theme Toggle**: All theme switching removed  
✅ **Clean Codebase**: No theme-related conditional logic  
✅ **Consistent Styling**: All components use unified dark theme classes  
✅ **EmailJS Ready**: Contact form functional with dark styling  
✅ **Performance Optimized**: No theme context processing overhead
