"use client";

// import { read } from "fs";
import { useState, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState("");
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem("powerlearn-notes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
          setNotes(parsedNotes);
        } else {
          // If stored value is empty/invalid, start with one note.
          setNotes([{ id: Date.now(), content: "" }]);
        }
      } catch (e) {
        console.error("Failed to parse notes from localStorage", e);
        setNotes([{ id: Date.now(), content: "" }]);
      }
    } else {
      // If no saved notes, start with one empty note
      setNotes([{ id: Date.now(), content: "" }]);
    }
  }, []);

  // Autosave notes to localStorage with a debounce
  useEffect(() => {
    // Avoid saving the initial empty array before it's populated
    if (notes.length === 0) return;

    const handler = setTimeout(() => {
      localStorage.setItem("powerlearn-notes", JSON.stringify(notes));
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [notes]);

  const handleAddNote = () => {
    setNotes([...notes, { id: Date.now(), content: "" }]);
  };

  const handleDeleteNote = (idToDelete) => {
    // To prevent deleting the last note, we clear it instead.
    if (notes.length <= 1) {
      setNotes([{ id: Date.now(), content: "" }]);
      return;
    }
    setNotes(notes.filter((note) => note.id !== idToDelete));
  };

  const handleNoteChange = (id, content) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, content } : note))
    );
  };
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
    setStreaming(true);
    setStreamingResponse("");
    setShowNotes(false);

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
      setShowNotes(true);
    }
  };
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
            {/* <button
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
            </button> */}

            {/* button 2 */}
            <button
              onClick={handleStreamChat}
              disabled={loading}
              className="
                relative px-14 py-3 mt-14 mx-6
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

        {/* Note Taking Section */}
        {showNotes && (
          <div className="mt-20 fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold mb-4 text-center">My Notes</h2>
              <button
                onClick={handleAddNote}
                // className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 active:bg-amber-700 transition-colors duration-200 text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                 className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-black font-semibold rounded-lg hover:bg-[#fff] transition-colors duration-500 text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"

              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Add Note</span>
              </button>
            </div>
            <div className="space-y-6">
              {notes.map((note, index) => (
                <div key={note.id} className="relative group">
                  <textarea
                    value={note.content}
                    onChange={(e) => handleNoteChange(note.id, e.target.value)}
                    placeholder={`Note ${index + 1} - What's imp?`}
                    className="w-full h-48 p-4 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-amber-500 resize-y shadow-sm text-white placeholder-gray-400 bg-gray-800/30 backdrop-blur transition-colors duration-200"
                  />
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-red-600/80 text-white font-bold rounded-md hover:bg-red-700 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs"
                    aria-label="Delete note"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
       <footer className="mt-16 pb-8 text-center">
          <p className="text-gray-500">
            Powered by Agentic AI  •  Built for learners  •  Designed for success
          </p>
        </footer>
    </div>
  );
}
