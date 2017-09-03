import Inferno from 'inferno';
import Component from 'inferno-component';
import FooterContainer from 'containers/FooterContainer';
import GameContainer from 'containers/GameContainer';
import UIContainer from 'containers/UIContainer';

export default class App extends Component {
  render() {
    return (
      <div>
        <UIContainer />
        <GameContainer />
        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          textAlign: 'center',
        }}>
          <FooterContainer />
        </div>
      </div>
    );
  }
};
