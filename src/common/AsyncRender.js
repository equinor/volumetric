import React, { useEffect, useState } from 'react';
import { StyledSpinner } from './Spinner';

function useAsyncRender() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return shouldRender;
}

const AsyncRender = props => {
  /**
   * Delay the rendering of render prop until after rendering
   * a spinner so that a spinner is shown while render prop is rendering.
   * @param props
   */

  const shouldRender = useAsyncRender();

  return (
    <StyledSpinner isLoading={!shouldRender}>{props.render()}</StyledSpinner>
  );
};

export default AsyncRender;
