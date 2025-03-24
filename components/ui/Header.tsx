"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1 ${
        isScrolled ? "bg-gray-900" : "bg-gray-900"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-purple-600 dark:text-purple-400"
          >
            AI & Tech Hub
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/" isActive={pathname === "/"}>
              Blogs
            </NavLink>

            <NavLink href="/categories" isActive={pathname === "/categories"}>
              Categories
            </NavLink>

            <NavLink href="/about" isActive={pathname === "/about"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
              >
                About Us
              </motion.button>
            </NavLink>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900 shadow-md"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <NavLink
                href="/"
                isActive={pathname === "/"}
                onClick={toggleMenu}
              >
                Home
              </NavLink>

              <NavLink
                href="/categories"
                isActive={pathname === "/categories"}
                onClick={toggleMenu}
              >
                Categories
              </NavLink>

              <NavLink
                href="/about"
                isActive={pathname === "/about"}
                onClick={toggleMenu}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-slate-700 transition-colors"
                >
                  About Us
                </motion.button>
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  children,
  isActive,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className={`relative text-lg font-medium transition-colors ${
        isActive
          ? "text-purple-600 dark:text-purple-400"
          : "text-gray-600 hover:text-white dark:text-gray-300 dark:hover:text-white"
      }`}
      onClick={onClick}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
}
