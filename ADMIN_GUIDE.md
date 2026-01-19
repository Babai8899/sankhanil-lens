# Admin Dashboard Guide

## Overview
Complete admin dashboard for managing Sankhanil Lens photography portfolio with authentication, image management, contact messages, and statistics.

## Features

### 🔐 Authentication
- Secure JWT-based authentication (24-hour token expiry)
- Password hashing with bcryptjs (10 rounds)
- Protected admin routes (not accessible to regular users)
- Automatic token verification and refresh

### 🖼️ Image Management
- **Upload Images**: Upload new photos with title, category, location, year, description
- **Edit Images**: Update image metadata and display sections
- **Delete Images**: Remove images from GridFS and database
- **Filters**: Search by title/location, filter by category/section
- **Pagination**: Browse images with 12 per page

### ✉️ Message Management
- **View Messages**: See all contact form submissions
- **Mark as Read**: Track which messages have been reviewed
- **Mark as Replied**: Track response status
- **Reply via Email**: Direct mailto link for responses
- **Delete Messages**: Remove spam or processed messages
- **Unread Filter**: Show only new messages

### 📊 Statistics & Analytics
- **Overview Cards**: Total images, views, messages, uploads
- **Category Breakdown**: Views and counts by category (street/nature)
- **Top Images**: Most viewed photos
- **Upload Trends**: Monthly upload graph (last 6 months)
- **Real-time Stats**: Automatically updated data

## Setup Instructions

### 1. Create First Admin Account

**Option A: Using the script (Recommended)**
```bash
cd server
npm run create-admin
```

This creates default admin:
- Username: `admin`
- Email: `admin@sankhanil.com`
- Password: `admin123`

**Option B: Custom credentials**
```bash
cd server
npm run create-admin <username> <email> <password>
```

Example:
```bash
npm run create-admin sankhanil sankhanil@example.com SecurePass123!
```

**Option C: Using the API directly**
```bash
curl -X POST http://localhost:5000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "your-secure-password"
  }'
```

⚠️ **IMPORTANT**: The registration endpoint is automatically disabled after the first admin is created for security.

### 2. Start the Servers

**Backend (Port 5000):**
```bash
cd server
npm run dev
```

**Frontend (Port 5173):**
```bash
npm run dev
```

### 3. Access Admin Dashboard

1. Navigate to: `http://localhost:5173/admin/login`
2. Enter your credentials
3. You'll be redirected to the dashboard

## Usage Guide

### Logging In
1. Go to `/admin/login`
2. Enter username and password
3. System validates and issues JWT token
4. Token stored in localStorage for persistence
5. Redirects to dashboard on success

### Dashboard Navigation
- **Statistics Tab**: Overview of all metrics and graphs
- **Images Tab**: Manage all photos
- **Messages Tab**: Handle contact form submissions

### Uploading Images
1. Click "Upload Image" button
2. Fill required fields:
   - **Image File**: Select image (max 10MB)
   - **Title**: Photo title
   - **Category**: Street or Nature
   - **Display Section**:
     - Home (01-02): Shows on homepage carousel
     - Gallery (03-07): Shows in gallery page
     - All: Only in all-images page
   - **Location**: Where photo was taken
   - **Year**: Year photo was taken
   - **Description**: Optional details
3. Click "Upload"
4. Image automatically optimized (max 2000px, 85% quality)

### Editing Images
1. Click "Edit" on any image card
2. Modify fields (cannot change image file)
3. Click "Save Changes"
4. Changes reflected immediately

### Deleting Images
1. Click "Delete" on image card
2. Confirm deletion (cannot be undone)
3. Image removed from GridFS and database

### Managing Messages
1. View all messages in table format
2. Click row to view full message
3. Actions available:
   - **Reply via Email**: Opens default mail client
   - **Mark as Replied**: Track response status
   - **Delete**: Remove message
4. Use "Unread Only" filter for new messages

### Changing Password
Use the API endpoint:
```bash
curl -X POST http://localhost:5000/api/admin/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "old-password",
    "newPassword": "new-secure-password"
  }'
```

### Logging Out
Click "Logout" button in header. This clears the JWT token from localStorage.

## API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Login
- `GET /api/admin/auth/verify` - Verify token
- `POST /api/admin/auth/register` - Register first admin (auto-disabled after)
- `POST /api/admin/auth/change-password` - Change password

### Statistics
- `GET /api/admin/stats` - Get dashboard statistics

### Images
- `GET /api/admin/images` - Get images (with pagination/filters)
- `POST /api/admin/images` - Upload image
- `PUT /api/admin/images/:id` - Update image
- `DELETE /api/admin/images/:id` - Delete image

### Messages
- `GET /api/admin/messages` - Get messages (with pagination/filters)
- `PUT /api/admin/messages/:id/read` - Mark as read
- `PUT /api/admin/messages/:id/replied` - Mark as replied
- `DELETE /api/admin/messages/:id` - Delete message

## Security Features

### Backend Security
- JWT tokens with 24-hour expiry
- Password hashing with bcrypt (10 rounds)
- Protected routes with authMiddleware
- File type validation for uploads
- File size limits (10MB)
- CORS restrictions
- Rate limiting (inherited from main server)

### Frontend Security
- Token verification on page load
- Automatic redirect if not authenticated
- Protected routes with ProtectedRoute component
- Token stored in httpOnly localStorage
- Admin routes hidden from regular users
- No admin navigation in public navbar

### Best Practices
1. **Change default password immediately** after first login
2. **Use strong passwords**: Minimum 12 characters, mix of uppercase, lowercase, numbers, symbols
3. **Keep JWT_SECRET secure**: Use long random string in production
4. **Regular backups**: Backup MongoDB database regularly
5. **Monitor activity**: Check statistics for unusual patterns
6. **HTTPS in production**: Always use HTTPS for admin access

## Environment Variables

Required in `server/.env`:
```env
JWT_SECRET=your-very-long-and-secure-secret-key-change-in-production
MONGODB_URI=your-mongodb-connection-string
PORT=5000
CLIENT_URL=http://localhost:5173
```

⚠️ **IMPORTANT**: Change `JWT_SECRET` to a long, random, secure string in production!

## Troubleshooting

### Cannot login
- Check if admin account exists in database
- Verify JWT_SECRET is set in .env
- Check browser console for errors
- Ensure backend server is running

### Images not uploading
- Check file size (max 10MB)
- Verify file type is image
- Check MongoDB connection
- Ensure GridFS bucket exists

### Token expired errors
- Token expires after 24 hours
- Simply login again to get new token
- Token automatically cleared on logout

### Messages not showing
- Ensure contact form is working
- Check if ContactMessage model is imported in server
- Verify MongoDB connection

## Production Deployment Checklist

- [ ] Change JWT_SECRET to secure random string
- [ ] Change default admin password
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Enable rate limiting
- [ ] Set up MongoDB backups
- [ ] Configure environment variables
- [ ] Test all functionality
- [ ] Set up monitoring/logging
- [ ] Document custom procedures

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in browser console
3. Check server logs for backend errors
4. Verify environment variables are set correctly

## Version
Admin Dashboard v1.0.0 - January 2025
