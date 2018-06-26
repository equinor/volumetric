import Histogram from './Histogram';
import { volumetrics } from '../../utils/mockData';

const {
  data: { volumetric },
} = volumetrics;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Histogram metrics={volumetric} />, div);
});
