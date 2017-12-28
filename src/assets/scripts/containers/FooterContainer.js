import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as numbers from 'ducks/numbers';
import * as root from 'ducks/root';

@connect(state => state)
export default class FooterContainer extends Component {

  onUndo = () => {
    this.props.dispatch(numbers.streamPop(this.props.user.difficulty));
  };

  onRefresh = () => {
    this.props.dispatch(numbers.streamClear(this.props.user.difficulty));
  };

  onGiveUp = () => {
    if (this.props.user.didGiveUp) {
      this.props.dispatch(root.newGame());
      return;
    }

    const wasSuccessful = numbers.wasSuccessful(this.props.user.difficulty)(this.props.numbers);
    if (wasSuccessful) {
      this.props.dispatch(root.newRound());
    } else {
      this.props.dispatch(root.giveUp());
    }
  };

  render() {
    const wasSuccessful = numbers.wasSuccessful(this.props.user.difficulty)(this.props.numbers);
    const isInterstitial = wasSuccessful || this.props.user.didGiveUp;
    return (
      <ul className="hList hList--3x">
        <li>
          <button className="bubble" onClick={this.onUndo} disabled={isInterstitial}>
            <svg className="svg svg--bigger svg--lightest">
              <use xlinkHref="#undo" />
            </svg>
          </button>
        </li>
        <li>
          <button className="bubble" onClick={this.onRefresh} disabled={isInterstitial}>
            <svg className="svg svg--bigger svg--lightest">
              <use xlinkHref="#refresh" />
            </svg>
          </button>
        </li>
        <li>
          <button className="bubble" onClick={this.onGiveUp}>
            <svg className="svg svg--bigger svg--lightest">
              <use xlinkHref="#skip" />
            </svg>
          </button>
        </li>
      </ul>
    );
  }
}
