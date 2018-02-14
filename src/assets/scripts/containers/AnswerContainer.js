import React from 'react';
import { connect } from 'react-redux';
import * as rpn from 'lib/rpn';
import { TransitionMotion, spring } from 'react-motion';
import Tile from 'components/Tile';
import { last } from 'util/arrays';

const springPreset = { stiffness: 650, damping: 40 };

class AnswerContainer extends React.Component {

  willEnter = () => ({ scale: 0 });

  willLeave = () => ({ scale: spring(0) });

  getStyles = (prev = []) => {
    const { props } = this;
    const steps = (props.user.didGiveUp)
      ? props.numbers[props.user.difficulty].answer
      : [];
    const styles = steps.map((step, i) => ({
      key: String(i),
      data: step,
      style: {
        scale: spring(
          (prev[i - 1]) ? prev[i - 1].style.scale : 1,
          springPreset,
        ),
      },
    }));
    return styles;
  }

  render() {
    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <TransitionMotion
          willEnter={this.willEnter}
          willLeave={this.willLeave}
          styles={this.getStyles}
        >
          {interpolatedStyles => (
            <ol className="vList vList--4x">
              {interpolatedStyles.map(config => {
                const step = config.data;
                return (
                  <li key={config.key} style={{
                    opacity: config.style.scale,
                    transform: `scale(${config.style.scale * 0.3 + 0.7})`,
                  }}>
                    <div className="hList hList--2x hList--centered">
                      <div>
                        <Tile label={step[rpn.AUGEND_INDEX]} />
                      </div>
                      <div>
                        <Tile label={step[rpn.OPERATOR_INDEX]} />
                      </div>
                      <div>
                        <Tile label={step[rpn.ADDEND_INDEX]} />
                      </div>
                      <div>
                        <Tile
                          label={rpn.solve(...step)}
                          className="tile tile--empty"
                          style={{
                            textDecoration: (config === last(interpolatedStyles))
                              ? 'underline'
                              : '',
                          }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </TransitionMotion>
      </div>
    );
  }
}
export default connect(state => state)(AnswerContainer);
