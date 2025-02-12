"use client";

import { Separator } from "@/components/ui/separator";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-6 py-12 text-center">
      {/* Header Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl"
      >
        <TypographyH2 className="text-4xl font-extrabold text-green-700">
          Welcome to the <span className="text-green-500">Biodiversity Hub</span> 🌿
        </TypographyH2>
        <TypographyP className="mt-3 text-lg text-gray-600">
          A dynamic platform for discovering and documenting species from around the world. Learn, contribute, and be a part of a global movement to protect biodiversity.
        </TypographyP>
      </motion.div>

      {/* Feature Description Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-lg mt-6"
      >
        <TypographyP className="text-md text-gray-700">
          Explore a growing collection of species from different ecosystems.
          Contribute by adding species details such as name, description, and population status.
          Stay Informed with up-to-date information on global biodiversity efforts.
        </TypographyP>
      </motion.div>

      <Separator className="my-6 w-2/3 bg-green-500" />

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-col items-center mt-4"
      >
        <TypographyP className="text-md text-gray-600">
          Sign in at the top right to start exploring and contributing.
        </TypographyP>
        <button className="mt-4 rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-md">
          Explore Now
        </button>
      </motion.div>

      {/* Footer */}
      <TypographyP className="mt-12 text-sm text-gray-500">
        Developed as part of the T4SG Spring 2025 initiative — leveraging technology for conservation.
      </TypographyP>
    </div>
  );
}
