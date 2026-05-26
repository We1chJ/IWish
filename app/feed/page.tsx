import Link from 'next/link'

export default function Feed() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-gray-200 bg-white sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            IWish
          </Link>
          <nav className="flex gap-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Log In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wishes Feed</h1>
          <p className="text-gray-600">
            Browse what people are sharing. Sign up to upvote and post your own wishes!
          </p>
        </div>

        {/* Sample Wishes */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">user{i}</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      i % 2 === 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {i % 2 === 0 ? 'Have' : 'Want'}
                    </span>
                  </div>
                  <p className="text-gray-700">
                    {i % 2 === 0
                      ? 'I have a vintage leather jacket that I no longer wear'
                      : 'I want to learn to play the guitar'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-500 hover:text-blue-600 font-medium cursor-pointer">
                  👍 {5 + i * 3} upvotes
                </button>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>Want to post your own wishes?</p>
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign up now
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; 2024 IWish. Share your wishes with the world.</p>
        </div>
      </footer>
    </div>
  )
}
