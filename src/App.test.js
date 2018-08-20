import App from './App';
import { MockedProvider } from 'react-apollo/test-utils';

it('renders without crashing', () => {
  ReactDOM.render(
    <MockedProvider addTypename={true}>
      <App />
    </MockedProvider>,
    document.createElement('div'),
  );
});
