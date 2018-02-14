import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Difficulty } from 'config';
import Gauge from 'components/Gauge';
import * as root from 'ducks/root';
import * as numbers from 'ducks/numbers';
import cssConfig from '_config.css.json';
import Modal from 'components/Modal';

@connect(state => state)
export default class UIContainer extends Component {

  static getGaugePosition(difficulty) {
    switch (difficulty) {
      case Difficulty.NORMAL: return 2;
      case Difficulty.HARD: return 3;
      default: return 1;
    }
  }

  state = {
    isInfoModalOpen: false,
  };

  toggleInfoModal = () => {
    this.setState({ isInfoModalOpen: !this.state.isInfoModalOpen });
  };

  onGaugeClick = () => {
    let difficulty;
    switch (this.props.user.difficulty) {
      case Difficulty.EASY:   difficulty = Difficulty.NORMAL; break;
      case Difficulty.NORMAL: difficulty = Difficulty.HARD; break;
      case Difficulty.HARD:   difficulty = Difficulty.EASY; break;
    }
    this.props.dispatch(root.setDifficulty(difficulty));
  };

  render() {
    const wasSuccessful = numbers.wasSuccessful(this.props.user.difficulty)(this.props.numbers);
    const isCollapsed = wasSuccessful || this.props.user.didGiveUp;
    const { viewportHeight } = this.props.layout;
    const minHeight = parseInt(cssConfig['min-height'], 10);
    const adHeight = parseInt(cssConfig['ad-height'], 10);
    return (
      <div>
        <Modal isOpen={this.state.isInfoModalOpen}>
          <div className="modal__body typ--copy">
            <p>
              numbario is a game about combining numbers to make another number.
              You don’t have to use every number, but you can only use each number once.
              You can keep adding, subtracting, multiplying, and dividing numbers until you run out.
              When you make the target number, you win!
              If you get stuck, you can skip it and go on to the next one.
            </p>
            <p>
              If you want more of a challenge, you can change the difficulty with the difficulty
              meter in the upper right. There’s no time limit or ultimate goal. Just relax, have
              fun, and enjoy solving one puzzle after another.
            </p>
            <p>This is a "progressive web app" so you can play even if you’re offline.</p>
          </div>
          <div className="modal__footer typ--center">
            <button autoFocus className="button" onClick={this.toggleInfoModal}>Play</button>
          </div>
        </Modal>
        <div className="masthead">
          <div className="masthead__branding">
            <span className="typ typ--neutral-16 typ--shadow-thin typ--1.5x">numbario</span>
          </div>
          <div className="masthead__info">
            <button className="button-no-style" onClick={this.toggleInfoModal}>
              <svg className="svg typ--secondary" width="32" height="32">
                <use xlinkHref="#info" />
              </svg>
            </button>
          </div>
        </div>
        <div className={`main ${(isCollapsed) ? 'main--collapsed' : ''}`}>
          <div className="main__inner">
            <div className="main__content">
              <div
                className="typ typ--neutral-16 typ--shadow-thin"
                style={{
                  lineHeight: 0.9,
                  fontSize: (Math.max(minHeight, viewportHeight) - adHeight) * 0.25,
                }}
              >
                {this.props.numbers[this.props.user.difficulty].target}
              </div>
              <div className="typ typ--1.5x typ--secondary">make this</div>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', zIndex: 10, top: 0, right: 8 }}>
          <Gauge
            onClick={this.onGaugeClick}
            position={UIContainer.getGaugePosition(this.props.user.difficulty)}
          />
        </div>
        <div className="typ typ--right typ--secondary typ--1.5x" style={{
          position: 'absolute',
          top: 94,
          right: 12,
        }}>
          <ul className="vList vList--2x">
            <li>
              <dl className="hList hList--centered hList--2x">
                <dd>{this.props.user.streak[this.props.user.difficulty].toLocaleString()}</dd>
                <dt>
                  <svg style={{ display: 'block', fill: 'currentColor' }} width="32" height="32">
                    <use xlinkHref="#link" />
                  </svg>
                  <span className="visually-hidden">Streak</span>
                </dt>
              </dl>
            </li>
            <li>
              <dl className="hList hList--centered hList--2x">
                <dd>{this.props.user.bests[this.props.user.difficulty].toLocaleString()}</dd>
                <dt>
                  <svg style={{ display: 'block', fill: 'currentColor' }} width="32" height="32">
                    <use xlinkHref="#trophy" />
                  </svg>
                  <span className="visually-hidden">Best</span>
                </dt>
              </dl>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
