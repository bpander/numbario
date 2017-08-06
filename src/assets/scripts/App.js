import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import GameContainer from 'containers/GameContainer';
import InterstitialContainer from 'containers/InterstitialContainer';
import SplashContainer from 'containers/SplashContainer';
import { Route } from 'config';

@connect(state => state)
export default class App extends Component {
  render() {
    switch (this.props.router.route) {
      case Route.SPLASH:
        return <SplashContainer />;

      case Route.MAIN_GAME:
        return <GameContainer />;

      case Route.INTERSTITIAL:
        return <InterstitialContainer />;
    }
  }
};
