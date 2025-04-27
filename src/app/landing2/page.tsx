"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdMic } from "react-icons/md";

export default function Landing2() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState([
    {
      type: "assistant",
      text: "Hi Jane. I'm ready to help you find the perfect spot. Are you looking for a restaurant or a cafe today?",
      isLoading: true,
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isChatbotOpen && isLoading) {
      const timer = setTimeout(() => {
        setMessages([
          {
            type: "assistant",
            text: "Hi Jane. I'm ready to help you find the perfect spot. Are you looking for a restaurant or a cafe today?",
            isLoading: false,
          },
        ]);
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isChatbotOpen, isLoading]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      type: "user",
      text: inputText,
      isLoading: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    setMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        text: "...",
        isLoading: true,
      },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            type: "assistant",
            text: data.message,
            isLoading: false,
          },
        ]);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          type: "assistant",
          text: "Sorry, I couldn't process your request. Please try again.",
          isLoading: false,
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

              <div className="flex-1 px-7 overflow-y-auto">
                <div className="space-y-2.5">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[280px] rounded-[20px] ${
                          message.type === "user"
                            ? "bg-[#23255B] text-white rounded-br-none"
                            : "bg-gray-100 text-gray-900 rounded-bl-none"
                        }`}
                        style={{ padding: "12px 16px" }}
                      >
                        {message.isLoading ? (
                          <motion.span
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              repeatType: "reverse",
                            }}
                          >
                            ...
                          </motion.span>
                        ) : (
                          message.text
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="bg-white px-4 pb-4">
                <div className="flex items-center gap-2 border border-[#E5E5E5] rounded-[20px] px-4 py-3">
                  <input
                    type="text"
                    placeholder="I think..."
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-base"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="p-2 rounded-full bg-[#F4F4F4] flex items-center justify-center"
                    onClick={handleSendMessage}
                  >
                    <MdMic className="w-5 h-5 text-[#232166]" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
