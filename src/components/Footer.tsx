"use client"

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 25 25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide text-primary"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
              <span className="ml-2 text-lg font-semibold">AuthPlate</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Next.js authentication starter with MongoDB, JWT, and security best practices out of the box.
            </p>
            <div className="mt-6 flex items-center gap-4 text-muted-foreground">
              <Link href="#" aria-label="GitHub" className="hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.48 0-.23-.01-.85-.01-1.66-2.78.62-3.37-1.36-3.37-1.36-.46-1.2-1.12-1.52-1.12-1.52-.92-.65.07-.64.07-.64 1.02.07 1.55 1.07 1.55 1.07.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .85-.28 2.8 1.05.81-.23 1.68-.35 2.55-.36.86 0 1.73.12 2.55.36 1.95-1.33 2.8-1.05 2.8-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.95-2.33 4.81-4.56 5.07.36.32.68.95.68 1.91 0 1.38-.01 2.49-.01 2.83 0 .26.18.58.69.48A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>
              </Link>
              <Link href="#" aria-label="Twitter" className="hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.945 7.52c.012.168.012.336.012.505 0 5.15-3.918 11.09-11.09 11.09-2.204 0-4.253-.64-5.974-1.748.308.036.604.048.924.048 1.82 0 3.493-.616 4.825-1.675a3.916 3.916 0 0 1-3.655-2.714c.24.036.48.06.732.06.348 0 .696-.048 1.02-.132a3.91 3.91 0 0 1-3.136-3.834v-.048c.516.288 1.116.468 1.752.492a3.904 3.904 0 0 1-1.744-3.252c0-.72.192-1.38.528-1.956a11.1 11.1 0 0 0 8.049 4.086 4.409 4.409 0 0 1-.096-.9 3.91 3.91 0 0 1 3.91-3.91c1.124 0 2.14.468 2.853 1.224a7.72 7.72 0 0 0 2.483-.948 3.93 3.93 0 0 1-1.716 2.16 7.802 7.802 0 0 0 2.25-.6 8.398 8.398 0 0 1-1.956 2.028Z"/></svg>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Changelog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Docs</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Guides</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Examples</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookies</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-1 sm:col-span-2">
            <h4 className="text-sm font-semibold mb-3">Stay up to date</h4>
            <p className="text-sm text-muted-foreground mb-3">Get tips and updates. No spam.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
              <button type="submit" className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AuthPlate. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-primary transition-colors">Status</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


