import Histogram from './Histogram';
import { volumetrics } from '../../utils/mockData';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Histogram {...volumetrics.data} selectedMetric={'grv'} />,
    div,
  );
});
