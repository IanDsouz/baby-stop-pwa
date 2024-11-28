import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Snackbar, Alert, Card, CardContent } from '@mui/material';
import getBaseURL from '../apiConfig';

const Form = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [product, setProduct] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const validateForm = () => {
    let errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!contact) errors.contact = 'Contact is required';
    if (!product) errors.product = 'Product is required';
    if (!date) errors.date = 'Date is required';

    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = { name, email, contact, product, date };

    try {
      const response = await fetch(`${getBaseURL()}/form/submissions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      await response.json();
      if (response.ok) {
        setSnackbarMessage('Form submitted successfully!');
        setSnackbarSeverity('success');
        setName('');
        setEmail('');
        setContact('');
        setProduct('');
        setDate('');
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
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Preloved Equipment Disclaimer
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
            <img src="/babystoplogo.png" alt="Logo" style={{ width: 160, marginRight: 16, marginTop:5 }} />
            <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 1.6 }}>
              Thank you for helping us in reusing preloved equipment. By completing the form below, you confirm 
              that you understand this item was donated to Babystop and has not undergone any quality 
              or safety inspection. You agree it is your responsibility to examine this product 
              before use and accept full responsibility and liability for its safety. Babystop holds 
              no liability for this product. If found unfit, please dispose of it at your local 
              recycling depot. Please note your personal information will only be used for our internal records
            </Typography>
          </Box>

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
              label="Contact"
              fullWidth
              variant="outlined"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              error={!!errorMessages.contact}
              helperText={errorMessages.contact}
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

            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={!!errorMessages.date}
              helperText={errorMessages.date}
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
        </CardContent>
      </Card>

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
