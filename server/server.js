const express = require("express");
const { dbConnect } = require("./config/db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require('./routes/documentRoutes');
const http = require("http");
const { Server } = require("socket.io");
const Document = require('./models/Document');
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS for frontend connection
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", process.env.CLIENT_URL],
        methods: ["GET", "POST"],
        credentials: true // for allowing cookies from the frontend
    },
    pingInterval: 25000,
    pingTimeout: 20000,
});

// In-memory cache for active documents to reduce DB load
const documentStates = new Map();

// Handle unexpected errors
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION!', err);
});

// Connect to database and start server
dbConnect().then(() => {
    app.use(express.json());
    app.use(cookieParser());
    app.use("/api/auth", authRoutes);
    app.use("/api/documents", documentRoutes);

    // Socket.IO connection handler
    io.on("connection", (socket) => {
        // Load document for editing
        socket.on('get-document', async (documentId) => {
            let documentData;

            // Use cached document if available
            if (documentStates.has(documentId)) {l
                documentData = documentStates.get(documentId);
            } else {
                // Otherwise, fetch from database
                const document = await findDocument(documentId);
                if (!document) return;
                documentData = document;
                documentStates.set(documentId, documentData);
            }

            socket.join(documentId);
            socket.emit("load-document", { title: documentData.title, data: documentData.data });

            // Broadcast changes to other clients
            socket.on('send-changes', (delta) => {
                socket.broadcast.to(documentId).emit("receive-changes", delta);
            });

            // Save document changes to DB and cache
            socket.on("save-document", async ({ title, data }) => {
                await Document.findByIdAndUpdate(documentId, { title, data });
                documentStates.set(documentId, { ...documentStates.get(documentId), title, data });
            });
        });
    });

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
        console.log(`Server is running successfully on port ${PORT}`);
    });

}).catch(err => {
    console.error("Failed to connect to the database. Server will not start.", err);
    process.exit(1);
});

// Helper to find document by ID
async function findDocument(id) {
    if (id == null) return;
    const document = await Document.findById(id);
    return document;
}