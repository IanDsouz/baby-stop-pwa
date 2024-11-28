import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Snackbar, Alert } from '@mui/material';
import getBaseURL from '../apiConfig';

const Form = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [product, setProduct] = useState('');
  const [signature, setSignature] = useState('');
  const [errorMessages, setErrorMessages] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const validateForm = () => {
    let errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!product) errors.product = 'Product is required';

    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return; // Stop form submission if there are validation errors
      }

    const formData = { name, email, product, signature };
  
    try {
      const response = await fetch(`${getBaseURL()}/form/submissions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbarMessage('Form submitted successfully!');
        setSnackbarSeverity('success');
        setName('');
        setEmail('');
        setProduct('');
        setSignature('');
      } else {
        setSnackbarMessage('Failed to submit form.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage('Error connecting to server.');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Box
        sx={{
          padding: 4,
          border: '1px solid #ddd',
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Disclaimer Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errorMessages.name}
            helperText={errorMessages.name}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errorMessages.email}
            helperText={errorMessages.email}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Product"
            fullWidth
            variant="outlined"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            error={!!errorMessages.product}
            helperText={errorMessages.product}
            sx={{ marginBottom: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: '12px',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Submit
          </Button>
        </form>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Form;
