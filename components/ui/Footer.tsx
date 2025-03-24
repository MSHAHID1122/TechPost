"use client";

import { Facebook, Twitter, Linkedin, Github, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              About AI & Tech Hub
            </h3>
            <p className="text-sm">
              AI & Tech Hub is a blog dedicated to sharing the latest trends,
              insights, and discoveries in the field of Computer Science,
              especially Machine Learning and Deep Learning.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm hover:text-purple-600 transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-purple-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.linkedin.com/in/shahid-baloch-ba06b0203"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-600 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/MSHAHID1122"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-600 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <a
                href="mailto:mshahidbaloch462@gmail.com"
                className="text-sm hover:text-purple-600 transition-colors"
              >
                mshahidbaloch462@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} AI & Tech Hub. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
