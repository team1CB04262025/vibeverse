"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Place } from "@/db/places";
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

export default function ChatBox({
  onClose,
  place,
}: {
  onClose: () => void;
  place: Place;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "assistant",
      text: `How was ${place.name}?`,
    },
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
            className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
          >
            <X size={20} className="text-gray-600" />
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
                    ? "bg-[#1C1C5B] text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text === "Typing..." ? <TypingDots /> : msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
        <div className="sticky bottom-0 bg-white p-4">
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
              className="flex-1 p-3 border rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1C1C5B]"
            />
            <button type="submit" className="p-2 text-[#1C1C5B]">
              <Mic size={20} />
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
