// src/app.js

import { h } from 'preact';
import FeedbackForm from './FeedbackForm';
import { CssBaseline } from '@mui/material';

const App = () => (
  <>
    <CssBaseline />
    <FeedbackForm />
  </>
);

export default App;
