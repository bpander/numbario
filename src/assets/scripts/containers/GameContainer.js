import React, { Component } from 'react';
import { TransitionMotion, spring, stripStyle } from 'react-motion';
import { connect } from 'react-redux';
import { OPERATOR_INDEX } from 'lib/streams';
import * as numbers from 'ducks/numbers';
import * as root from 'ducks/root';
import { last } from 'util/arrays';

@connect(state => state)
export default class GameContainer extends Component {

  willEnter(entering) {
    return { ...stripStyle(entering.style), scale: 0 };
  }

  willLeave(leaving) {
    return { ...leaving.style, scale: spring(0) };
  }

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
    const unusedLeaves = leaves.filter(l => !l.isUsed && !openStream.includes(l.index));

    return (
      <div style={{ textAlign: 'center', position: 'absolute', top: 0, left: 0, width: '100%' }}>
        <TransitionMotion
          styles={openStream.map((token, i) => ({
            key: String(token),
            data: (i === OPERATOR_INDEX) ? token : leaves[token].value,
            style: { scale: spring(1), x: spring(i * 30) },
          }))}
          defaultStyles={openStream.map((token, i) => ({
            key: String(token),
            data: (i === OPERATOR_INDEX) ? token : leaves[token].value,
            style: { scale: 0, x: i * 30 },
          }))}
          willEnter={this.willEnter}
          willLeave={this.willLeave}
        >
          {configs => (
            <ul style={{ position: 'absolute', top: 350 }}>
              {configs.map((config, i) => (
                <li key={config.key} style={{
                  position: 'absolute',
                  transform: `
                    translate3d(${config.style.x}px, 0, 0)
                    scale(${config.style.scale})
                  `,
                }}>
                  <span>{config.data}</span>
                </li>
              ))}
            </ul>
          )}
        </TransitionMotion>
        <div style={{
          position: 'absolute',
          top: 400,
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          {[ '+', '-', '*', '/' ].map(operator => {
            const isActive = openStream.includes(operator);
            return (
              <button
                key={operator}
                disabled={isActive || !numbers.isOperatorIndex(this.props.numbers)}
                onClick={this.makeOnTokenClick(operator)}
              >
                {operator}
              </button>
            );
          })}
        </div>
        <TransitionMotion
          styles={unusedLeaves.map((leaf, i) => ({
            key: String(leaf.index),
            style: { x: spring(i * 30), scale: spring(1) },
            data: leaf,
          }))}
          defaultStyles={unusedLeaves.map((leaf, i) => ({
            key: String(leaf.index),
            style: { x: i * 30, scale: 0 },
            data: leaf,
          }))}
          willEnter={this.willEnter}
          willLeave={this.willLeave}
        >
          {configs => (
            <ul style={{ position: 'absolute', top: 450, left: 0 }}>
              {configs.map(config => {
                return (
                  <li key={config.key} style={{
                    position: 'absolute',
                    transform: `
                      translate3d(${config.style.x}px, 0, 0)
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
