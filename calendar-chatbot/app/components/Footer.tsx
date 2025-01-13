import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900/50 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-400 mb-4 md:mb-0">
          © 2025 Calendario. All rights reserved.
        </div>
        <nav className="flex space-x-6">
          <Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link>
          <Link href="#" className="text-gray-400 hover:text-white">Terms of Service</Link>
          <Link href="#" className="text-gray-400 hover:text-white">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}

