# 🔐 Admin Access Guide - Director Value

This guide explains how to access the admin panel in production and manage admin users.

## 🎯 Current Status

- **Dev Login**: Disabled in production (security)
- **Email Auth**: Configured but requires email server setup
- **Admin Panel**: Available at `/admin` (requires ADMIN role)
- **Default Admin**: `admin@directorvalue.com` (if database was seeded)

## 🚀 Production Admin Access Methods

### Method 1: Set Up Email Authentication (Recommended)

#### Step 1: Configure Email Server
Add these environment variables to your Vercel project:

```bash
# Email Configuration (choose one)

# Option A: Using Resend (Recommended - already integrated)
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=your_resend_api_key
EMAIL_FROM=noreply@directorvalue.com

# Option B: Using Gmail
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# Option C: Using SendGrid
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=your_sendgrid_api_key
EMAIL_FROM=noreply@directorvalue.com
```

#### Step 2: Add Environment Variables in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `directorvalue.com` project
3. Go to **Settings** → **Environment Variables**
4. Add the email configuration variables above
5. **Deploy** to apply changes

#### Step 3: Access Admin Panel
1. Visit **https://directorvalue.com/auth/signin**
2. Enter your admin email (or create new admin - see below)
3. Check email for magic link
4. Click magic link to sign in
5. Visit **https://directorvalue.com/admin**

### Method 2: Direct Database Admin Management

#### Add New Admin Users
Use the built-in admin management script:

```bash
# List current admin users
npm run admin list

# Add a new admin user
npm run admin add your-email@company.com "Your Name"

# Example
npm run admin add john@directorvalue.com "John Smith"
```

#### Database Access via Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Storage** → **Postgres**
3. Use **Query** tab to run SQL:

```sql
-- List all admin users
SELECT id, email, name, role, "createdAt" FROM "User" WHERE role = 'ADMIN';

-- Make existing user an admin
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';

-- Create new admin user
INSERT INTO "User" (email, name, role) 
VALUES ('new-admin@company.com', 'Admin Name', 'ADMIN');
```

## 🛠️ Quick Setup for Production

### Option 1: Using Resend (Recommended - Already Configured!)

Since you already have Resend integrated:

1. **✅ Already configured** - Resend API key is set up
2. **Add to Vercel environment variables**:
   ```
   RESEND_API_KEY=your_resend_api_key_here
   EMAIL_FROM=noreply@directorvalue.com
   ```
3. **Deploy** the changes
4. **Sign in** at https://directorvalue.com/auth/signin

### Option 2: Alternative Email Providers (If Needed)

#### Gmail Setup
```bash
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

#### SendGrid Setup
```bash
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=your_sendgrid_api_key
EMAIL_FROM=noreply@directorvalue.com
```
1. **Connect to your production database**
2. **Run the admin script locally** (connected to production DB):
   ```bash
   npm run admin add your-email@company.com "Your Name"
   ```
3. **Set up email auth** (Method 1 above)
4. **Sign in** with magic link

## 🔒 Security Best Practices

### Admin User Management
- **Use company emails** for admin accounts
- **Regularly audit** admin users: `npm run admin list`
- **Remove unused** admin accounts
- **Use descriptive names** for admin users

### Email Security
- **Use app passwords** for Gmail (not regular password)
- **Rotate API keys** regularly
- **Use company domain** for FROM email address
- **Monitor email delivery** for failed login attempts

## 🎯 Access URLs

Once authentication is set up:

- **Sign In**: https://directorvalue.com/auth/signin
- **Admin Panel**: https://directorvalue.com/admin
- **User Dashboard**: https://directorvalue.com/dashboard

## 🛠️ Troubleshooting

### Can't Access Admin Panel
1. **Check user role**: `npm run admin list`
2. **Verify email auth** is working
3. **Check environment variables** in Vercel
4. **Clear browser cookies** and try again

### Email Not Working
1. **Verify environment variables** are set correctly
2. **Check spam folder** for magic link emails
3. **Test with different email provider**
4. **Check Vercel function logs** for errors

### Database Issues
1. **Use Vercel dashboard** to access database directly
2. **Check user exists**: `SELECT * FROM "User" WHERE email = 'your-email'`
3. **Verify admin role**: `SELECT role FROM "User" WHERE email = 'your-email'`

## 📞 Emergency Access

If you're completely locked out:

1. **Access Vercel database** directly via dashboard
2. **Create admin user** with SQL:
   ```sql
   INSERT INTO "User" (id, email, name, role) 
   VALUES (gen_random_uuid(), 'emergency@company.com', 'Emergency Admin', 'ADMIN');
   ```
3. **Set up email auth** and sign in with magic link

## 🎉 Success Checklist

- [ ] Email authentication configured in Vercel
- [ ] At least one admin user exists in database
- [ ] Can sign in at /auth/signin
- [ ] Can access admin panel at /admin
- [ ] Email magic links working
- [ ] Admin users documented and secure

---

**Need Help?** Check the Vercel dashboard function logs or database query tab for debugging information.
