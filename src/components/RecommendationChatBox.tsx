"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface Recommendation {
  placeName: string;
  placeId: string;
  reason: string;
}

interface RecommendationResponse {
  recommendations: Recommendation[];
}

interface Message {
  id: number;
  sender: "user" | "assistant";
  text?: string;
  recommendations?: Recommendation[];
}

function TypingIndicator() {
  return (
    <div className="flex space-x-1 bg-gray-100 rounded-2xl p-2">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
    </div>
  );
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-3">
      <h3 className="font-bold text-lg">{recommendation.placeName}</h3>
      <p className="text-gray-700 mt-1">{recommendation.reason}</p>
    </div>
  );
}

export default function RecommendationChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "assistant",
      text: "Hello! Tell me what kind of place you're looking for and I'll provide recommendations.",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchRecommendations = async (
    input: string
  ): Promise<RecommendationResponse> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create_recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return { recommendations: [] };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessageId = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, sender: "user", text: userInput },
    ]);

    // Add loading message
    const loadingMessageId = userMessageId + 1;
    setMessages((prev) => [
      ...prev,
      { id: loadingMessageId, sender: "assistant", text: "loading" },
    ]);

    const input = userInput;
    setUserInput("");

    // Get AI response
    const response = await fetchRecommendations(input);

    // Replace loading message with actual response
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === loadingMessageId
          ? {
              ...msg,
              text: response.recommendations.length
                ? "Here are some recommendations for you:"
                : "Sorry, I couldn't find any recommendations based on your criteria.",
              recommendations: response.recommendations,
            }
          : msg
      )
    );
  };

  return (
    <div className="flex flex-col max-w-3xl mx-auto h-screen space-between">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] ${
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-xl rounded-tr-none px-4 py-2"
                  : message.text === "loading"
                  ? ""
                  : "bg-gray-100 text-gray-800 rounded-xl rounded-tl-none p-4"
              }`}
            >
              {message.text === "loading" ? (
                <TypingIndicator />
              ) : (
                <div>
                  {message.text && (
                    <div className="whitespace-pre-wrap mb-2">
                      {message.text}
                    </div>
                  )}
                  {message.recommendations &&
                    message.recommendations.length > 0 && (
                      <div className="mt-2">
                        {message.recommendations.map((rec, index) => (
                          <RecommendationCard
                            key={index}
                            recommendation={rec}
                          />
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="What kind of place are you looking for?"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
