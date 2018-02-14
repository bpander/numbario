import React, { Component } from 'react';
import { TransitionMotion, spring, stripStyle } from 'react-motion';
import { connect } from 'react-redux';

import Modal from 'components/Modal';
import Tile from 'components/Tile';
import * as numbers from 'ducks/numbers';
import * as root from 'ducks/root';
import * as user from 'ducks/user';
import { OPERATOR_INDEX } from 'lib/streams';

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

  onGiveUpClick = () => this.props.dispatch(user.confirmGiveUp());

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

  render() {
    const { difficulty } = this.props.user;
    const wasSuccessful = numbers.wasSuccessful(difficulty)(this.props.numbers);
    // TODO: Rename shouldFoo. shouldFoo = should show success/error
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
      <div style={{
        textAlign: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
      }}>
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
                  bottom: '50vh',
                  left: '50%',
                  transform: `translate(-50%, 50%) scale(${0.7 + config.style.scale * 0.3}`,
                  opacity: config.style.scale,
                }}>
                  {config.data}
                </div>
              ))}
            </div>
          )}
        </TransitionMotion>
        <TransitionMotion
          styles={openStream.map((token, i) => ({
            key: String(token),
            data: {
              label: (i === OPERATOR_INDEX) ? token : leaves[token].value,
            },
            style: { scale: spring(1), x: spring(stagingX + i * 54) },
          }))}
          defaultStyles={openStream.map((token, i) => ({
            key: String(token),
            data: {
              label: (i === OPERATOR_INDEX) ? token : leaves[token].value,
            },
            style: { scale: 0, x: stagingX + i * 54 },
          }))}
          willEnter={this.willEnter}
          willLeave={this.willLeave}
        >
          {configs => (
            <ul style={{ position: 'absolute', bottom: 305 }}>
              {configs.map(config => (
                <li key={config.key} style={{
                  position: 'absolute',
                  transform: `
                    translate3d(${config.style.x}px, 0, 0)
                    scale(${config.style.scale})
                  `,
                  opacity: config.style.scale,
                }}>
                  <Tile label={config.data.label} />
                </li>
              ))}
            </ul>
          )}
        </TransitionMotion>
        <div style={{
          position: 'absolute',
          bottom: 215,
          width: '100%',
          opacity: (shouldFoo) ? 0 : 1,
          transform: `translateY(${(shouldFoo) ? 10 : 0}px)`,
          transition: 'opacity 500ms, transform 500ms',
        }}>
          <div className="typ typ--1.5x typ--secondary">with this</div>
        </div>
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
              bottom: 160,
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
                    <Tile
                      tag="button"
                      label={operator}
                      disabled={isActive || !isOperatorIndex}
                      data-operator={operator}
                      onClick={this.onOperatorClick}
                    />
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
            data: { leaf },
          }))}
          defaultStyles={unusedLeaves.map((leaf, i) => ({
            key: String(leaf.index),
            style: { x: i * 54, scale: 0 },
            data: { leaf },
          }))}
          willEnter={this.willEnter}
          willLeave={this.willLeave}
        >
          {configs => (
            <ul style={{
              position: 'absolute',
              bottom: 100,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 318,
            }}>
              {configs.map(config => {
                return (
                  <li key={config.key} style={{
                    position: 'absolute',
                    bottom: 0,
                    transform: `
                      translate3d(${config.style.x}px, 0, 0)
                      scale(${config.style.scale})
                    `,
                    opacity: config.style.scale,
                  }}>
                    <Tile
                      tag="button"
                      label={config.data.leaf.value}
                      disabled={isOperatorIndex}
                      data-number={config.data.leaf.index}
                      onClick={this.onNumberClick}
                    />
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
                <button autoFocus className="button button--invert" onClick={this.onCancelClick}>
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
