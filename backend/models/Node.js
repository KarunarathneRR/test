const mongoose = require('mongoose');

// Define the Node Schema
const nodeSchema = new mongoose.Schema({
    node: {
        type: String,
        required: true, // Root node name (e.g., MD_C300M_30)
    },
    rack: {
        type: Number,
        required: true, // Rack number (integer)
    },
    shelf: {
        type: Number,
        required: true, // Shelf number (integer)
    },
    slot: {
        type: Number,
        required: true, // Slot number (integer)
    },
    port: {
        type: Number,
        required: true, // Port number (integer)
    },
    onu: {
        type: Number, // ONU number is not required (nullable)
    },
    status: {
        type: String,
        enum: ['fault', 'healthy'], // Node status: "fault" or "healthy"
        default: 'fault', // Default status is "fault" for faulty nodes
    },
    region: {
        type: String, // Region field (e.g., "Metro")
        required: true,
    },
    province: {
        type: String, // Province field (e.g., "Metro 1")
        required: true,
    },
    nwEng: {
        type: String, // Network Engineer field (e.g., "A.A.D.M Priyadarshani")
        required: true,
    },
    sourceIp: {
        type: String, // Source IP field
        required: false, // Nullable field
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the Node model
const Node = mongoose.model('Node', nodeSchema);

module.exports = Node;
