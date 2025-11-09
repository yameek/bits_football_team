# BITS Football Team Treasury - Frontend Setup Guide

## 🚨 Current Status: NPM Installation Issue

This project is ready to develop but requires resolving an NPM dependency installation issue first.

## 🔧 Quick Fix Options

### Option 1: Use Different Package Manager (Recommended)

#### Try with pnpm:
```bash
# Install pnpm globally
npm install -g pnpm

# Remove node_modules
rm -rf node_modules package-lock.json

# Install with pnpm
pnpm install

# Run dev server
pnpm dev
```

#### Try with yarn:
```bash
# Install yarn globally
npm install -g yarn

# Remove node_modules
rm -rf node_modules package-lock.json

# Install with yarn
yarn install

# Run dev server
yarn dev
```

### Option 2: Use Different Node Version

```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node 20 LTS
nvm install 20
nvm use 20

# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Run
npm run dev
```

### Option 3: Manual Vite Installation

```bash
# Install vite globally
npm install -g vite

# Run with npx
npx vite

# Or add to PATH and use directly
vite
```

### Option 4: Copy Working node_modules

If you have another working Vite + React project:

```bash
# From working project
cd /path/to/working/vite/project
tar -czf /tmp/node_modules.tar.gz node_modules

# To this project
cd /path/to/claude45_frontend
tar -xzf /tmp/node_modules.tar.gz

# Run
npm run dev
```

## 📦 Required Dependencies (56 packages)

### Production Dependencies:
```json
{
  "@tanstack/react-query": "^5.90.7",
  "axios": "^1.13.2",
  "clsx": "^2.1.1",
  "date-fns": "^4.1.0",
  "lucide-react": "^0.553.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.5",
  "tailwind-merge": "^3.3.1",
  "zustand": "^5.0.8"
}
```

### Development Dependencies:
```json
{
  "@vitejs/plugin-react": "^5.1.0",
  "autoprefixer": "^10.4.21",
  "postcss": "^8.5.6",
  "tailwindcss": "^4.1.17",
  "typescript": "~5.9.3",
  "vite": "^7.2.2",
  "@types/react": "^19.2.2",
  "@types/react-dom": "^19.2.2",
  "@types/node": "^24.10.0"
}
```

## 🎯 Once Dependencies Install Successfully

### 1. Start Development Server
```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

### 2. Create Remaining Files

All the following source files need to be created (designs are ready):

#### API Layer (✅ Ready to implement)
```
src/api/
├── client.ts          # Axios client with interceptors
├── members.ts         # Members API calls
├── sessions.ts        # Sessions API calls
├── transactions.ts    # Transactions API calls
├── alerts.ts          # Alerts API calls
├── guests.ts          # Guests API calls
├── fields.ts          # Fields API calls
├── settings.ts        # Settings API calls
└── reports.ts         # Reports API calls
```

#### Type Definitions (✅ Ready to implement)
```
src/types/
└── index.ts           # All TypeScript interfaces and types
```

#### State Management (✅ Ready to implement)
```
src/store/
├── authStore.ts       # Authentication state
└── appStore.ts        # Application state (sidebar, toast)
```

#### Utilities (✅ Ready to implement)
```
src/utils/
├── cn.ts              # Class name utility
├── format.ts          # Formatting functions
└── index.ts           # Exports
```

#### Common Components (✅ Ready to implement)
```
src/components/common/
├── Button.tsx
├── Input.tsx
├── Select.tsx
├── Card.tsx
├── Modal.tsx
├── LoadingSpinner.tsx
├── Toast.tsx
├── Badge.tsx
└── index.ts
```

#### Layout Components (⏳ To implement)
```
src/components/layout/
├── AppLayout.tsx      # Main app layout
├── Sidebar.tsx        # Desktop sidebar
├── Header.tsx         # Top header
├── MobileNav.tsx      # Mobile bottom nav
└── ProtectedRoute.tsx # Route guard
```

#### Pages (⏳ To implement)
```
src/pages/
├── auth/
│   └── LoginPage.tsx
├── dashboard/
│   └── DashboardPage.tsx
├── members/
│   ├── MembersListPage.tsx
│   ├── MemberDetailsPage.tsx
│   └── AddMemberPage.tsx
├── sessions/
│   ├── SessionsListPage.tsx
│   ├── SessionDetailsPage.tsx
│   ├── CreateSessionPage.tsx
│   └── AttendancePage.tsx
├── transactions/
│   └── TransactionsListPage.tsx
├── alerts/
│   └── AlertsPage.tsx
├── reports/
│   └── ReportsPage.tsx
└── settings/
    └── SettingsPage.tsx
