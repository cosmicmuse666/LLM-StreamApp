"use client";

// import { read } from "fs";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false)
  const [streamingResponse, setStreamingResponse] = useState("")
  const handleChat = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Error: " + error.message);
    }
    setLoading(false);
  };

  const handleStreamChat = async ()=>{
    setStreaming(true)
    setStreamingResponse("")

    try {
      const res = await fetch("/api/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            setStreamingResponse((prev) => prev + data.content);
          }
        }
      }
    } catch (error) {
      setStreamingResponse("Error: " + error.message);
    } finally {
      setStreaming(false);
    }
  }
  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20 bg-black text-white">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold">PowerLearn</h1>
      </div>
      
      {/* Main Content Container */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's up, hustler! Let's learn"
            className="w-full h-24 p-4 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-amber-500 resize-none shadow-sm text-white placeholder-gray-400 bg-gray-800/50 backdrop-blur transition-colors duration-200"
          />
          
          {/* Button directly below textarea */}
          <div className="flex justify-center">
            <button
              onClick={handleChat}
              disabled={loading}
              className="
                relative px-10 py-3 mt-14 mx-6
                bg-gradient-to-r from-amber-400 to-amber-500
                hover:from-amber-500 hover:to-amber-600
                active:from-amber-600 active:to-amber-700
                disabled:from-gray-300 disabled:to-gray-400
                text-black font-semibold text-xl
                rounded-full
                shadow-lg shadow-amber-500/25
                hover:text-white
                hover:shadow-xl hover:shadow-amber-500/40
                active:shadow-md active:shadow-amber-600/30
                disabled:shadow-none
                transform hover:scale-105 active:scale-95
                disabled:scale-100 disabled:cursor-not-allowed
                transition-all duration-200 ease-out
                border border-amber-600/20
                hover:border-amber-600/40
                focus:outline-none focus:ring-4 focus:ring-amber-300/50
                disabled:opacity-70
              "
            >
              <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-70' : ''}`}>
                {loading && (
                  <svg 
                    className="animate-spin h-4 w-4 text-current" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {loading ? "Processing..." : "Chats"}
              </span>
            </button>

            {/* button 2 */}
            <button
              onClick={handleStreamChat}
              disabled={loading}
              className="
                relative px-9 py-3 mt-14 mx-6
                bg-gradient-to-r from-amber-600 to-amber-500
                 hover:from-amber-400 hover:to-amber-500
                active:from-amber-700 active:to-amber-600
                disabled:from-gray-300 disabled:to-gray-400
                text-black font-semibold text-xl
                rounded-full
                shadow-lg shadow-amber-500/25
                hover:text-white
                hover:shadow-xl hover:shadow-amber-500/40
                active:shadow-md active:shadow-amber-600/30
                disabled:shadow-none
                transform hover:scale-105 active:scale-95
                disabled:scale-100 disabled:cursor-not-allowed
                transition-all duration-200 ease-out
                border border-amber-600/20
                hover:border-amber-600/40
                focus:outline-none focus:ring-4 focus:ring-amber-300/50
                disabled:opacity-70
              "
            >
              <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-70' : ''}`}>
                {loading && (
                  <svg 
                    className="animate-spin h-4 w-4 text-current" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {loading ? "Processing..." : "Stream"}
              </span>
            </button>
          </div>
        </div>
        
        {/* Response Section */}
        {response && (
          <div className="mt-20 p-6 border-2 border-gray-600 rounded-lg bg-gray-800/30 backdrop-blur">
            <div className="text-lg leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
          {streamingResponse && (
          <div className="mt-20 p-6 border-2 border-gray-600 rounded-lg bg-gray-800/30 backdrop-blur">
            <div className="text-lg leading-relaxed whitespace-pre-wrap">
              {streamingResponse}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}