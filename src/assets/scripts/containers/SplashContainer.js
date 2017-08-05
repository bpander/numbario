import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import { Route } from 'config';


@connect((state, ownProps) => ({ ...state, ...ownProps }))
export default class SplashContainer extends Component {

  onClick = () => {
    this.props.push(Route.MAIN_GAME);
  };

  render() {
    return (
      <div>
        <button onClick={this.onClick}>Next</button>
      </div>
    );
  }
}
