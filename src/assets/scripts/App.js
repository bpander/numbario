import React, { Component } from 'react';
import FooterContainer from 'containers/FooterContainer';
import GameContainer from 'containers/GameContainer';
import UIContainer from 'containers/UIContainer';
import * as layout from 'ducks/layout';

export default class App extends Component {

  static defaultProps = {
    dispatch: () => {},
  };

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
    return (
      <div>
        <UIContainer />
        <GameContainer />
        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          textAlign: 'center',
        }}>
          <FooterContainer />
        </div>
      </div>
    );
  }
};
