import React from 'react';

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

export default class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textScale: getScale(props.label),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.label !== this.props.label) {
      this.setState({ textScale: getScale(nextProps.label) });
    }
  }

  render() {
    const { label, tag, ...rest } = this.props;
    const Tag = tag || 'div';
    const isOperator = operatorMap[label] != null;
    return (
      <Tag
        className="tile"
        {...rest}
      >
        {(isOperator) ? (
          <svg className="svg svg--smaller">
            <use xlinkHref={operatorMap[label]} />
          </svg>
        ) : (
          <span style={{ transform: `scale(${this.state.textScale})` }}>
            {label}
          </span>
        )}
      </Tag>
    );
  }
}
