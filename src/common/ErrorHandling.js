import React from 'react';

export function GraphqlError(error) {
  const errorMessage = error.graphQLErrors[0].message;
  console.error({ errorMessage });

  return <p>A GraphQLError occurred: {errorMessage}</p>;
}

export function NetworkError(error) {
  const bodyText = error.networkError.bodyText;
  console.error({ bodyText });

  return <p>A NetworkError occurred: {bodyText}</p>;
}
