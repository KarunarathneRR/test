const mongoose = require('mongoose');

// Define the inventory schema
const inventorySchema = new mongoose.Schema({
    node: { type: String, required: true },
    rack: { type: Number, required: true, min: 1, max: 1 },
    shelf: { type: Number, required: true, min: 1, max: 1 },
    slot: { type: Number, required: true, min: 1, max: 17 },
    port: { type: Number, required: true, min: 1, max: 16 },
    onu: { type: Number, required: true, min: 1, max: 64 },
    status: {
        type: String,
        enum: ['healthy', 'fault', 'Healthy', 'Fault'],  // Allow both lowercase and capitalized versions
        default: 'healthy'
    },
    
}, { timestamps: true });

// Create the inventory model
const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
