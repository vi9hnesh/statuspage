# Status Page - Production Setup

This Next.js status page is now configured to connect to your Django backend API.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file:

```bash
# Required: Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_STATUS_PAGE_SLUG=api-9

# Optional: Override in production
# NEXT_PUBLIC_API_BASE_URL=https://api.warrn.io
# NEXT_PUBLIC_STATUS_PAGE_SLUG=your-status-page-slug
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Test Backend Connection

```bash
npm run test:integration
```

This will verify your backend is accessible and return status page data.

### 4. Start Development Server

```bash
npm run dev
# or with environment variables
npm run dev:with-backend
```

Open [http://localhost:3000](http://localhost:3000) to see your status page.

## 📡 Server-Side Architecture

### Server Components Benefits

- ✅ **No loading states**: Fully rendered content on first load
- ✅ **Better SEO**: Server-rendered HTML with real data
- ✅ **Faster perceived performance**: No client-side data fetching delays
- ✅ **Better UX**: Users see complete page immediately

### Data Flow

1. **User requests**: `/{slug}` (e.g., `/api-9`)
2. **Server fetches**: `{BACKEND}/api/status-pages/public/{slug}` 
3. **Server renders**: Complete HTML with all data
4. **Client receives**: Fully rendered page

### Caching & Performance

- **Revalidation**: 60 seconds (configurable)
- **Build-time**: Static generation where possible
- **Runtime**: Server-side rendering for dynamic content

### Fallback Behavior

If the backend is unavailable:
- ✅ Returns 404 Not Found page
- ✅ Graceful error handling
- ✅ Clear messaging to users

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_STATUS_PAGE_SLUG` | Status page slug | `api-9` |

### Backend Requirements

Your Django backend should provide:

```json
{
  "name": "Your Service Status",
  "description": "Status page description", 
  "overall_status": "operational",
  "logo_url": "https://...",
  "primary_color": "#3B82F6",
  "support_email": "support@company.com",
  "support_url": "https://...",
  "components": [
    {
      "id": "component-id",
      "name": "Component Name", 
      "description": "Component description",
      "status": "operational",
      "uptime_percentage_90d": "99.95"
    }
  ],
  "active_incidents": [...],
  "recent_incidents": [...],
  "last_updated": "2025-09-19T13:28:10.217Z"
}
```

## 🎨 Customization

### Branding

The status page automatically uses data from your backend:
- **Logo**: `logo_url` field
- **Name**: `name` field → "Name Status" 
- **Colors**: `primary_color` field (future enhancement)
- **Support Link**: `support_url` field

### Components

- ✅ **Service-backed components**: Automatically synced from backend
- ✅ **Custom components**: Supported (components without service)
- ✅ **Real-time status**: Auto-refreshes every 60 seconds
- ✅ **Uptime display**: Shows 90-day uptime percentage

### Incidents

- ✅ **Active incidents**: Prominently displayed
- ✅ **Recent incidents**: Last 30 days shown
- ✅ **Incident details**: Title, status, affected components

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_BASE_URL=https://api.warrn.io
# NEXT_PUBLIC_STATUS_PAGE_SLUG=your-slug
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.warrn.io
NEXT_PUBLIC_STATUS_PAGE_SLUG=production-slug
```

## 🔍 Troubleshooting

### Backend Connection Issues

1. **Check backend is running**: `curl http://localhost:8000/api/status-pages/public/api-9`
2. **Verify CORS settings**: Ensure Django allows requests from Next.js domain
3. **Check slug exists**: Verify status page exists in your database
4. **Test integration**: `npm run test:integration`

### Common Issues

- **Empty components**: Check if status page has components added
- **CORS errors**: Configure Django CORS_ALLOWED_ORIGINS
- **404 errors**: Verify status page slug is correct

## 📈 Next Steps

### Additional Backend Endpoints (Optional)

You can enhance the integration by adding:

1. **Component Uptime History**: `GET /api/status-pages/public/{slug}/components/{id}/uptime/`
2. **Incident Updates**: `GET /api/status-pages/public/{slug}/incidents/{id}/updates/`
3. **Metrics Dashboard**: `GET /api/status-pages/public/{slug}/analytics/`

### Frontend Enhancements

- [ ] Add uptime history charts (using backend uptime endpoint)
- [ ] Implement incident updates timeline
- [ ] Add subscription notifications
- [ ] Custom domain support
- [ ] Theme customization based on primary_color

## ✅ Production Checklist

- [ ] Environment variables configured
- [ ] Backend endpoints accessible
- [ ] CORS configured properly
- [ ] Status page slug exists
- [ ] Components and incidents data available
- [ ] Fallback behavior tested
- [ ] Performance optimized (caching, CDN)
- [ ] Error monitoring setup
- [ ] Auto-refresh working correctly

Your status page is now production-ready! 🎉
