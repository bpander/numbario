import React, { Component } from 'react';
import { TransitionMotion, spring, stripStyle } from 'react-motion';
import { connect } from 'react-redux';

import Modal from 'components/Modal';
import * as numbers from 'ducks/numbers';
import * as root from 'ducks/root';
import * as user from 'ducks/user';
import * as rpn from 'lib/rpn';
import { OPERATOR_INDEX } from 'lib/streams';

// TODO: Organize this better
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
context.font = '28px "Source Sans Pro"';
const getScale = value => {
  const tileWidth = 48;
  const textWidth = context.measureText(value).width;
  const desiredWidth = tileWidth - 4;
  const scale = desiredWidth / textWidth;
  return Math.min(1, scale);
};

const operatorMap = {
  '+': '#add',
  '-': '#subtract',
  '*': '#multiply',
  '/': '#divide',
};

@connect(state => state)
export default class GameContainer extends Component {

  willEnter(entering) {
    return { ...stripStyle(entering.style), scale: 0 };
  }

  willLeave(leaving) {
    return { ...leaving.style, scale: spring(0) };
  }

  componentWillMount() {
    if (!this.props.numbers[this.props.user.difficulty].inventory.length) {
      this.props.dispatch(root.newGame(this.props.user.difficulty));
    }
  }

  onCancelClick = () => this.props.dispatch(user.update({ isGivingUp: false }));

  onGiveUpClick = () => this.props.dispatch(user.update({ didGiveUp: true, isGivingUp: false }));

  onOperatorClick = e => {
    const operator = e.currentTarget.getAttribute('data-operator');
    this.props.dispatch(numbers.streamPush(this.props.user.difficulty)(operator));
  };

  onNumberClick = e => {
    const number = Number(e.currentTarget.getAttribute('data-number'));
    this.props.dispatch(numbers.streamPush(this.props.user.difficulty)(number));
  };

  getStatusItems() {
    const wasSuccessful = numbers.wasSuccessful(this.props.user.difficulty)(this.props.numbers);
    const items = [];
    if (wasSuccessful) {
      items.push({
        type: 'success',
        element: (
          <svg
            className="svg svg--huge typ--success success animated"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            style={{
              filter: 'drop-shadow(1px 2px #1D9231)',
            }}
          >
            <circle className="success__path success__path--circle" cx="12" cy="12" r="9.5"/>
            <polyline
              className="success__path success__path--check"
              points="5.7,11.9 10,16.1 18.3,7.9"
            />
          </svg>
        ),
      });
    }
    return items;
  }

