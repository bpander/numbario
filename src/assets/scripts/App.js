import React, { Component } from 'react';
import { connect } from 'react-redux';
import AnswerContainer from 'containers/AnswerContainer';
import FooterContainer from 'containers/FooterContainer';
import GameContainer from 'containers/GameContainer';
import UIContainer from 'containers/UIContainer';
import * as layout from 'ducks/layout';
import cssConfig from '_config.css.json';

const AD_HEIGHT = parseInt(cssConfig['ad-height'], 10);
const MIN_HEIGHT = parseInt(cssConfig['min-height'], 10) - AD_HEIGHT;

export class App extends Component {

  onResize = () => {
    this.props.dispatch(layout.actions.setSize(
      window.innerWidth,
      window.innerHeight,
    ));
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  render() {
    const { viewportHeight } = this.props.layout;
    const height = Math.max(MIN_HEIGHT, viewportHeight - AD_HEIGHT);
    return (
      <div style={{ height }}>
        <AnswerContainer />
        <UIContainer />
        <GameContainer />
        <div style={{
          position: 'absolute',
          bottom: 16,
          width: '100%',
          textAlign: 'center',
        }}>
          <FooterContainer />
        </div>
      </div>
    );
  }
};

export default connect(state => state)(App);
