"use client";

import { Mail, Linkedin, Github } from "lucide-react"; // Icons for contact links
import { Button } from "@/components/ui/button"; // Reusable button component

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
          About Me
        </h1>

        {/* Introduction Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Hi, I'm Shahid Baloch 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            I'm a passionate Computer Science student at the{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              University of Engineering and Technology (UET), Lahore
            </span>
            . My journey in the world of technology began with a curiosity to
            understand how machines learn and make decisions. Over time, I've
            developed a deep interest in cutting-edge fields like{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Machine Learning
            </span>{" "}
            and{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Deep Learning
            </span>
            .
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            This blog is my way of sharing the latest trends, insights, and
            discoveries in the ever-evolving field of Computer Science. Whether
            you're a fellow student, a tech enthusiast, or a professional, I aim
            to provide valuable content that inspires and educates.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            My Mission 🚀
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            The world of technology is advancing at an unprecedented pace. My
            mission is to break down complex topics into digestible, engaging
            content that helps you stay ahead of the curve. From
            beginner-friendly tutorials to in-depth explorations of advanced
            concepts, I strive to make learning accessible and enjoyable.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            I believe that knowledge grows when shared, and I'm excited to be
            part of this global community of learners and innovators.
          </p>
        </div>

        {/* Expertise Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            What I Write About 💻
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 leading-relaxed">
            <li>Machine Learning and Deep Learning</li>
            <li>Artificial Intelligence (AI) Trends</li>
            <li>Data Science and Big Data</li>
            <li>Programming Tips and Tricks</li>
            <li>Latest Research in Computer Science</li>
            <li>Career Advice for Aspiring Developers</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Let's Connect! 📬
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            I'm always open to discussions, collaborations, and feedback. If you
            have any questions, suggestions, or just want to say hi, feel free
            to reach out to me via email or connect with me on social media.
          </p>
          <div className="flex items-center gap-4">
            {/* Email Button */}
            <a href="mailto:mshahidbaloch462@gmail.com">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Mail className="h-4 w-4" />
                Email Me
              </Button>
            </a>

            {/* LinkedIn Button */}
            <a
              href="https://www.linkedin.com/in/shahid-baloch-ba06b0203"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </a>

            {/* GitHub Button */}
            <a
              href="https://github.com/MSHAHID1122"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
