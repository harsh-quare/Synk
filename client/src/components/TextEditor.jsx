import { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./TextEditor.css";
import { io } from "socket.io-client";
import { useParams, Link } from "react-router-dom";

import { TOOLBAR_OPTIONS } from "../constants";
import ProfileDropdown from "./ProfileDropdown";

const SAVE_INTERVAL_MS = 3000;

// Configure allowed fonts for Quill editor
const Font = Quill.import("formats/font");
Font.whitelist = ["sans-serif", "serif", "monospace"];
Quill.register(Font, true);

/**
 * Displays save status as an icon
 * @param {Object} props
 * @param {"Connecting..." | "Unsaved" | "Saving..." | "Saved"} props.status
 */
const SaveStatusIcon = ({ status }) => {
  if (status === "Saving...") {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <svg
          className="animate-spin h-5 w-5 text-gray-400"
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 
            0 0 5.373 0 12h4zm2 
            5.291A7.962 7.962 0 014 
            12H0c0 3.042 1.135 5.824 
            3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (status === "Saved") {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <svg
          className="h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    );
  }

  return null;
};

/**
 * Rich-text collaborative editor component
 */
export function TextEditor() {
  const { id: documentId } = useParams();

  const [socket, setSocket] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // Tracks current document content
  const [saveStatus, setSaveStatus] = useState("Connecting...");
  const quillRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    // We now use an environment variable for the server URL.
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";
    const s = io(serverUrl);
    // const s = io("http://localhost:3001");
    setSocket(s);

    return () => s.disconnect();
  }, []);

  // Load document from server
  useEffect(() => {
    if (!socket) return;

    socket.once("load-document", (document) => {
      setContent(document.data);
      setTitle(document.title);
      quillRef.current?.getEditor().enable();
      setSaveStatus("Saved");
    });

    socket.emit("get-document", documentId);
  }, [socket, documentId]);

  // Listen for changes from other users
  useEffect(() => {
    if (!socket) return;

    const handler = (delta) => {
      quillRef.current?.getEditor().updateContents(delta);
    };

    socket.on("receive-changes", handler);
    return () => socket.off("receive-changes", handler);
  }, [socket]);

  // Auto-save document periodically
  useEffect(() => {
    if (!socket || content === "") return;

    const interval = setInterval(() => {
      if (saveStatus === "Unsaved") {
        setSaveStatus("Saving...");

        socket.emit("save-document", {
          title,
          data: quillRef.current.getEditor().getContents(),
        });

        // Show "Saved" after a short delay
        setTimeout(() => setSaveStatus("Saved"), 2000);
      }
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [socket, title, content, saveStatus]);

  // Handle local user edits
  const handleContentChange = (newContent, delta, source) => {
    if (source !== "user") return;

    setContent(newContent);
    setSaveStatus("Unsaved");

    socket.emit("send-changes", delta);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 p-3 flex justify-between items-center flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/">
            <svg
              className="h-10 w-10 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" style={{ stopColor: "#4f46e5" }} />
                  <stop offset="100%" style={{ stopColor: "#7c3aed" }} />
                </linearGradient>
              </defs>
              <path
                d="M8 8C10.2091 8 12 9.79086 12 
                12C12 14.2091 10.2091 16 8 16"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16 16C13.7909 16 12 14.2091 12 
                12C12 9.79086 13.7909 8 16 8"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base font-normal focus:outline-none bg-transparent 
                text-gray-200 border-b-2 border-transparent focus:border-indigo-500 
                transition-colors w-30 max-w-sm"
              placeholder="Untitled"
            />
            <SaveStatusIcon status={saveStatus} />
          </div>
        </div>

        <ProfileDropdown />
      </header>

      {/* Main editor area */}
      <main className="flex-grow overflow-y-auto">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleContentChange}
          modules={{ toolbar: TOOLBAR_OPTIONS }}
        />
      </main>
    </div>
  );
}
