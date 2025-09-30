<div align="center">

# AuthPlate - Next.js Authentication Starter Template

<img width="953" height="386" alt="Screenshot 2025-09-30 at 1 17 08 AM" src="https://github.com/user-attachments/assets/5954c119-35a9-4ba7-b0f5-48ac6769ebf7" />

</div>
</br>
A complete Next.js application with authentication using NextAuth.js, MongoDB, and JWT tokens. Features OAuth providers (Google, GitHub) and magic link authentication via Brevo email service.

**AuthPlate** is a production-ready starter template for building Next.js applications with authentication. Get started quickly with MongoDB integration, JWT tokens, and security features built-in.

## 🚀 Features

- **🎨 Beautiful Landing Page** - Modern, responsive homepage with AuthPlate branding
- **🔐 JWT-based Authentication** - Stateless authentication with JSON Web Tokens
- **🗄️ MongoDB Integration** - User data stored in MongoDB
- **🔗 OAuth Providers** - Google and GitHub authentication
- **📧 Magic Link Authentication** - Passwordless email authentication via Brevo
- **⚡ TypeScript Support** - Full TypeScript implementation
- **🎨 Tailwind CSS** - Modern, responsive UI with beautiful components
- **🛡️ Protected Routes** - Dashboard with authentication checks
- **🔒 Security Features** - Rate limiting, CSRF protection, secure cookies
- **📱 Mobile Responsive** - Works perfectly on all devices

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- Google OAuth credentials
- GitHub OAuth credentials
- Brevo account for email service

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd nextjs-betterauth-mongodb
npm install
```

### 2. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual values:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Brevo Email Configuration
EMAIL_SERVER_HOST=smtp-relay.brevo.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-brevo-username
EMAIL_SERVER_PASSWORD=your-brevo-smtp-key
EMAIL_FROM=noreply@yourdomain.com
```

### 3. OAuth Provider Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`

### 4. Brevo Email Setup

