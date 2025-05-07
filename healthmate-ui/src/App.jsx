import React, { useState } from 'react';
import Login from './components/Login';
import SymptomForm from './components/SymptomForm';
import { Container, Box, CssBaseline } from '@mui/material';

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          {user ? (
            <SymptomForm user={user} />
          ) : (
            <Login onLogin={setUser} />
          )}
        </Box>
      </Container>
    </>
  );
}

export default App;
