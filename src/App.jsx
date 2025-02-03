import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState(""); // For user input
  const [messages, setMessages] = useState([]); // Chat history

  const sendPrompt = async () => {
    if (!prompt.trim()) return; // Prevent empty input

    // Add the user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: prompt },
    ]);

    // Clear the textarea immediately after sending the message
    setPrompt("");

    try {
      // Send the prompt to the backend
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      // Add the AI's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "ai", content: data.response },
      ]);
    } catch (err) {
      // Handle errors and display a message
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "error", content: "Error: Unable to connect to the server." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline creation
      sendPrompt(); // Submit the message
    }
  };

  const formatMessageContent = (content) => {
    return content.split("\n").map((line, index) => (
      <p
        key={index}
        style={{
          margin: "0 0 10px",
          lineHeight: "1.6",
        }}
      >
        {line.trim().replace("*", " ")}
      </p>
    ));
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "0",
        padding: "0",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#121212",
        color: "#f0f0f0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "20px", // Add spacing from the bottom
      }}
    >
      <h1
        style={{
          backgroundColor: "#e4afed",
          width: "100%",
          padding: "10px 0",
          color: "#ffffff",
          textAlign: "center",
          fontSize: "2.5rem",
          margin: "10px",
          position: "sticky",
          top: 0
        }}
      >
        Horoscope AI
      </h1>

      {/* Chatbox */}
      <div
        style={{
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "8px",
          flex: "1",
          width: "80%", // Consistent width with the input box
          maxWidth: "1000px",
          backgroundColor: "#1e1e1e",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          marginBottom: "20px",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              textAlign: message.role === "user" ? "right" : "left",
              marginBottom: "10px",
              wordBreak: "break-word",
              padding: "10px",
              backgroundColor: message.role === "ai" ? "#2c2c2c" : "transparent",
              borderRadius: "8px",
            }}
          >
            <strong
              style={{
                color:
                  message.role === "user"
                    ? "#007BFF"
                    : message.role === "ai"
                    ? "#28A745"
                    : "#DC3545",
              }}
            >
              {message.role === "user"
                ? "You"
                : message.role === "ai"
                ? "AI"
                : "Error"}
              :
            </strong>{" "}
            <span style={{ color: "#f0f0f0" }}>
              {formatMessageContent(message.content)}
            </span>
          </div>
        ))}
      </div>

      {/* Prompt Input and Submit Button */}
      <div
        style={{
          width: "80%", // Consistent width with the chatbox
          maxWidth: "1200px",
          position: "relative", // Required for positioning the submit button
          backgroundColor: "#1e1e1e", // Match the chatbox background
          border: "1px solid #333",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          padding: "10px",
        }}
      >
        {/* Textarea */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={{
            flex: "1", // Make the textarea fill available space
            height: "50px",
            padding: "10px",
            fontSize: "16px",
            border: "none", // Remove inner border
            borderRadius: "8px",
            backgroundColor: "transparent", // Match parent background
            color: "#f0f0f0",
            resize: "none",
            outline: "none", // Remove focus outline
          }}
        ></textarea>

        {/* Submit Button */}
        <button
          onClick={sendPrompt}
          style={{
            marginLeft: "10px",
            width: "50px",
            height: "50px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "50%", // Make it circular
            fontSize: "18px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default App;
