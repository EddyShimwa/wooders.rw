# Quick Reference - Next.js Commands

## Development
```bash
npm run dev
```
Server: http://localhost:3000

## Build
```bash
npm run build
```

## Production
```bash
npm start
```

## Lint
```bash
npm run lint
```

## Clear Cache (if issues)
```bash
Remove-Item -Path ".next" -Recurse -Force
npm run dev
```

## File Structure
- `app/` - All pages and routes
- `src/` - Components, services, types
- `public/` - Static assets
- `server/` - Backend API

## Key Pages
- Home: `app/page.tsx`
- About: `app/about/page.tsx`  
- Admin: `app/admin/orders/page.tsx`
- Layout: `app/layout.tsx`
- 404: `app/not-found.tsx`
