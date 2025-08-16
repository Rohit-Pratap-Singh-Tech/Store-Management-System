import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <svg className="w-10 h-10 mr-3" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#38bdf8"/>
                <text
                  x="16"
                  y="21"
                  textAnchor="middle"
                  fontSize="13"
                  fill="white"
                  fontFamily="Arial"
                  fontWeight="bold"
                >
                  SM
                </text>
              </svg>
              <span className="text-2xl font-bold tracking-wide">
                SuperMart
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Efficient store operations made simple and trustworthy.
            </p>
            <p className="text-gray-500 text-xs">
              123 Market Street, City, Country
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-sky-400">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Home', 'Features', 'Contact', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-sky-400 transition-colors duration-300 text-base"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-sky-400">
              Contact
            </h4>
            <div className="mb-4 text-gray-300 text-base space-y-1">
              <p>
                <span className="font-semibold">Phone:</span>{' '}
                <a href="tel:+1234567890" className="hover:text-sky-400">
                  +1 234 567 890
                </a>
              </p>
              <p>
                <span className="font-semibold">Email:</span>{' '}
                <a href="mailto:support@supermart.com" className="hover:text-sky-400">
                  support@supermart.com
                </a>
              </p>
            </div>
            <div className="flex space-x-5 mt-5">
              {[
                { icon: 'facebook', path: 'M22.675 0h-21.35C.595 0 0 .592 0 ...' },
                { icon: 'instagram', path: 'M12 2.163c3.204 0 3.584.012 ...' },
                { icon: 'linkedin', path: 'M19 0h-14c-2.76 0-5 2.24-5 ...' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label={social.icon}
                  className="text-gray-400 hover:text-sky-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <span className="text-gray-500 text-sm">
            © 2025 SuperMart. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
