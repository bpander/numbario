import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import { Difficulty } from 'config';
import * as root from 'ducks/root';

@connect(state => state)
export default class UIContainer extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user;
  }

  onDifficultyChange = e => {
    this.props.dispatch(root.setDifficulty(e.target.value));
  };

  render() {
    return (
      <div>
        <select value={this.props.user.difficulty} onChange={this.onDifficultyChange}>
          <option value={Difficulty.EASY}>Easy</option>
          <option value={Difficulty.NORMAL}>Normal</option>
          <option value={Difficulty.HARD}>Hard</option>
        </select>
      </div>
    );
  }
}