  renderAnswer() {
    if (!this.props.user.didGiveUp) {
      return;
    }
    return (
      <ol className="vList vList--4x">
        {this.props.numbers[this.props.user.difficulty].answer.map((step, i) => (
          <li key={i}>
            <div className="hList hList--2x hList--centered">
              <div>
                <div className="tile">{step[rpn.AUGEND_INDEX]}</div>
              </div>
              <div>
                <div className="tile">
                  <svg className="svg svg--smaller">
                    <use xlinkHref={operatorMap[step[rpn.OPERATOR_INDEX]]} />
                  </svg>
                </div>
              </div>
              <div>
                <div className="tile">{step[rpn.ADDEND_INDEX]}</div>
              </div>
              <div>
                <div className="tile tile--empty">
                  {rpn.solve(...step)}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  render() {
    const { difficulty } = this.props.user;
    const wasSuccessful = numbers.wasSuccessful(difficulty)(this.props.numbers);
    const shouldFoo = wasSuccessful || this.props.user.didGiveUp;
    const leaves = (shouldFoo) ? [] : numbers.getLeaves(difficulty)(this.props.numbers);
    const openStream =  (shouldFoo) ? [] : numbers.getOpenStream(difficulty)(this.props.numbers);
    const operators = (shouldFoo) ? [] : [ '+', '-', '*', '/' ];
    const unusedLeaves = leaves.filter(l => !l.isUsed && !openStream.includes(l.index));
    const { viewportWidth } = this.props.layout;
    const stagingX = (viewportWidth - (openStream.length * 48 + (openStream.length - 1) * 6)) / 2;
    const statusItems = this.getStatusItems();
    const isOperatorIndex = numbers.isOperatorIndex(difficulty)(this.props.numbers);

    return (
      <div style={{ textAlign: 'center', position: 'absolute', top: 0, left: 0, width: '100%' }}>
        <TransitionMotion
          styles={statusItems.map(item => ({
            key: item.type,
            data: item.element,
            style: { scale: spring(1) },
          }))}
          willEnter={this.willEnter}
          willLeave={this.willLeave}
        >
          {configs => (
            <div>
              {configs.map(config => (
                <div key={config.key} style={{
                  position: 'absolute',
                  top: '50vh',
                  left: '50%',
                  transform: `translate(-50%, -50%) scale(${0.8 + config.style.scale * 0.2}`,
                  opacity: config.style.scale,
                }}>
                  {config.data}
                </div>
              ))}
            </div>
          )}
        </TransitionMotion>
        {this.renderAnswer()}
        <TransitionMotion
          styles={openStream.map((token, i) => ({
            key: String(token),
            data: {
              label: (i === OPERATOR_INDEX) ? token : leaves[token].value,
              textScale: (i === OPERATOR_INDEX) ? 1 : getScale(leaves[token].value),
            },
            style: { scale: spring(1), x: spring(stagingX + i * 54) },
          }))}
          defaultStyles={openStream.map((token, i) => ({
            key: String(token),
            data: {
              label: (i === OPERATOR_INDEX) ? token : leaves[token].value,
              textScale: (i === OPERATOR_INDEX) ? 1 : getScale(leaves[token].value),
            },
            style: { scale: 0, x: stagingX + i * 54 },
          }))}
          willEnter={this.willEnter}
          willLeave={this.willLeave}
        >
          {configs => (
            <ul style={{ position: 'absolute', top: 300 }}>
              {configs.map((config, i) => (
                <li key={config.key} style={{
                  position: 'absolute',
                  transform: `
                    translate3d(${config.style.x}px, 0, 0)
                    scale(${config.style.scale})
                  `,
                  opacity: config.style.scale,
                }}>
                  <div className="tile">
                    {(i === OPERATOR_INDEX) ? (
                      <svg className="svg svg--smaller">
                        <use xlinkHref={operatorMap[config.data.label]} />
                      </svg>
                    ) : (
                      <span style={{ transform: `scale(${config.data.textScale})` }}>
                        {config.data.label}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TransitionMotion>
        <TransitionMotion
          styles={operators.map(operator => ({
            key: operator,
            data: { operator },
            style: { scale: spring(1) },
          }))}
          willEnter={this.willEnter}
          willLeave={this.willLeave}
        >
          {configs => (
            <ul className="hList hList--3x" style={{
              position: 'absolute',
              top: 390,
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
            }}>
              {configs.map(config => {
                const { operator } = config.data;
                const isActive = openStream.includes(operator);
                return (
                  <li key={operator} style={{
                    transform: `scale(${config.style.scale})`,
                    opacity: config.style.scale,
                  }}>
                    <div className="tile tile--stack" />
                    <button
                      className="tile"
                      disabled={isActive || !isOperatorIndex}
                      data-operator={operator}
                      onClick={this.onOperatorClick}
                    >
                      <svg className="svg svg--smaller">
                        <use xlinkHref={operatorMap[operator]} />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </TransitionMotion>
        <TransitionMotion
          styles={unusedLeaves.map((leaf, i) => ({
            key: String(leaf.index),
            style: { x: spring(i * 54), scale: spring(1) },
            data: { leaf, textScale: getScale(leaf.value) },
          }))}
          defaultStyles={unusedLeaves.map((leaf, i) => ({
            key: String(leaf.index),
            style: { x: i * 54, scale: 0 },
            data: { leaf, textScale: getScale(leaf.value) },
          }))}
          willEnter={this.willEnter}
          willLeave={this.willLeave}
        >
          {configs => (
            <ul style={{
              position: 'absolute',
              top: 450,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 318,
            }}>
              {configs.map(config => {
                return (
                  <li key={config.key} style={{
                    position: 'absolute',
                    transform: `
                      translate3d(${config.style.x}px, 0, 0)
                      scale(${config.style.scale})
                    `,
                    opacity: config.style.scale,
                  }}>
                    <button
                      className="tile"
                      disabled={isOperatorIndex}
                      data-number={config.data.leaf.index}
                      onClick={this.onNumberClick}
                    >
                      <span
                        style={{
                          transform: `scale(${config.data.textScale})`,
                        }}
                      >{config.data.leaf.value}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </TransitionMotion>
        <Modal isOpen={this.props.user.isGivingUp}>
          <div className="modal__body typ typ--copy">
            Are you sure you want to see the answer?
            This will reset your streak {' '}
            <svg className="svg svg--smaller typ--secondary">
              <use xlinkHref="#link" />
            </svg>{' '}
            back to 0.
          </div>
          <div className="modal__footer">
            <ul className="hList hList--2x">
              <li>
                <button className="button button--invert" onClick={this.onCancelClick}>
                  Cancel
                </button>
              </li>
              <li>
                <button className="button" onClick={this.onGiveUpClick}>
                  See answer
                </button>
              </li>
            </ul>
          </div>
        </Modal>
      </div>
    );
  }
}
