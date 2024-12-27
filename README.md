# Next.js + PocketBase Authentication Template

A full-featured authentication template using Next.js 14 and PocketBase, featuring email/password login, email link authentication, and protected routes.

## Features

- 🔐 Complete authentication system
- 📧 Email link authentication
- 🛡️ Protected routes with middleware
- 🏃 Quick setup with PocketBase
- 📱 Responsive dashboard layout
- 🔑 Password change functionality
- ✨ Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18+ 
- PocketBase server

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

4. Start PocketBase server:
```bash
./pocketbase serve
```

5. Run the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/                  # Next.js 14 app directory
├── components/           # Reusable React components
├── hooks/               # Custom React hooks
├── lib/                 # Shared libraries
└── utils/               # Utility functions
```
## Environment Variables

Create a `.env.local` file with these variables:

```env
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

## License

MIT License - feel free to use this template for your own projects!
