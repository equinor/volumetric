import { AuthenticationContext } from 'react-adal';

export const adalConfig = {
  clientId: 'c049f236-7e38-41ba-be77-287bc1c8543c',
  redirectUri: window.location.href,
  cacheLocation: 'localStorage',
  tenant: '3aa4a235-b6e2-48d5-9195-7fcf05b459b0',
  endpoints: {
    api: 'c049f236-7e38-41ba-be77-287bc1c8543c',
  },
  postLogoutRedirectUri: window.location.origin,
};

export const authContext = new AuthenticationContext(adalConfig);
