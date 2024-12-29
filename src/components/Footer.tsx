import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-20 px-4 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-white/70 hover:text-white">Features</Link></li>
              <li><Link href="/pricing" className="text-white/70 hover:text-white">Pricing</Link></li>
              <li><Link href="/docs" className="text-white/70 hover:text-white">Documentation</Link></li>
              <li><Link href="/changelog" className="text-white/70 hover:text-white">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white/70 hover:text-white">About</Link></li>
              <li><Link href="/blog" className="text-white/70 hover:text-white">Blog</Link></li>
              <li><Link href="/careers" className="text-white/70 hover:text-white">Careers</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/community" className="text-white/70 hover:text-white">Community</Link></li>
              <li><Link href="/help" className="text-white/70 hover:text-white">Help Center</Link></li>
              <li><Link href="/terms" className="text-white/70 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><Link href="https://twitter.com" className="text-white/70 hover:text-white">Twitter</Link></li>
              <li><Link href="https://github.com/zainulabedeen123/best-saas-kit" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">GitHub</Link></li>
              <li><Link href="https://discord.com" className="text-white/70 hover:text-white">Discord</Link></li>
              <li><Link href="/newsletter" className="text-white/70 hover:text-white">Newsletter</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
