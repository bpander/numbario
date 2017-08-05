import Inferno from 'inferno';
import Component from 'inferno-component';
import GameContainer from 'containers/GameContainer';
import SplashContainer from 'containers/SplashContainer';
import { Route } from 'config';


export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      route: Route.MAIN_GAME,
      transitionProgress: 0,
    };
  }

  push = route => this.setState({ route });

  render() {
    switch (this.state.route) {
      case Route.SPLASH:
        return <SplashContainer push={this.push} />;

      case Route.MAIN_GAME:
        return <GameContainer push={this.push} />;

      case Route.INTERSTITIAL:
        // return <InterstitialContainer />;
    }
  }
};
