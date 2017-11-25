import React from 'react';
import { spring, TransitionMotion, presets } from 'react-motion';

const willEnter = () => ({ progress: 0 });
const willLeave = () => ({ progress: spring(0, presets.wobbly) });

const Modal = props => {
  const styles = (!props.isOpen)
    ? []
    : [ { key: 'modal', style: { progress: spring(1, presets.wobbly) } } ];
  return (
    <TransitionMotion
      styles={styles}
      willEnter={willEnter}
      willLeave={willLeave}
    >
      {configs => {
        const [ config ] = configs;
        if (!config) {
          return null;
        }
        const { progress } = config.style;
        return (
          <div
            key={config.key}
            className="modal"
            style={{ opacity: progress }}
          >
            <div className="modal__dialog" style={{ transform: `translateZ(0) scale(${0.9 + progress * 0.1})` }}>
              {props.children}
            </div>
          </div>
        );
      }}
    </TransitionMotion>
  );
};
export default Modal;
