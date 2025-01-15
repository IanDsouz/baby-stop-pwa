import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip } from '@mui/material';
import { openDB } from 'idb';
import getBaseURL from '../apiConfig';

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [offlineSubmissions, setOfflineSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [open, setOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  const fetchSubmissions = async () => {
    if (isOnline) {
      try {
        const response = await fetch(`${getBaseURL()}/form/submissions/`);
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    } else {
      console.log('Offline - fetching submissions from IndexedDB');
      const offlineData = await fetchOfflineSubmissions();
      setOfflineSubmissions(offlineData);
    }
  };

  const fetchOfflineSubmissions = async () => {
    const db = await openDB('FormSyncDB', 1);
    const data = await db.getAll('requests') || [];

    return data.map((submission) => ({
      ...submission,
      date_submitted: submission.date_submitted || new Date().toISOString(),
    }));
  };
  
  useEffect(() => {
    fetchSubmissions();
  }, [isOnline]);

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSubmission(null);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
  
    // Extract day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
  
    // Determine the ordinal suffix for the day
    const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
                   (day % 10 === 2 && day !== 12) ? 'nd' :
                   (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
  
    return `${day}${suffix} ${month} ${year}`;
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: 'auto', mt: 3 }}>
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
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Online Submissions */}
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
                <TableCell>{formatDate(submission.date_submitted)}</TableCell>
                <TableCell>
                  <Chip label="Synced" color="success" size="small" />
                </TableCell>
              </TableRow>
            ))}

            {/* Offline Submissions */}
            {offlineSubmissions.map((submission) => (
              <TableRow 
                key={submission.id} 
                onClick={() => handleRowClick(submission)}
                sx={{ cursor: 'pointer', backgroundColor: '#fff7e6', '&:hover': { backgroundColor: '#ffe8cc' } }}
              >
                <TableCell>{submission.id}</TableCell>
                <TableCell>{submission.name}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.product}</TableCell>
                <TableCell>{submission.mobile}</TableCell>
                <TableCell>
                  <Chip label="Pending Sync" color="warning" size="small" />
                </TableCell>
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
            {offlineSubmissions.some(s => s.id === selectedSubmission.id) && (
              <Typography variant="body2" sx={{ mt: 2, color: 'orange' }}>
                This submission is pending synchronization.
              </Typography>
            )}
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
