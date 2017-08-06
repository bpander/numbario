import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import { Route } from 'config';
import * as router from 'ducks/router';

@connect(state => state)
export default class SplashContainer extends Component {

  onClick = () => {
    this.props.dispatch(router.push(Route.MAIN_GAME));
  };

  render() {
    return (
      <div>
        <button onClick={this.onClick}>Next</button>
      </div>
    );
  }
}
