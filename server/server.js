const express = require("express");
const { dbConnect } = require("./config/db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require('./routes/documentRoutes');
const http = require("http");
const { Server } = require("socket.io");
const Document = require('./models/Document');
require("dotenv").config();
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Unified CORS Configuration
const corsOptions = {
    // the allowed client URL
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true  // crucial for allowing cookies to be sent from the frontend.
};

const io = new Server(server, {
    cors: corsOptions, // Use the same options for Socket.IO
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
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());

    app.get("/", (req, res) => {
        res.status(200).send("Synk Server is running and healthy!");
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/documents", documentRoutes);

    // Socket.IO connection handler
    io.on("connection", (socket) => {
        // Load document for editing
        socket.on('get-document', async (documentId) => {
            let documentData;

            // Use cached document if available
            if (documentStates.has(documentId)) {
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