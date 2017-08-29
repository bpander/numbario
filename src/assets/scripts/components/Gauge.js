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
            <path fill={config['color-primary']} transform-origin="37.5px" d="
              M32.8,42.2c-2.5-2.5-2.5-6.4-0.1-9.2c2.2-2.5,6.2-2.7,8.9-0.5c0.7,0.5,1.3,0.9,2.2,1.1
              c3.3,0.7,6.5,1.5,9.8,2.3c0.9,0.2,1.8,0.5,1.8,1.7c0,1.2-0.8,1.6-1.8,1.8c-3.4,0.8-6.8,
              1.6-10.2,2.3c-0.6,0.1-1.1,0.4-1.6,0.8C39.2,44.8,35.2,44.7,32.8,42.2z
            " />
          </svg>
        </div>
      </div>
    );
  }
}
