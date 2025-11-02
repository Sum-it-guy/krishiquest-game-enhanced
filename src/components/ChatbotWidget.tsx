import React, { useState } from "react";
import { useVoice } from "@/hooks/useVoice";
import { MessageSquare, Mic, X } from "lucide-react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const voice = useVoice();

async function sendMessage(text: string) {
  if (!text.trim()) return;
  setMessages((prev) => [...prev, { from: "user", text }]);
  setInput("");

  try {
    // 👇 this is where we call our local Express server (backend)
    const res = await fetch("http://localhost:5000/api/voice-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    const reply = data.reply || "माफ़ करें, मैं समझ नहीं पाई।";

    setMessages((prev) => [...prev, { from: "bot", text: reply }]);

    // 🔊 Speak the reply in Hindi
    voice.speak(reply, "hi-IN");
  } catch (error) {
    const errMsg = "नेटवर्क में समस्या है। बाद में प्रयास करें।";
    setMessages((prev) => [...prev, { from: "bot", text: errMsg }]);
    voice.speak(errMsg, "hi-IN");
  }
}


  const toggleListening = () => {
    const rec: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!rec) return alert("Speech recognition not supported!");
    const recognition = new rec();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.start();
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white shadow-xl rounded-2xl border border-green-100 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 bg-green-600 text-white rounded-t-2xl">
            <h3 className="font-semibold">KrishiQuest Voice Assistant</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm shadow-sm ${
                    m.from === "user"
                      ? "bg-green-100 text-green-900"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-2 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="अपना प्रश्न लिखें..."
              className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            />
            <button
              onClick={() => sendMessage(input)}
              className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700"
            >
              📩
            </button>
            <button
              onClick={toggleListening}
              className={`rounded-full p-2 ${
                listening ? "bg-red-500 text-white animate-pulse" : "bg-green-600 text-white"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
