"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Place } from "@/db/places";
import { useChat } from "@ai-sdk/react";
import { Message } from "ai";
import { Review } from "@/db/reviews";
import Link from "next/link";
import Image from "next/image";
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

export default function ReviewChatBox({
  onClose,
  place,
}: {
  onClose: () => void;
  place: Place;
}) {
  // Review state
  const [review, setReview] = useState<Partial<Review>>({});
  const [isReviewComplete, setIsReviewComplete] = useState(false);

  useEffect(() => {
    if (isReviewComplete) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Now that you had a great meal, would you like to get some coffee nearby?",
        },
      ]);
    }
  }, [isReviewComplete]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/create_review",
    body: {
      reviewState: review,
      place: place,
    },
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: `How was ${place.name}?`,
        parts: [{ type: "text", text: `How was ${place.name}?` }],
      },
    ],
    onResponse: async (response) => {
      try {
        const responseText = await response.text();
        const data = JSON.parse(responseText);

        if (data.review) {
          // Filter out null fields for logging
          const nonNullReview = Object.fromEntries(
            Object.entries(data.review).filter(([, value]) => value !== null)
          );
          // Remove comment field from logging
          delete nonNullReview.comment;
          console.log("Current Review State");
          console.log(JSON.stringify(nonNullReview, null, 2));

          // Get the latest user message
          const lastUserMessage = messages[messages.length - 1]?.content || "";

          // Get follow-up question if available
          const followUpText = data.followUpQuestion
            ? typeof data.followUpQuestion === "object" &&
              data.followUpQuestion.text
              ? data.followUpQuestion.text
              : String(data.followUpQuestion)
            : "";

          // Create concatenated comment with user input and follow-up
          const currentComment = review.comment || "";
          const newComment = currentComment
            ? `${currentComment}\n\nUser: ${lastUserMessage}${
                followUpText ? `\nAI: ${followUpText}` : ""
              }`
            : `User: ${lastUserMessage}${
                followUpText ? `\nAI: ${followUpText}` : ""
              }`;

          // Update review with the concatenated comment and other data
          setReview((prevReview) => ({
            ...prevReview,
            ...data.review,
            comment: newComment,
          }));

          // Update review completion status from API
          if (data.isReviewComplete !== undefined) {
            setIsReviewComplete(data.isReviewComplete);
          }
          // If we have a follow-up question, add it as an assistant message
          if (data.followUpQuestion) {
            // Extract the question text - followUpQuestion might be a complex object
            const questionText =
              typeof data.followUpQuestion === "object" &&
              data.followUpQuestion.text
                ? data.followUpQuestion.text
                : String(data.followUpQuestion);

            const followupMessage: Message = {
              id: Date.now().toString(),
              role: "assistant",
              content: questionText,
              parts: [{ type: "text", text: questionText }],
            };
            setMessages((prevMessages) => [...prevMessages, followupMessage]);
          }
        }
      } catch (error) {
        console.error("Failed to parse response as JSON", error);
      }
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Update comment with new user input before submission
      setReview((prevReview) => ({
        ...prevReview,
        comment: prevReview.comment
          ? `${prevReview.comment}\n\nUser: ${input}`
          : `User: ${input}`,
      }));
    }
    handleSubmit(e);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "20%" }}
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl whitespace-pre-wrap text-sm ${
                  message.role === "user"
                    ? "bg-[#232166] text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return <div key={`${message.id}-${i}`}>{part.text}</div>;
                  }
                })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <TypingDots />
            </div>
          )}
          <div ref={messagesEndRef} />
          {isReviewComplete && (
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
          )}
        </div>

        {/* 입력창 */}
        <div className="sticky bottom-5 bg-white p-4 m-2">
          <form
            onSubmit={handleFormSubmit}
            className="relative flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="I think..."
              className="text-gray-500 bg-gray-50 flex-1 p-3 pl-4 pr-12 border rounded-lg border-[#232166] focus:outline-none focus:ring-1 focus:ring-[#232166]"
              disabled={isLoading || isReviewComplete}
            />
            <button
              type="submit"
              className="absolute right-6"
              disabled={isLoading || !input.trim() || isReviewComplete}
            >
              <Image src="/Symbols.svg" alt="mic" width={30} height={30} />
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
