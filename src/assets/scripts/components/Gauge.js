import Inferno from 'inferno';
import Component from 'inferno-component';
import config from '_config.css';

export default class Gauge extends Component {

  static defaultProps = {
    position: 0,
  };

  constructor(props) {
    super(props);

    this.outerRadius = 37.5;
    this.x = this.outerRadius;
    this.y = this.outerRadius;

    this.innerRadius = 27.5;

    this.angles = [
      3 * Math.PI / 4,
      5 * Math.PI / 4,
      7 * Math.PI / 4,
      9 * Math.PI / 4,
    ];

    this.arcStartPoint = [
      this.x + this.innerRadius * Math.cos(this.angles[0]),
      this.y + this.innerRadius * Math.sin(this.angles[0]),
    ];
  }

  render() {
    const angle = this.angles[this.props.position];
    const arcEndPoint = [
      this.x + this.innerRadius * Math.cos(angle),
      this.y + this.innerRadius * Math.sin(angle),
    ];
    const largeArcFlag = (angle - this.angles[0] > Math.PI) ? 1 : 0;
    const rx = this.innerRadius;
    const ry = this.innerRadius;

    return (
      <div className="gauge">
        <div className="gauge__band" />
        <div className="gauge__face">
          <svg viewBox={`0 0 ${this.outerRadius * 2} ${this.outerRadius * 2}`}>
            <circle fill={config['color-primary']} cx="23.4" cy="52.1" r="2"/>
            <circle fill={config['color-primary']} cx="51.9" cy="52.1" r="2"/>
            <circle fill={config['color-primary']} cx="23.4" cy="22.7" r="2"/>
            <circle fill={config['color-primary']} cx="51.9" cy="22.7" r="2"/>
            <circle
              fill="none"
              stroke={config['color-neutral-12-16']}
              stroke-width="5"
              cx={this.x}
              cy={this.y}
              r={this.innerRadius}
            />
            <path
              fill="none"
              stroke={config['color-accent']}
              stroke-width="5"
              stroke-linecap="round"
              d={`
                M ${this.arcStartPoint.join(' ')}
                A ${rx} ${ry} 0 ${largeArcFlag} 1 ${arcEndPoint.join(' ')}
              `}
            />
            <path
              fill={config['color-primary']}
              style={{
                transformOrigin: this.outerRadius,
                transform: `rotate(${angle}rad)`,
              }}
              d="
                M32.8,42.2c-2.5-2.5-2.5-6.4-0.1-9.2c2.2-2.5,6.2-2.7,8.9-0.5c0.7,0.5,1.3,0.9,2.2,1.1
                c3.3,0.7,6.5,1.5,9.8,2.3c0.9,0.2,1.8,0.5,1.8,1.7c0,1.2-0.8,1.6-1.8,1.8c-3.4,
                0.8-6.8,1.6-10.2,2.3c-0.6,0.1-1.1,0.4-1.6,0.8C39.2,44.8,35.2,44.7,32.8,42.2z
              " />
          </svg>
        </div>
      </div>
    );
  }
}
