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

// We create a list of allowed origins.
const allowedOrigins = [
  process.env.CLIENT_URL, // Your live Vercel URL
  'http://localhost:5173'  // Your local development URL
];

const corsOptions = {
    // The origin function now has added logging for easier debugging.
    origin: function (origin, callback) {
      // --- NEW: Debugging Log ---
      // This will print the incoming request's origin to your Render logs.
      console.log('CORS Check: Request from origin:', origin);
      console.log('CORS Check: Allowed origins:', allowedOrigins);

      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true 
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