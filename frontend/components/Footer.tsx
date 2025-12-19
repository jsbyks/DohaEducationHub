import Link from 'next/link';
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-gray-200 mt-20 border-t-4 border-cyan-500">
      {/* Trust Stats Bar */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-cyan-400 mb-1">433</div>
              <div className="text-xs text-gray-300 font-medium">Schools Listed</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-green-400 mb-1">367</div>
              <div className="text-xs text-gray-300 font-medium">Verified Phones</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-purple-400 mb-1">8,500+</div>
              <div className="text-xs text-gray-300 font-medium">Families Helped</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold text-yellow-400 mb-1">100%</div>
              <div className="text-xs text-gray-300 font-medium">Free to Use</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                  <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4.5 7 12 3.5 19.5 7 12 9.5zM2 17l10 5 10-5v-2l-10 5-10-5v2z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-white">Doha Education Hub</span>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Qatar's most comprehensive school directory. Find, compare, and connect with <strong className="text-white">433 verified schools</strong> in Doha with real contact information and detailed profiles.
            </p>

            {/* Verification Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-medium text-green-300">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified Data
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-medium text-blue-300">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Updated Daily
              </div>
            </div>

            {/* Quick CTA */}
            <Link href="/schools" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search All Schools
            </Link>
          </div>

          {/* Discover Column */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/schools" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  All Schools
                </Link>
              </li>
              <li>
                <Link href="/fees" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Compare Fees
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Find Teachers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Education Blog
                </Link>
              </li>
              <li>
                <Link href="/government" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Government Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Searches Column */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Popular</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/schools?curriculum=British" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  British Schools
                </Link>
              </li>
              <li>
                <Link href="/schools?curriculum=American" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  American Schools
                </Link>
              </li>
              <li>
                <Link href="/schools?curriculum=IB" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  IB Schools
                </Link>
              </li>
              <li>
                <Link href="/schools?type=International" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  International Schools
                </Link>
              </li>
              <li>
                <Link href="/schools?type=Kindergarten" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Kindergartens
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms of Service
                </Link>
              </li>
            </ul>

            {/* Data Freshness Indicator */}
            <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-400">Live Data</span>
              </div>
              <div className="text-xs text-gray-400">Last updated: Dec 19, 2025</div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">Stay Informed</h3>
            <p className="text-sm text-gray-300 mb-4">
              Get the latest school updates, education tips, and admission deadlines delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all whitespace-nowrap">
                Subscribe Free
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} Doha Education Hub.</span>
              <span className="hidden md:inline">All rights reserved.</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>Made with care in Doha, Qatar</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Verified & Secure Platform</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
