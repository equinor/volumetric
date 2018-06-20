import BarChart from './BarChart'
import { volumetrics } from '../../utils/mockData'


const {data:{volumetric}} = volumetrics;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BarChart metrics={volumetric}/>, div
  );
});
