import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import GameContainer from 'containers/GameContainer';
import InterstitialContainer from 'containers/InterstitialContainer';
import SplashContainer from 'containers/SplashContainer';
import UIContainer from 'containers/UIContainer';
import { Route } from 'config';

@connect(state => state)
export default class App extends Component {

  renderGame() {
    switch (this.props.router.route) {
      case Route.MAIN_GAME:
        return <GameContainer />;

      case Route.INTERSTITIAL:
        return <InterstitialContainer />;
    }
  }

  render() {
    if (this.props.router.route === Route.SPLASH) {
      return <SplashContainer />;
    }
    return (
      <div>
        <UIContainer />
        {this.renderGame()}
      </div>
    );
  }
};
