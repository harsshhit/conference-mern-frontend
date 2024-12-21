import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com/harsshhit", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/harsshht",
      label: "LinkedIn",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/theharryom",
      label: "Twitter",
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Conference Portal</h3>
            <p className="text-gray-400 leading-relaxed">
              Empowering event organizers and attendees<br/> with cutting-edge
              management tools.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Connect</h4>
            <p className="text-gray-400">Harshit Shukla</p>
            <p className="text-gray-400">Software Developer</p>
            <div className="flex justify-start space-x-4 mt-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-white transition-colors duration-200 ease-in-out"
                >
                  <link.icon size={24} aria-label={link.label} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500">
            &copy; {currentYear} Conference Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
