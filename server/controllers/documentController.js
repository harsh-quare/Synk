const Document = require('../models/Document');
const mongoose = require('mongoose');

// Create a new document for the logged-in user
exports.createDocument = async (req, res) => {
    try{
        // Create document and assign owner from authenticated user
        const newDocument = await Document.create({
            _id: new mongoose.Types.ObjectId().toString(),
            owner: req.user._id,
            data: {
                type: "doc",
                content: [{ type: "paragraph" }]
            },
        });
        res.status(201).json(newDocument);
    } 
    catch(err){
        console.error("Error creating document:", err);
        res.status(500).json({ message: "Server error creating document." });
    }
};

// Get all documents for the logged-in user
exports.getDocuments = async (req, res) => {
    try{
        // Find documents owned by the authenticated user
        const documents = await Document.find({ owner: req.user._id }).sort({ updatedAt: -1 });
        res.status(200).json(documents);
    } 
    catch(err){
        console.error("Error fetching documents:", err);
        res.status(500).json({ message: "Server error fetching documents." });
    }
};