import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { AuthProvider } from './auth/AuthContext';
import { MemoryRouter as Router } from 'react-router-dom';
import App from './App';

it('renders without crashing', () => {
  const user = {
    name: 'Jon von Neumann',
    shortName: 'jon@equinor.com',
    exp: 32472144000,
    isAdmin: true,
    upn: 'jon@equinor.com',
  };

  // This is an invalid mock JWT. Only usable for rendering Web components.
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMDQ5ZjIzNi03ZTM4LTQxYmEtYmU3Ny0yODdiYzFjODU0M2MiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zYWE0YTIzNS1iNmUyLTQ4ZDUtOTE5NS03ZmNmMDViNDU5YjAvIiwiaWF0IjoxNTQ5MDA0MzI2LCJuYmYiOjE1NDkwMDQzMjYsImV4cCI6MTU0OTAwODY4NSwiYWlvIjoiNDJKZ1lGZ1dIaFZ6bitmQjR2bUJtMVFPUHBFT1kvTlQxY3VjTll2ajgzbS8vNnFNaXZzQiIsImFtciI6WyJ3aWEiXSwiZmFtaWx5X25hbWUiOiJ2b24gTmV1bWFubiIsImdpdmVuX25hbWUiOiJKb24iLCJpcGFkZHIiOiIxNDMuOTcuMi40MiIsIm5hbWUiOiJKb24gdm9uIE5ldW1hbm4iLCJub25jZSI6IjhmOTFjNzI5LTUwZDYtNDhmNC1iM2JhLThmM2JjZmNhYWFmOSIsIm9pZCI6IjBlZjk0MmE0LTNlNWItNGM1OC05OWE2LTQxYzcyNDMzZTFkYiIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0yMjA1MjMzODgtMTA4NTAzMTIxNC03MjUzNDU1NDMtMjMzMDY5MiIsInJvbGVzIjpbIlZvbHVtZXRyaWNBZG1pbiJdLCJzdWIiOiJMay1RQk1HYWVsdXFYYVFEeEFEeE1wVEZuZ01YWlUzNHhISkk4SW5rLWpBIiwidGlkIjoiM2FhNGEyMzUtYjZlMi00OGQ1LTkxOTUtN2ZjZjA1YjQ1OWIwIiwidW5pcXVlX25hbWUiOiJqb25AZXF1aW5vci5jb20iLCJ1cG4iOiJKT05AZXF1aW5vci5jb20iLCJ1dGkiOiJ1ZEFhV3hTZHIwbXVmZEhfYlRZSEFBIiwidmVyIjoiMS4wIiwianRpIjoiMTg0MjRlNDUtOTk3ZS00ZTg3LThiNTItYzkxMzdhNDg0ZjBhIn0.vPOoDK6cqXnXf2VM-5HRzEfzwTOP1325--UIR6n7Sg8';
  const roles = [{ field: 'Snorre', role: 'fieldadmin' }];
  ReactDOM.render(
    <MockedProvider addTypename={true}>
      <AuthProvider user={user} token={token} roles={roles}>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </MockedProvider>,
    document.createElement('div'),
  );
});
