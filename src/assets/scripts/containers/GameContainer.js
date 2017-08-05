import Inferno from 'inferno';
import Component from 'inferno-component';
import { connect } from 'inferno-redux';
import * as numbersActions from 'actions/numbersActions';
import { getLeaves, isOperatorIndex } from 'reducers/numbersReducer';


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
    return (
      <div style={{ textAlign: 'center' }}>
        <div>
          {numbers.target}
        </div>
        <div>
          {[ '+', '-', '*', '/' ].map(operator => (
            <button
              disabled={!isOperatorIndex(this.props.numbers)}
              onClick={this.makeOnTokenClick(operator)}
            >
              {operator}
            </button>
          ))}
        </div>
        <div>
          {leaves.map((n, i) => {
            if (numbers.stream.includes(i)) {
              return null;
            }
            return (
              <button
                disabled={isOperatorIndex(this.props.numbers)}
                onClick={this.makeOnTokenClick(i)}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}
