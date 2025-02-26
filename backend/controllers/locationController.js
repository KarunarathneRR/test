const Node = require('../models/Location');

// Get all nodes' lat, lng, and apply filters
const getAllNodeLocations = async (req, res) => {
  try {
    // Extract filters from query parameters
    const { region, province, engineer } = req.query;

    // Build the filter object
    let filter = {};
    if (region) filter.region = region;
    if (province) filter.province = province;
    if (engineer) filter.engineer = engineer;

    // Fetch filtered locations (only name, lat, lng, region, province, engineer)
    const locations = await Node.find(filter, 'name lat lng region province engineer');

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch node locations', details: error.message });
  }
};

// Get unique values for filters
const getFilterValues = async (req, res) => {
  try {
    // Fetch unique regions, provinces, and engineers
    const regions = await Node.distinct('region');
    const provinces = await Node.distinct('province');
    const engineers = await Node.distinct('engineer');

    res.status(200).json({ regions, provinces, engineers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filter values', details: error.message });
  }
};

module.exports = { getAllNodeLocations, getFilterValues };
