import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import * as root from 'ducks/root';

@connect(state => state)
export default class InterstitialContainer extends Component {

  onClick = () => {
    const action = (this.props.user.didGiveUp)
      ? root.newGame()
      : root.newRound();
    this.props.dispatch(action);
  };

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <button onClick={this.onClick}>New Game</button>
        {(this.props.user.didGiveUp) && (
          <div>
            {this.props.numbers.answer.map(step => (
              <div>{step.join(' ')}</div>
            ))}
            <div>{this.props.numbers.target}</div>
          </div>
        )}
      </div>
    );
  }
}
