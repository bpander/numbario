import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import * as numbers from 'ducks/numbers';
import * as root from 'ducks/root';
import { last } from 'util/arrays';

@connect(state => state)
export default class GameContainer extends Component {

  componentWillMount() {
    if (!this.props.numbers.inventory.length) {
      const { user } = this.props;
      this.props.dispatch(root.newGame(user.difficulty));
    }
  }

  componentWillReceiveProps(nextProps) {
    const leaves = numbers.getLeaves(nextProps.numbers);
    const wasSuccessful = last(leaves).value === nextProps.numbers.target;
    if (wasSuccessful) {
      // TODO: Show success modal here
    }
  }

  makeOnTokenClick = token => () => {
    this.props.dispatch(numbers.streamPush(token));
  };

  render() {
    const leaves = numbers.getLeaves(this.props.numbers);
    const openStream = numbers.getOpenStream(this.props.numbers);
    const steps = numbers.getSteps(this.props.numbers);

    return (
      <div style={{ textAlign: 'center', position: 'relative' }}>
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
          {leaves.filter(leaf => !leaf.isUsed).map(leaf => {
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
        <ul>
          {steps.map(step => (
            <li>{step}</li>
          ))}
        </ul>
      </div>
    );
  }
}
