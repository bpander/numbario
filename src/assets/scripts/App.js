import Inferno from 'inferno';
import Component from 'inferno-component';
import GameContainer from 'containers/GameContainer';
import UIContainer from 'containers/UIContainer';

export default class App extends Component {
  render() {
    return (
      <div>
        <UIContainer />
        <GameContainer />
      </div>
    );
  }
};
