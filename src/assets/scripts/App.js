import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import Transition from 'components/Transition';
import GameContainer from 'containers/GameContainer';
import InterstitialContainer from 'containers/InterstitialContainer';
import SplashContainer from 'containers/SplashContainer';
import UIContainer from 'containers/UIContainer';
import { Route } from 'config';

@connect(state => state)
export default class App extends Component {

  renderContent() {
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

  renderGame() {
    switch (this.props.router.route) {
      case Route.MAIN_GAME:
        return <GameContainer />;

      case Route.INTERSTITIAL:
        return <InterstitialContainer />;
    }
  }

  render() {
    const backgrounds = [
      { key: this.props.layout.background, leaveTimeout: 2000 },
    ];
    return (
      <div className="atmosphere">
        <Transition items={backgrounds} children={items => items.map(item => (
          <div key={item.key} className="atmosphere__type" style={{
            background: item.key,
            opacity: (item.state === Transition.ENTERING) ? 0 : 1,
            zIndex: (item.state === Transition.LEAVING) ? -2 : -1,
            transition: `opacity ${item.leaveTimeout}ms`,
          }}></div>
        ))} />
        <div>
          {this.renderContent()}
        </div>
      </div>
    );
  }
};
