import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Zonely</h3>
            <p className="text-sm text-muted-foreground">
              Data-driven location analysis for business growth.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-sm text-muted-foreground hover:text-primary transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Zonely. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary transition">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 19c11 0 17-9 17-16.86a12.04 12.04 0 0 0-3.33-.91 5.39 5.39 0 0 0 2.37-3 10.72 10.72 0 0 1-3.07 1.18 5.37 5.37 0 0 0-9.14 4.9A15.23 15.23 0 0 1 2.3 3.5a5.37 5.37 0 0 0 1.66 7.16 5.35 5.35 0 0 1-2.43-.67v.07a5.37 5.37 0 0 0 4.31 5.26 5.36 5.36 0 0 1-2.42.09 5.38 5.38 0 0 0 5.02 3.73A10.76 10.76 0 0 1 2 18.27" />
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM8 12H6v6h2v-6zm-1-3c-.6 0-1.1-.5-1.1-1s.5-1 1.1-1 1 .5 1 1-.4 1-1 1zm12 9h-2v-3c0-.8-.3-1.3-1-1.3-.5 0-.9.4-1 .7 0 .1 0 .3 0 .5v3h-2v-6h2v.8c.3-.4.8-1 2-1 1.5 0 2.6 1 2.6 3.1V18z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
