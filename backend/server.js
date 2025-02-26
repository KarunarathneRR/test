
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const faultRoutes = require('./routes/faultRoutes.js');
const locationRoutes = require('./routes/locationRoutes.js');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const xml2js = require('xml2js');  // XML parsing library
const Node = require('./models/Node.js'); // Import the Node model
const Inventory = require('./models/Inventory');  // Import the Inventory model
const router = express.Router();
const userRoutes = require('./routes/User.js');


dotenv.config(); // Load environment variables
connectDB(); // Connect to the database

const app = express(); // Initialize Express app
const server = http.createServer(app); // Create an HTTP server using the app

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',  // Allow frontend connection from localhost:3000
        methods: ['GET', 'POST'],
    }
});


// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/faults', faultRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/users', userRoutes);

// Save faulty nodes into the database
async function saveFaultNodes(req, res) {
    try {
        const xmlData = req.body.xmlData;
        if (!xmlData) {
            return res.status(400).send('XML data is missing.');
        }

        // Log the incoming XML for debugging purposes
        console.log('Received XML Data:', xmlData);

        const soapResponse = await axios.post(
            'https://fmt.slt.com.lk/FMT/WClogin.asmx?op=GPONALARMS',
            xmlData,
            {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    'SOAPAction': 'http://tempuri.org/GPONALARMS',
                },
            }
        );

        const rawXML = soapResponse.data;
        console.log('SOAP Response:', rawXML);  // Log the SOAP response for debugging

        // Parse and clean the XML response
        const parser = new xml2js.Parser({ explicitArray: false });
        const parsedResult = await parser.parseStringPromise(rawXML);
        let gponAlarmsResult =
            parsedResult['soap:Envelope']['soap:Body']['GPONALARMSResponse']['GPONALARMSResult'];

        gponAlarmsResult = cleanMalformedJSON(gponAlarmsResult);

        let alarmsArray = [];
        try {
            alarmsArray = JSON.parse(gponAlarmsResult);
        } catch (jsonError) {
            console.error('JSON Parsing Error:', jsonError.message);
            return res.status(500).send({
                message: 'Failed to parse GPON alarms JSON after cleaning.',
                error: jsonError.message,
                problematicData: gponAlarmsResult,
            });
        }

        // Clear the database before saving new data
        await Node.deleteMany({});

        const savedNodes = [];
        for (const alarm of alarmsArray) {
            const { Node: node, Fault: fault, Region: region, Province: province, NW_Eng: nwEng, Source_ip: sourceIp } = alarm;

            const faultDetails = fault.match(/RACK=(\d+) SHELF=(\d+) SLOT=(\d+) PORT=(\d+)(?: ONU=(\d+))?/);

            if (faultDetails) {
                const [_, rack, shelf, slot, port, onu] = faultDetails;

                const savedNode = await Node.findOneAndUpdate(
                    { node, rack, shelf, slot, port, onu, region, province, nwEng, sourceIp },
                    { status: 'fault' },
                    { upsert: true, new: true }
                );

                savedNodes.push(savedNode);
            }
        }

        res.status(201).json({
            message: 'GPON alarms processed and saved successfully.',
            data: savedNodes,
        });
    } catch (error) {
        console.error('Error processing GPON alarms:', error);
        res.status(500).send({
            message: 'Failed to process GPON alarms.',
            error: error.message,
        });
    }
}


// Create a new endpoint to handle saveFaultNodes
app.post('/api/faults/save', saveFaultNodes);

// Socket.io setup
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Example route in Express
app.post('/api/faults/inventory/import', async (req, res) => {
    try {
        const data = req.body;

        // Validate data before inserting
        for (const item of data) {
            if (!item.node || !item.rack || !item.shelf || !item.slot || !item.port || !item.onu || !item.status) {
                return res.status(400).send({ message: 'Missing required fields' });
            }
        }

        await Inventory.insertMany(data); // Insert data into MongoDB
        res.status(200).send({ message: 'Data imported successfully' });
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).send({ message: 'Failed to import data' });
    }
});


// Enable CORS for the frontend (localhost:3000)
const corsOptions = {
    origin: 'http://localhost:3000',  // Allow requests only from localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow these headers
};

app.use(cors(corsOptions));  // Enable CORS for all routes

// Server listener
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
