import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
} from '@mui/material';
import { Menu, Star } from '@mui/icons-material';

const IndexedItem = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://json-server.bytexl.app/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        const foundProduct = products.find(item => item.id === parseInt(id));
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          throw new Error(`Product with ID ${id} not found`);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProduct();
  }, [id]);

  if (error) {
    return <div>Error fetching product: {error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg">
      {/* Product Details */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <img
                  src={product.imageUrl || 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PxG_GVE_Blog_Header-bike_1.width-1300.png'}
                  alt={product.productName}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ color: '#f96209', mb: 2 }}>
                {product.productName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Category: {product.category}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Company: {product.company}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#f96209', mr: 1 }}>
                  Price:
                </Typography>
                <Typography variant="h6">${product.price.toFixed(2)}</Typography>
                {product.discount > 0 && (
                  <Typography variant="body2" color="error" sx={{ ml: 1 }}>
                    {product.discount}% OFF
                  </Typography>
                )}
              </Box>
              {product.discount > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    You save:
                  </Typography>
                  <Typography variant="body1" color="error">
                    ${((product.price * product.discount) / 100).toFixed(2)} ({product.discount}%)
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#f96209', mr: 1 }}>
                  Rating:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {Array.from(Array(Math.round(product.rating))).map((_, index) => (
                    <Star key={index} sx={{ color: '#fdd835', fontSize: '1.2rem', mb: '-3px' }} />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default IndexedItem;
