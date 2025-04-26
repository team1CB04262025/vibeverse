"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Review } from "@/db/reviews";
import { Message } from "ai";

export default function Chat() {
  // Store review data that gets updated through conversation
  const [review, setReview] = useState<Partial<Review>>({});
  // Animation state for loading dots
  const [loadingDots, setLoadingDots] = useState(1);
  // State to track if review is complete (now set by API)
  const [isReviewComplete, setIsReviewComplete] = useState(false);

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
      reviewState: review, // Pass the current review state with each message
    },
    onResponse: async (response) => {
      try {
        // Check if we can parse JSON from the response
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

        // We return nothing to avoid adding a duplicate message
        // as we're manually adding it above
      } catch (error) {
        // If not JSON, handle as regular response
        console.error("Failed to parse response as JSON", error);
      }
    },
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Animate loading dots
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setLoadingDots((dots) => (dots % 3) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  const onSubmit = (e: FormEvent) => {
    handleSubmit(e);
  };

  // Also update comment when user submits a new message
  const handleFormSubmit = (e: FormEvent) => {
    if (input.trim()) {
      // Update comment with new user input before submission
      setReview((prevReview) => ({
        ...prevReview,
        comment: prevReview.comment
          ? `${prevReview.comment}\n\nUser: ${input}`
          : `User: ${input}`,
      }));
    }
    onSubmit(e);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-zinc-800">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          AI Chat
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Start a conversation by typing a message below.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap ${
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
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
            <div className="max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-bl-none">
              {".".repeat(loadingDots)}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center space-x-2"
        >
          <input
            className="flex-1 p-3 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
            disabled={isLoading || isReviewComplete}
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim() || isReviewComplete}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
