import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold text-yellow-400">IITian Squad</h2>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering students with quality education and comprehensive resources from India's top IITians. Your success is our mission.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4 text-yellow-400" />
                <a href="mailto:hr-ops@iitiansquad.com" className="text-sm hover:text-yellow-400 transition-colors">
                  hr-ops@iitiansquad.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4 text-yellow-400" />
                <a href="tel:+919369074016" className="text-sm hover:text-yellow-400 transition-colors">
                  +91 9369074016
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-yellow-400" />
                <span className="text-sm">Bengaluru, India</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="https://facebook.com/iitiansquad" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/iitiansquad" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/iitiansquad" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/iitiansquad" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/iitiansquad" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Competitive Exams */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Competitive Exams</h3>
            <ul className="space-y-2">
              <li><Link href="/exams/jee" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">JEE Main & Advanced</Link></li>
              <li><Link href="/exams/neet" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">NEET UG</Link></li>
              <li><Link href="/exams/gate" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">GATE</Link></li>
              <li><Link href="/exams/upsc" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">UPSC CSE</Link></li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Subjects</h3>
            <ul className="space-y-2">
              <li><Link href="/subjects/physics" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Physics</Link></li>
              <li><Link href="/subjects/chemistry" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Chemistry</Link></li>
              <li><Link href="/subjects/mathematics" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Mathematics</Link></li>
              <li><Link href="/subjects/biology" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Biology</Link></li>
            </ul>
          </div>

          {/* Practice & Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Practice & Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/practice" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Practice Questions</Link></li>
              <li><Link href="/revision" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Revision Hub</Link></li>
              <li><Link href="/analytics" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Performance Analytics</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Study Tips & Blogs</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Company & Support</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/help" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Help Center</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
              <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Terms of Service</Link>
              <Link href="/refund" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Refund Policy</Link>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} IITian Squad. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
