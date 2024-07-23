const axios = require('axios');
const API_BASE_URL = 'https://json-server.bytexl.app';

exports.getCompanies = async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Error fetching companies' });
  }
};
