const express = require('express');
const router = express.Router();
const Inventory = require ('../models/Inventory');
const Node = require ('../models/Node');
const fetchSOAPData = require('../services/soapService');
const axios = require('axios'); // To make HTTP requests
const xml2js = require('xml2js'); // Import xml2js to parse XML

const {getFaultyNodes, getFilteredNodes,updateNode, deleteNode, getFaultsByNode,getStatusCount,getNodeCount,getRegionsWithStatusCounts,getProvinceWithStatusCounts,getEngineersStatusCounts} = require('../controllers/faultController');

// router.post('/gponalarms',saveFaultNodes);
router.get('/faulty-nodes', getFaultyNodes);
router.get('/nodes/:nodeName', getFaultsByNode);

router.put('/inventory/:id', updateNode);
router.delete('/nodes/:id', deleteNode);
router.get('/counts', getStatusCount);
router.get('/faulty-nodes-count',getNodeCount);
router.get('/regions/status-counts', getRegionsWithStatusCounts);
router.get('/regions/:region/provinces/status-counts',getProvinceWithStatusCounts);
router.get('/regions/:region/provinces/:province/engineers/status-counts', getEngineersStatusCounts);
router.get('/regions/:region/provinces/:province/engineers/:engineer/nodes/status-counts', getFilteredNodes);

router.post('/inventory', async (req, res) => {
    try {
        const { node, status, rack, shelf, slot, port, onu } = req.body;

        // Check if node already exists in the inventory
        let nodeEntry = await Inventory.findOne({ node });

        if (!nodeEntry) {
            // Create a new node if it doesn't exist
            nodeEntry = new Inventory({
                node,
                status,
                rack: rack || 1,
                shelf: shelf || 1,
                slot: slot || 17,
                port: port || 16,
                onu: onu || 64,
            });
            await nodeEntry.save();
        } else {
            // Update the existing node if it exists
            nodeEntry.status = status;
            await nodeEntry.save();
        }

        res.status(200).json({ message: 'Inventory updated successfully' });
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/inventory', async (req, res) => {
    try {
        const items = await Inventory.find();
        res.status(200).json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching inventory items' });
    }
});





module.exports = router;
