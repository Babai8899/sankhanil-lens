# Quick Start - Admin Dashboard

## Admin Credentials

Since an admin already exists in the database, use these test credentials:

```
Username: admin
Password: admin123
```

## Access Admin Dashboard

1. **Start Backend Server** (if not running):
   ```bash
   cd server
   npm run dev
   ```
   Server runs on: http://localhost:3000

2. **Start Frontend** (if not running):
   ```bash
   npm run dev
   ```
   Frontend runs on: http://localhost:5173

3. **Login to Admin Dashboard**:
   - Navigate to: http://localhost:5173/admin/login
   - Enter credentials above
   - You'll be redirected to the dashboard

## What You Can Do

### Statistics Tab (Default)
- View total images, views, messages
- See category breakdowns (Street vs Nature)
- Check top viewed images
- Monitor upload trends

### Images Tab
- **Upload**: Click "Upload Image" button
  - Select image file (max 10MB)
  - Fill title, category, display section, location, year
  - Optional description
- **Edit**: Click "Edit" on any image to modify metadata
- **Delete**: Click "Delete" to remove image
- **Filter**: Search by title/location, filter by category/section

### Messages Tab
- View all contact form submissions
- Click message to view details
- Mark as read/replied
- Reply via email
- Delete messages
- Filter unread messages

## Important Notes

⚠️ **Change Default Password**
After first login, change the default password using the API:
```bash
curl -X POST http://localhost:3000/api/admin/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"currentPassword": "admin123", "newPassword": "YourNewSecurePassword123!"}'
```

🔒 **Security**
- JWT tokens expire after 24 hours
- Admin routes not accessible to regular users
- All admin pages exclude navbar/footer
- Direct URL access protected by authentication

## Testing the System

1. **Test Login**: Use credentials above
2. **Test Statistics**: Should show existing data
3. **Test Image Upload**: Upload a test image
4. **Test Contact Form**: Submit a message from main site
5. **Test Message Management**: View message in admin dashboard

## Troubleshooting

**Cannot login:**
- Check if backend server is running on port 3000
- Verify JWT_SECRET is set in server/.env
- Check browser console for errors

**Images not showing:**
- Verify MongoDB connection
- Check if images exist in database
- View network tab for API errors

**Messages not appearing:**
- Contact form must be submitted first
- Check if ContactMessage model is working
- Verify backend logs

## Next Steps

For complete documentation, see:
- `ADMIN_GUIDE.md` - Full admin documentation
- `instructions.md` - Project overview
- `Readme.md` - Main project documentation

---
Admin Dashboard v1.0.0
