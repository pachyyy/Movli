import React, { useState, useRef, useEffect } from "react";

// Define the structure of a chat message
interface Message {
    text: string;
    sender: "user" | "bot";
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // Function to scroll to the bottom of the chat window
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Call your backend's chat endpoint
            const response = await fetch(
                "https://movli-backend.onrender.com/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt: input }),
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            const botMessage: Message = { text: data.reply, sender: "bot" };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Failed to fetch bot reply:", error);
            const errorMessage: Message = {
                text: "Sorry, I'm having trouble connecting. Please try again later.",
                sender: "bot",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto rounded-lg ">
            {/* Message Display Area */}
            <div className="relative flex-1 p-4 overflow-y-auto">
                {/* === NEW: Conditional block for suggestions === */}
                {messages.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <h2 className="text-2xl font-bold text-primary mb-2">
                            Movli AI
                        </h2>
                        <p className="text-gray-400 max-w-sm">
                            Ask me to recommend a movie, find an actor's
                            filmography, or anything else you can think of!
                        </p>
                        <div className="mt-6 flex cursor-pointer flex-col gap-2 text-sm">
                            <div
                                onClick={() =>
                                    setInput(
                                        "Suggest a sci-fi movie from the 90s"
                                    )
                                }
                                className="bg-accent hover:bg-light p-3 rounded-lg text-secondary font-rubik transition-colors"
                            >
                                "Suggest a sci-fi movie from the 90s"
                            </div>
                            <div
                                onClick={() =>
                                    setInput("Who directed The Godfather?")
                                }
                                className="bg-accent hover:bg-light p-3 rounded-lg text-secondary font-rubik transition-colors"
                            >
                                "Who directed The Godfather?"
                            </div>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                msg.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            } mb-4`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-5 py-3 rounded-lg font-rubik ${
                                    msg.sender === "user"
                                        ? "bg-accent text-primary"
                                        : "bg-gray-700 text-gray-200"
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">
                                    {msg.text}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                {/* === END of conditional block === */}

                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-700 text-gray-200">
                            <p className="text-sm animate-pulse">Thinking...</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-1 rounded-xl border-gray-700 ">
                <form onSubmit={handleSend} className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything about movies..."
                        className="flex-1 px-4 py-2 bg-white border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