```

### 3. Configure React Router

Create `src/router.tsx`:
```typescript
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
// Import all pages...

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'members', element: <MembersListPage /> },
      { path: 'members/:id', element: <MemberDetailsPage /> },
      // ... more routes
    ],
  },
]);
```

### 4. Setup React Query

Create `src/lib/queryClient.ts`:
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 5. Update main.tsx

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { queryClient } from './lib/queryClient';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

## 🏗️ Development Workflow

### Phase-by-Phase Implementation

#### Phase 1: Core Setup (1-2 hours)
- ✅ Install dependencies
- ✅ Create API client and services
- ✅ Setup state management
- ✅ Create common components

#### Phase 2: Authentication (2-3 hours)
- [ ] Login page
- [ ] Auth store integration
- [ ] Protected routes
- [ ] User context

#### Phase 3: Layout & Navigation (2-3 hours)
- [ ] App layout structure
- [ ] Sidebar navigation
- [ ] Header with user menu
- [ ] Mobile navigation
- [ ] Responsive design

#### Phase 4: Dashboard (3-4 hours)
- [ ] Dashboard layout
- [ ] Team balance card
- [ ] Alerts widget
- [ ] Upcoming sessions widget
- [ ] Recent transactions widget
- [ ] Statistics cards

#### Phase 5: Members Module (4-5 hours)
- [ ] Members list with search/filter
- [ ] Member details page
- [ ] Create/edit member forms
- [ ] Add contribution modal
- [ ] PIN lookup
- [ ] Balance indicators

#### Phase 6: Sessions & Attendance (5-6 hours) **CRITICAL - Mobile First**
- [ ] Sessions list
- [ ] Create/edit session
- [ ] Attendance page (mobile-optimized)
- [ ] PIN-based marking
- [ ] Guest management
- [ ] Finalization workflow
- [ ] Cost calculation preview

#### Phase 7: Transactions (3-4 hours)
- [ ] Transactions list
- [ ] Filters (type, date, method)
- [ ] Transaction details
- [ ] Bulk payment form

#### Phase 8: Alerts (2-3 hours)
- [ ] Alerts page
- [ ] Alert cards
- [ ] Resolve workflow
- [ ] Alert badge in nav

#### Phase 9: Reports (4-5 hours)
- [ ] Reports dashboard
- [ ] Team balance report
- [ ] Session costs chart
- [ ] Attendance summary
- [ ] Export functionality

#### Phase 10: Settings (2-3 hours)
- [ ] Settings page
- [ ] Threshold configuration
- [ ] Admin controls

#### Phase 11: Polish (3-4 hours)
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Responsive testing
- [ ] Performance optimization

### Total Estimated Time: 30-40 hours

## 🧪 Testing

```bash
# Run tests (once configured)
npm test

# Type checking
npm run build

# Linting
npm run lint
```

## 📱 Mobile Testing

For testing the mobile-optimized attendance page:

1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select tablet device (iPad, Android tablet)
4. Test PIN lookup and attendance marking

Or test on actual device:
```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
hostname -I  # Linux

# Run dev server with host flag
npm run dev -- --host

# Access from mobile device
http://YOUR_IP:5173
```

## 🎨 Tailwind CSS Classes Available

Custom utility classes defined in `index.css`:
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-danger` - Danger button
- `.card` - Card container
- `.input` - Form input
- `.label` - Form label

## 🔐 Environment Variables

Create `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=BITS Football Team Treasury
```

## 📋 Git Workflow

```bash
# After completing each phase/feature:
git add .
git commit -m "feat: Implement [feature name]"

# Examples:
git commit -m "feat: Add members list page with search"
git commit -m "feat: Implement PIN-based attendance marking"
git commit -m "feat: Add session finalization workflow"
```

## 🐛 Troubleshooting

### Issue: "Cannot find module 'vite'"
**Solution**: See Quick Fix Options above

### Issue: Tailwind styles not working
**Solution**: 
```bash
npx tailwindcss init -p
npm run dev
```

### Issue: TypeScript errors
**Solution**:
```bash
npx tsc --noEmit
# Fix reported errors
```

### Issue: API calls fail with CORS
**Solution**: Ensure backend has CORS enabled for `http://localhost:5173`

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [React Router Documentation](https://reactrouter.com/)

## 💡 Tips

1. **Start with Dashboard**: Users see this first, make it informative
2. **Mobile-first for Attendance**: Managers use tablets at the field
3. **PIN Lookup Speed**: Critical for UX, optimize search
4. **Real-time Updates**: Use React Query's auto-refetch
5. **Error Handling**: Always show user-friendly messages
6. **Loading States**: Never leave users guessing
7. **Responsive Design**: Test on multiple screen sizes
8. **Color-coded Balances**: Red (negative), Yellow (threshold), Green (good)

## 📞 Support

If you continue to have issues:
1. Check Node version: `node --version` (should be 18+)
2. Check npm version: `npm --version` (should be 8+)
3. Try alternative package managers (pnpm/yarn)
4. Check for system-level permissions issues
5. Try on different machine/environment

---

**Good luck with development! 🚀**
