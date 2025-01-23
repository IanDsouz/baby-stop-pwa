import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TabNavigation from './components/TabNavigation'; 
import Form from './components/Form';
// import SubmissionList from './components/SubmissionList';

const App = () => {
  return (
    <Router>
      <TabNavigation />
      <Routes>
        <Route path="/" element={<Form />} />
        {/* <Route path="/submissions" element={<SubmissionList />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
