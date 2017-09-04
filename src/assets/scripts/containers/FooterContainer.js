import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import * as numbers from 'ducks/numbers';
import * as root from 'ducks/root';

@connect(state => state)
export default class FooterContainer extends Component {

  onUndo = () => {
    this.props.dispatch(numbers.streamPop());
  };

  onRefresh = () => {
    this.props.dispatch(numbers.streamClear());
  };

  onGiveUp = () => {
    this.props.dispatch(root.giveUp());
  };

  render() {
    return (
      <ul className="hList hList--3x">
        <li>
          <button className="bubble" onClick={this.onUndo}>
            <svg className="svg svg--bigger svg--lightest">
              <use xlink:href="#undo" />
            </svg>
          </button>
        </li>
        <li>
          <button className="bubble" onClick={this.onRefresh}>
            <svg className="svg svg--bigger svg--lightest">
              <use xlink:href="#refresh" />
            </svg>
          </button>
        </li>
        <li>
          <button className="bubble" onClick={this.onGiveUp}>
            <svg className="svg svg--bigger svg--lightest">
              <use xlink:href="#skip" />
            </svg>
          </button>
        </li>
      </ul>
    );
  }
}
