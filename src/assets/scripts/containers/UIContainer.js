import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import { Difficulty } from 'config';
import Gauge from 'components/Gauge';
import * as root from 'ducks/root';

@connect(state => state)
export default class UIContainer extends Component {

  static getGaugePosition(difficulty) {
    switch (difficulty) {
      case Difficulty.NORMAL: return 2;
      case Difficulty.HARD: return 3;
      default: return 1;
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user;
  }

  onDifficultyChange = e => {
    this.props.dispatch(root.setDifficulty(e.target.value));
  };

  render() {
    return (
      <div>
        <div className="masthead">
          <div className="masthead__branding">
            <span className="typ typ--secondary typ--1.5x">le nombre</span>
          </div>
        </div>
        <div className="main">
          <div className="main__inner">
            <div className="main__content">
              <span className="typ typ--12x typ--neutral-16 typ--shadow-thin">32</span>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 0, right: 8 }}>
          <Gauge position={UIContainer.getGaugePosition(this.props.user.difficulty)} />
        </div>
        <div style={{ position: 'absolute' }}>
          <select value={this.props.user.difficulty} onChange={this.onDifficultyChange}>
            <option value={Difficulty.EASY}>Easy</option>
            <option value={Difficulty.NORMAL}>Normal</option>
            <option value={Difficulty.HARD}>Hard</option>
          </select>
        </div>
        <dl>
          <dt>
            <svg width="24" height="24">
              <use xlink:href="#link" />
            </svg>
            Streak
          </dt>
          <dd>{this.props.user.streak}</dd>

          <td>Best</td>
          <dd>{this.props.user.bests[this.props.user.difficulty]}</dd>
        </dl>
      </div>
    );
  }
}
