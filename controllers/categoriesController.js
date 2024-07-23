const axios = require('axios');
const API_BASE_URL = 'https://json-server.bytexl.app';

exports.getCategories = async (req, res) => {
  try {
    // console.log('Fetching categories...'); // Logging to check if the request reaches the controller
    const response = await axios.get(`${API_BASE_URL}/categories`);
    // console.log('Raw response:', response); // Logging to see the full raw response
    // console.log('Categories fetched successfully:', response.data); // Logging to see the fetched data
    res.json(response.data);
  } catch (error) {
    // console.error('Error fetching categories:', error); // Logging the error
    res.status(500).json({ error: 'Error fetching categories' });
  }
};
