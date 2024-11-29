import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import getBaseURL from '../apiConfig';

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${getBaseURL()}/form/submissions/`)
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };
  
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSubmission(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', mt: 3 }}>
        <Typography variant="h5" align="center" sx={{ padding: 2 }}>
          Submitted Forms
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Mobile</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow 
                key={submission.id} 
                onClick={() => handleRowClick(submission)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell>{submission.id}</TableCell>
                <TableCell>{submission.name}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.product}</TableCell>
                <TableCell>{submission.mobile}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedSubmission && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Submission Details</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1">
              <strong>ID:</strong> {selectedSubmission.id}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Name:</strong> {selectedSubmission.name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Email:</strong> {selectedSubmission.email}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Product:</strong> {selectedSubmission.product}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Mobile:</strong> {selectedSubmission.mobile}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default SubmissionList;
