const mongoose = require('mongoose');
const Node = require('../models/Node'); // Import the Node model
const Inventory = require ('../models/Inventory');
const axios = require('axios');
const xml2js = require('xml2js');


// Fetch all faulty nodes from the database
async function getFaultyNodes(req, res) {
    try {
        // Find all nodes with status "fault"
        const faultyNodes = await Node.find({ status: 'fault' });

        return res.status(200).json({
            message: 'Faulty nodes retrieved successfully',
            nodes: faultyNodes, // Return all the faulty nodes
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error while retrieving faulty nodes' });
    }
}

// Get all faults for a specific node
async function getFaultsByNode(req, res) {
    try {
        const { nodeName } = req.params; // Extract the node name from request parameters

        // Find all nodes related to the given node name that have a 'fault' status
        const faults = await Node.find({ node: nodeName, status: 'fault' });

        // Check if any faults were found
        if (!faults || faults.length === 0) {
            return res.status(404).json({ message: `No faults found for node: ${nodeName}` });
        }

        // Return the list of faults for the node
        return res.status(200).json({
            message: 'Faults found for node',
            faults: faults, // Send back all the faults
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching faults for the node' });
    }
}


// Update a node
async function updateNode(req, res) {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Find the node by ID and update it
        const result = await Inventory.findByIdAndUpdate(id, updatedData, { new: true });

        if (!result) {
            return res.status(404).json({ message: 'Node not found' });
        }

        res.status(200).json(result); // Respond with the updated node
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating node' });
    }
}

// Delete a node by ID
async function deleteNode(req, res) {
    try {
        const { id } = req.params; // Extract the ID from request parameters

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Node ID format' });
        }

        // Attempt to delete the node
        const deletedNode = await Node.findByIdAndDelete(id);

        // Check if the node was found and deleted
        if (!deletedNode) {
            return res.status(404).json({ message: 'Node not found' });
        }

        // Return a success message
        return res.status(200).json({
            message: 'Node deleted successfully',
            node: deletedNode, // Optionally, return the deleted node
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error deleting node' });
    }
}





async function getStatusCount(req, res) {
    try {
        // Get distinct fault node names
        const faultNodes = await Node.distinct('node', { status: 'fault' });

        // Get distinct healthy node names
        const healthyNodes = await Node.distinct('node', { status: 'non-fault' });

        // Respond with both healthy and fault nodes
        res.status(200).json({
            message: 'Node status counts retrieved successfully',
            healthyNodes,
            faultNodes,
        });
    } catch (error) {
        console.error('Error fetching node status:', error);
        res.status(500).json({ message: 'Error fetching node status' });
    }
}

async function getNodeCount (req, res)  {
    try {
        const faultyNodesCount = await Node.countDocuments({ status: 'fault' });

        res.json({ faultyNodesCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}



// Get regions with node status counts
async function getRegionsWithStatusCounts(req, res) {
    try {
        const regions = await Node.distinct('region');

        // Fetch healthy and faulty node counts for each region
        const regionCounts = await Promise.all(
            regions.map(async (region) => {
                // Fetch distinct nodes for healthy nodes for this region
                const healthyNodes = await Node.distinct('node', {
                    region,
                    status: 'non-fault'  // Healthy nodes status
                });

                // Fetch distinct nodes for faulty nodes for this region
                const faultyNodes = await Node.distinct('node', {
                    region,
                    status: 'fault'  // Faulty nodes status
                })
                return {
                    region,
                    healthyNodes: healthyNodes.length,  // Count of distinct healthy nodes
                    faultNodes: faultyNodes.length,     // Count of distinct faulty nodes
                };
            })
        );
        res.status(200).json({ regionCounts });
    } catch (error) {
        console.error('Error fetching regions with status counts:', error);
        res.status(500).json({ message: 'Failed to fetch regions with status counts' });
    }
}

// Get provinces with node counts for a specific region
async function getProvinceWithStatusCounts(req, res) {
    const { region } = req.params;

    try {
        // Fetch all distinct provinces for the region
        const provinces = await Node.distinct('province', { region });

        // Fetch healthy and faulty node counts for each province
        const provinceCounts = await Promise.all(
            provinces.map(async (province) => {
                // Fetch distinct nodes for healthy nodes for this province
                const healthyNodes = await Node.distinct('node', {
                    region,
                    province,
                    status: 'non-fault'
                });

                // Fetch distinct nodes for faulty nodes for this province
                const faultyNodes = await Node.distinct('node', {
                    region,
                    province,
                    status: 'fault'
                });

                return {
                    province,
                    healthyNodes: healthyNodes.length,  // Count of distinct healthy nodes
                    faultNodes: faultyNodes.length,     // Count of distinct faulty nodes
                };
            })
        );

        res.status(200).json({ provinceCounts });
    } catch (error) {
        console.error('Error fetching provinces and node counts:', error);
        res.status(500).json({ message: 'Failed to fetch provinces and node counts' });
    }
}


async function getEngineersStatusCounts(req, res) {
    const { region, province } = req.params;
    
    // Log the incoming region and province
    console.log('Region:', region);
    console.log('Province:', province);
  
    try {
      // Fetch engineers for the specified region and province
      const engineers = await Node.aggregate([
        { $match: { region, province } },  // Match documents by region and province
        { $group: { _id: '$nwEng' } },     // Group by network engineer (nwEng)
      ]);
    
      console.log('Engineers:', engineers);  // Add debug to check the engineers list
    
      if (engineers.length > 0) {
        const engineersWithStatusCounts = await Promise.all(
          engineers.map(async (engineer) => {
            const engineerName = engineer._id;  // Get the engineer's name (grouped by nwEng)
            
            // Fetch the distinct nodes for healthy nodes for this engineer
            const healthyNodes = await Node.distinct('node', {
              region,
              province,
              nwEng: engineerName,
              status: 'non-fault'  // Check if this matches the correct value for healthy nodes
            });

            // Fetch the distinct nodes for faulty nodes for this engineer
            const faultyNodes = await Node.distinct('node', {
              region,
              province,
              nwEng: engineerName,
              status: 'fault'  // Ensure 'fault' matches the value in the database
            });
  
            console.log(`Engineer: ${engineerName}, Healthy Nodes: ${healthyNodes.length}, Faulty Nodes: ${faultyNodes.length}`);  // Debug logs
    
            return {
              engineer: engineerName,  // Return the engineer's name
              healthyNodes: healthyNodes.length,  // Count of distinct healthy nodes
              faultyNodes: faultyNodes.length,  // Count of distinct faulty nodes
            };
          })
        );
    
        // Send the response with the engineers and their node counts
        res.status(200).json({ engineers: engineersWithStatusCounts });
      } else {
        res.status(200).json({ engineers: [] });  // If no engineers found
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch engineers status counts' });
    }
}


  // Get nodes grouped by status and their counts for a specific region, province, and engineer
async function getFilteredNodes(req, res) {
    const { region, province, engineer } = req.params; // Use req.params instead of req.query

    try {
        if (!region || !province || !engineer) {
            return res.status(400).json({ message: 'Region, province, and engineer are required.' });
        }

        const healthyNodes = await Node.distinct('node', {
            region,
            province,
            nwEng: engineer,
            status: 'non-fault',
        });

        const faultNodes = await Node.distinct('node', {
            region,
            province,
            nwEng: engineer,
            status: 'fault',
        });

        // Return nodes along with their counts
        res.status(200).json({
            healthyNodes,
            faultNodes,
            healthyCount: healthyNodes.length,
            faultCount: faultNodes.length,
        });
    } catch (error) {
        console.error('Error fetching nodes:', error);
        res.status(500).json({ message: 'Failed to fetch nodes' });
    }
}

 
  
  
  
module.exports = {
   
    getFaultyNodes,
    getFaultsByNode,
    getFilteredNodes,
    updateNode,
    deleteNode,
    getStatusCount,
    getNodeCount,
    getRegionsWithStatusCounts,
    getProvinceWithStatusCounts,
    getEngineersStatusCounts
};
