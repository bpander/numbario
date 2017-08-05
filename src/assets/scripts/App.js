import Inferno from 'inferno';
import Component from 'inferno-component';
import * as numbersActions from 'actions/numbersActions';
import GameContainer from 'containers/GameContainer';
import SplashContainer from 'containers/SplashContainer';
import { Route } from 'config';


export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      route: Route.SPLASH,
      transitionProgress: 0,
    };
  }

  onPush = (route) => {
    this.setState({ route });
  };

  render() {
    switch (this.state.route) {
      case Route.SPLASH:
        return <SplashContainer push={this.onPush} />;

      case Route.MAIN_GAME:
        return <GameContainer push={this.onPush} />;

      case Route.INTERSTITIAL:
        // return <InterstitialContainer />;
    }
  }
};
