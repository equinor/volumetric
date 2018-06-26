import App from './App'
import {MockedProvider} from 'react-apollo/test-utils'
import {modelMocks} from './utils/mockData'


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MockedProvider mocks={modelMocks} addTypename={true}>
    <App/>
  </MockedProvider>, div);
});
