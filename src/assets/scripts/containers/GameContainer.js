import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import * as numbers from 'ducks/numbers';


@connect((state, ownProps) => ({ ...state, ...ownProps }))
export default class GameContainer extends Component {

  componentWillMount() {
    const { user } = this.props;
    this.props.dispatch(numbers.newGame(user.difficulty));
  }

  makeOnTokenClick = index => () => {
    this.props.dispatch(numbers.streamPush(index));
  };

  render() {
    const leaves = numbers.getLeaves(this.props.numbers);
    const openStream = numbers.getOpenStream(this.props.numbers);
    return (
      <div style={{ textAlign: 'center' }}>
        <div>
          {this.props.numbers.target}
        </div>
        <div>
          {[ '+', '-', '*', '/' ].map(operator => {
            const isActive = openStream.includes(operator);
            return (
              <button
                disabled={isActive || !numbers.isOperatorIndex(this.props.numbers)}
                onClick={this.makeOnTokenClick(operator)}
                style={(isActive) && { background: 'black' }}
              >
                {operator}
              </button>
            );
          })}
        </div>
        <div>
          {leaves.map(leaf => {
            const isActive = openStream.includes(leaf.index);
            return (
              <button
                disabled={isActive || numbers.isOperatorIndex(this.props.numbers)}
                onClick={this.makeOnTokenClick(leaf.index)}
                style={(isActive) && { background: 'black' }}
              >
                {leaf.value}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}
