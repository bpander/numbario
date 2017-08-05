import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import * as numbersActions from 'actions/numbersActions';
import { Route } from 'config';


@connect((state, ownProps) => ({ ...state, ...ownProps }))
export default class GameContainer extends Component {

  componentWillMount() {
    const { user } = this.props;
    this.props.dispatch(numbersActions.newGame(user.difficulty));
  }

  onClick = () => {
    this.props.push(Route.SPLASH);
  };

  render() {
    return (
      <div>
        <button onClick={this.onClick}>Back</button>
      </div>
    );
  }
}
