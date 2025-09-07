import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabIndex = location.pathname === '/submissions' ? 1 : 0;
  const [value, setValue] = useState(tabIndex);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue === 0 ? '/' : '/submissions');
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', boxShadow: 1 }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Form" />
        <Tab label="Submissions" />
      </Tabs>
    </Box>
  );
};

export default TabNavigation;
