import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client/core';
import fetch from 'cross-fetch';
import { LENS_API } from './config';
import { getAuthenticationToken } from './state';

const httpLink = new HttpLink({
  uri: LENS_API,
  fetch,
});

// example how you can pass in the x-access-token into requests using `ApolloLink`
const authLink = new ApolloLink((operation, forward) => {
  const token = getAuthenticationToken();
  console.log('jwt token:', token);

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      'x-access-token': token
        ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4MGM3NThGMzI2RDY3MDBkQjM3QjVkNzUxNWFlNzM0QzViNENCODY2OCIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE2NDc4ODU3MDMsImV4cCI6MTY0Nzg4NzUwM30.4IwNUYiSWddhMU36Zw_VS0XzM5PcaXWghU4vHbfGsFM'
        : '',
    },
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
