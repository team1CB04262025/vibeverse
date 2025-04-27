"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
interface Message {
  id: number;
  sender: "user" | "assistant";
  text: string;
}

function TypingDots() {
  return (
    <div className="flex items-center justify-start px-4 py-2">
      <div className="flex space-x-1 bg-gray-100 rounded-2xl p-2">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
      </div>
    </div>
  );
}

export default function ChatBox({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "assistant",
      text: "How was the Victrola Coffee Roasters?",
    },
    {
      id: 2,
      sender: "user",
      text: "I really liked it! The atmosphere was great.",
    },
    { id: 3, sender: "assistant", text: "Typing..." },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const nextId = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { id: nextId, sender: "user", text: input },
      { id: nextId + 1, sender: "assistant", text: "Typing..." },
    ]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          id: prev.length + 2,
          sender: "assistant",
          text: "Glad you enjoyed it!",
        },
      ]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "20%" }} // 20%만 보이게
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute bottom-0 left-0 right-0 mx-auto w-full h-[80%] bg-white rounded-t-2xl shadow-xl flex flex-col overflow-hidden z-50"
      >
        {/* X button*/}
        <div className="relative flex justify-end items-center px-4 py-2">
          <button
            onClick={onClose}
            className="p-2 cursor-pointer bg-gray-300 rounded-full hover:bg-gray-400 transition"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* message list */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl whitespace-pre-wrap text-sm ${
                  msg.sender === "user"
                    ? "bg-[#232166] text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text === "Typing..." ? <TypingDots /> : msg.text}
              </div>
            </div>
          ))}

          <div className="flex justify-start gap-4 pt-4 text-[15px]">
            <button
              className="cursor-pointer border border-[#353AF1] text-[#353AF1] rounded-md px-9 py-2 font-semibold"
              onClick={onClose}
            >
              Not now
            </button>

            <Link href="/recommend/1" className="cursor-pointer">
              <div className="bg-[#353AF1] text-white rounded-md px-12 py-2 font-semibold text-center">
                Yes!
              </div>
            </Link>
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
        <div className="sticky bottom-5 bg-white p-4 m-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="I think..."
              className="text-gray-500 bg-gray-50 flex-1 p-3 pl-4 pr-12 border rounded-lg border-[#232166] focus:outline-none focus:ring-1 focus:ring-[#232166]"
            />

            <button type="submit" className="absolute right-8">
              <Image src="/Symbols.svg" alt="mic" width={30} height={30} />
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
