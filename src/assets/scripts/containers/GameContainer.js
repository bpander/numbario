import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import * as numbersActions from 'actions/numbersActions';
import { getLeaves, getOpenStream, isOperatorIndex } from 'reducers/numbersReducer';


@connect((state, ownProps) => ({ ...state, ...ownProps }))
export default class GameContainer extends Component {

  componentWillMount() {
    const { user } = this.props;
    this.props.dispatch(numbersActions.newGame(user.difficulty));
  }

  makeOnTokenClick = index => () => {
    this.props.dispatch(numbersActions.streamPush(index));
  };

  render() {
    const { numbers } = this.props;
    const leaves = getLeaves(this.props.numbers);
    const openStream = getOpenStream(this.props.numbers);
    return (
      <div style={{ textAlign: 'center' }}>
        <div>
          {numbers.target}
        </div>
        <div>
          {[ '+', '-', '*', '/' ].map(operator => {
            const isActive = openStream.includes(operator);
            return (
              <button
                disabled={isActive || !isOperatorIndex(this.props.numbers)}
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
                disabled={isActive || isOperatorIndex(this.props.numbers)}
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
