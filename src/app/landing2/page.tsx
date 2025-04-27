"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecommendationChatBox from "@/components/RecommendationChatBox";
export default function Landing2() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="h-[844px] w-[390px] relative mx-auto overflow-hidden bg-white">
      <img
        src="/images/homepage.png"
        alt="Homepage background"
        className="absolute top-0 left-0 w-[390px] h-[844px] object-cover"
        style={{
          objectPosition: "top center",
        }}
      />
      <motion.button
        className="absolute bottom-8 right-8 bg-[#353AF1] w-[76px] h-[76px] flex items-center justify-center text-white shadow-lg rounded-full z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatbotOpen(true)}
      >
        <span className="text-3xl">☺</span>
      </motion.button>

      <AnimatePresence mode="wait">
        {isChatbotOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 z-10"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 bg-white shadow-lg z-20 flex flex-col rounded-t-[32px]"
              style={{ height: "calc(100% - 100px)" }}
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsChatbotOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#E5E5E5] flex items-center justify-center"
                >
                  <span className="text-gray-500 text-sm">✕</span>
                </button>
              </div>

              <RecommendationChatBox />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
