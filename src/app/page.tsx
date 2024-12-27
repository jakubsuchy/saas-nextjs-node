import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Your App
      </h1>
      
      <div className="mb-8 text-center">
        <p className="text-xl mb-4">
          Get started with Next.js and PocketBase
        </p>
        <p className="text-gray-600">
          A secure, fast, and developer-friendly stack
        </p>
      </div>

      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>
        <Link 
          href="/register" 
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Register
        </Link>
      </div>

      {/* Quick links for development */}
      <div className="mt-16 p-6 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Quick Development Links</h2>
        <ul className="space-y-2">
          <li>
            <Link 
              href="http://localhost:8090/_/" 
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              PocketBase Admin UI
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard" 
              className="text-blue-600 hover:underline"
            >
              Dashboard (Protected Route)
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