1. Create a [Brevo account](https://www.brevo.com/)
2. Go to SMTP & API settings
3. Create an SMTP key
4. Use the SMTP credentials in your environment variables

**Brevo Pricing:**
- **Free Plan**: 300 emails/day (≈9,000/month) - Perfect for development
- **Lite Plan**: $25/month for 20,000 emails
- **Cost per magic link**: ~$0.00125 (much cheaper than alternatives)

### 5. MongoDB Setup

#### Option A: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add your IP to whitelist

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/your-database`

### 6. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the beautiful AuthPlate landing page and start building your authenticated application.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth.js API route
│   ├── auth/
│   │   ├── signin/page.tsx              # Sign-in page
│   │   ├── verify-request/page.tsx      # Magic link verification
│   │   └── error/page.tsx               # Authentication errors
│   ├── dashboard/page.tsx               # Protected dashboard
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Beautiful landing page with AuthPlate branding
│   ├── providers.tsx                    # Session provider
│   ├── error.tsx                        # Global error page
│   └── not-found.tsx                    # 404 page
├── components/
│   ├── AuthButton.tsx                   # Authentication button component
│   ├── AuthWrapper.tsx                  # Authentication wrapper component
│   └── Spinner.tsx                      # Loading spinner component
├── lib/
│   ├── auth.ts                          # NextAuth.js configuration
│   ├── mongodb.ts                       # MongoDB connection
│   ├── env.ts                           # Environment validation
│   ├── logger.ts                        # Logging utilities
│   ├── security.ts                      # Security utilities
│   └── validation.ts                    # Input validation
├── middleware.ts                        # Rate limiting and security middleware
└── types/
    └── next-auth.d.ts                  # NextAuth type definitions
```

## 🔐 Authentication Flow

### OAuth Flow
1. User clicks "Sign in with Google/GitHub"
2. Redirected to provider's OAuth page
3. User authorizes the application
4. Provider redirects back with authorization code
5. NextAuth.js exchanges code for user info
6. User data stored in MongoDB
7. JWT token created and stored in cookie

### Magic Link Flow
1. User enters email address
2. NextAuth.js sends magic link via Brevo
3. User clicks link in email
4. Link contains verification token
5. Token verified and user authenticated
6. JWT token created and stored in cookie

## 🎯 Key Features Explained

### 🎨 Beautiful Landing Page
- **Modern Design**: Clean, professional homepage with AuthPlate branding
- **Feature Showcase**: Highlights all authentication capabilities
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Call-to-Action**: Clear sign-in buttons and navigation

### 🔐 JWT Configuration
- **Stateless**: No server-side sessions
- **Secure**: Tokens signed with secret key
- **Customizable**: User ID included in token
- **Expirable**: Tokens can have expiration

### 🗄️ MongoDB Integration
- **Automatic**: NextAuth.js handles user storage
- **Flexible**: Stores users, accounts, sessions
- **Scalable**: Works with MongoDB Atlas
- **Type-safe**: Full TypeScript support

### 📧 Email Authentication
- **Passwordless**: No password storage required
- **Secure**: Time-limited magic links
- **Cost-effective**: Brevo free tier for development
- **Reliable**: Professional email delivery

### 🛡️ Security Features
- **Rate Limiting**: Prevents abuse with configurable limits
- **CSRF Protection**: Built-in CSRF token validation
- **Secure Cookies**: HttpOnly, SameSite, and Secure flags
- **Input Validation**: Comprehensive validation for all inputs

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Update `NEXTAUTH_URL` for production
- Ensure MongoDB is accessible
- Configure OAuth redirect URIs for production domain

## 📊 Cost Analysis

### Development (Free)
- **MongoDB Atlas**: Free tier (512MB)
- **Brevo**: 300 emails/day free
- **OAuth**: Free for all providers
- **Total**: $0/month

### Production (Small Scale)
- **MongoDB Atlas**: $9/month (2GB)
- **Brevo**: $25/month (20,000 emails)
- **OAuth**: Free
- **Total**: ~$34/month

### Production (Large Scale)
- **MongoDB Atlas**: $25+/month
- **Brevo**: $65+/month
- **OAuth**: Free
- **Total**: $90+/month

## 🔧 Customization

### 🎨 Customizing the Landing Page
The landing page is located in `src/app/page.tsx` and features:
- **Hero Section**: Main headline and call-to-action
- **Features Grid**: Showcase of authentication capabilities
- **CTA Section**: Additional sign-up prompts
- **Footer**: Branding and links

### 🔗 Adding More OAuth Providers
```typescript
// In src/lib/auth.ts
import DiscordProvider from 'next-auth/providers/discord'

providers: [
  // ... existing providers
  DiscordProvider({
    clientId: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  }),
]
```

### 📧 Custom Email Templates
```typescript
// In src/lib/auth.ts
EmailProvider({
  // ... existing config
  sendVerificationRequest: async ({ identifier, url, provider }) => {
    // Custom email sending logic
  },
})
```

### 🗄️ Database Customization
```typescript
// In src/lib/auth.ts
callbacks: {
  async signIn({ user, account, profile }) {
    // Custom sign-in logic
    return true
  },
  async jwt({ token, user, account }) {
    // Custom JWT token logic
    return token
  },
}
```

### 🛡️ Security Customization
```typescript
// In src/middleware.ts
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // Adjust as needed
  authMaxRequests: 100, // Adjust as needed
}
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check connection string
   - Verify IP whitelist (Atlas)
   - Ensure database exists

2. **OAuth Provider Errors**
   - Verify client ID/secret
   - Check redirect URIs
   - Ensure APIs are enabled

3. **Email Not Sending**
   - Verify Brevo credentials
   - Check SMTP settings
   - Test with different email

4. **JWT Token Issues**
   - Ensure NEXTAUTH_SECRET is set
   - Check token expiration
   - Verify callback URLs

5. **Rate Limiting Issues**
   - Check middleware configuration
   - Verify rate limit settings
   - Clear browser cache if needed

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Brevo Documentation](https://developers.brevo.com/)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nextjs-betterauth-mongodb
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Visit the AuthPlate landing page**
   Open [http://localhost:3000](http://localhost:3000) to see your beautiful authentication starter!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**AuthPlate** - The complete Next.js authentication starter template. Built with ❤️ for developers who want to focus on building their application, not authentication.