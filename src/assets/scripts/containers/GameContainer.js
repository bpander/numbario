import Inferno from 'inferno';
import Component from 'inferno-component';
import { TransitionMotion, spring } from 'inferno-motion';
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
    const tilePositions = root.getTilePositions(this.props);
    console.log({ tilePositions });

    return (
      <div style={{ textAlign: 'center', position: 'absolute', top: 0, left: 0, width: '100%' }}>
        <div style={{
          position: 'absolute',
          top: 450,
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
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
        <TransitionMotion
          styles={tilePositions.map(pos => ({
            key: pos.data.index,
            style: { x: spring(pos.x), y: spring(pos.y), scale: spring(1) },
            data: pos.data,
          }))}
          willLeave={(leaving) => {
            return { ...leaving.style, scale: spring(0) };
          }}
        >
          {configs => (
            <ul style={{ position: 'absolute', top: 0, left: 0 }}>
              {configs.map(config => {
                return (
                  <li key={config.key} style={{
                    position: 'absolute',
                    transform: `
                      translate3d(${config.style.x}px, ${config.style.y}px, 0)
                      scale(${config.style.scale})
                    `,
                  }}>
                    <button
                      disabled={numbers.isOperatorIndex(this.props.numbers)}
                      onClick={this.makeOnTokenClick(config.data.index)}
                    >
                      {config.data.value}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </TransitionMotion>
      </div>
    );
  }
}
