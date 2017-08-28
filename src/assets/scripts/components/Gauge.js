import Inferno from 'inferno';
import Component from 'inferno-component';
import config from '_config.css';

export default class Gauge extends Component {
  render() {
    return (
      <div className="gauge">
        <div className="gauge__band" />
        <div className="gauge__face">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 75">
            <circle fill={config['color-primary']} cx="21.9" cy="53.5" r="2.2"/>
            <circle fill={config['color-primary']} cx="53.4" cy="53.5" r="2.2"/>
            <circle fill={config['color-primary']} cx="21.9" cy="21.2" r="2.2"/>
            <circle fill={config['color-primary']} cx="53.4" cy="21.2" r="2.2"/>
            <circle
              fill="none"
              stroke={config['color-neutral-12-16']}
              stroke-width="5"
              cx="37.5"
              cy="37.5"
              r="30"
            />
            <path
              fill="none"
              stroke={config['color-accent']}
              stroke-width="5"
              stroke-linecap="round"
              d="M16.4,58.8 c-5.5-5.4-8.9-13-8.9-21.3c0-16.6,13.4-30,30-30c8.3,0,15.8,3.4,21.2,8.8"
            />
            <path fill={config['color-primary']} d="
              M37.4,44.8c-3.9,0-7-3-7.2-7.1c-0.2-3.6,2.8-6.9,6.6-7.3c0.9-0.1,1.7-0.4,2.5-0.9c3.1-2,
              6.3-3.9,9.4-5.9c0.9-0.6,1.8-0.9,2.7-0.1c1,0.9,0.6,1.8,0,2.8c-2.1,3.2-4.1,6.5-6.1,9.8
              c-0.4,0.6-0.6,1.2-0.6,1.8C44.4,41.8,41.2,44.8,37.4,44.8z
            " />
          </svg>
        </div>
      </div>
    );
  }
}
