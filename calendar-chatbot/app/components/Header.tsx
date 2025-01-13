import Link from 'next/link'

export default function Header() {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-800/50 backdrop-blur-md fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Calendario
        </Link>
        <nav className="flex space-x-10">
          <Link href="#features" className="text-gray-300 hover:text-white">Features</Link>
          <Link href="#" className="text-gray-300 hover:text-white">About</Link>
        </nav>
      </div>
    </header>
  )
}

