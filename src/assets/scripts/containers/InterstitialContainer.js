import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import { Route } from 'config';
import * as numbers from 'ducks/numbers';


@connect((state, ownProps) => ({ ...state, ...ownProps }))
export default class InterstitialContainer extends Component {

  onClick = () => {
    this.props.dispatch(numbers.newGame(this.props.user.difficulty));
    this.props.push(Route.MAIN_GAME);
  };

  render() {
    return (
      <div>
        <button onClick={this.onClick}>New Game</button>
      </div>
    );
  }
}
