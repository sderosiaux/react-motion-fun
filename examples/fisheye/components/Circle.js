import React, { Component } from 'react';
import { NB_CIRCLES } from './constants';

export default class Circle extends Component {
  constructor() {
    super();
  }
  shouldComponentUpdate(newProps, newState, newContext) {
    return this.props.x != newProps.x || this.props.y != newProps.y || this.props.scale != newProps.scale;
  }
  render() {
    const delta = ~~(25 * this.props.indice / NB_CIRCLES);
    const style = {
      background: `radial-gradient(hsl(220, 66%, ${50 + delta}%), rgba(255,255,255,.5))`,
      border: this.props.indice === 0 ? '1px solid black': '',
      width: this.props.radius,
      height: this.props.radius,
      borderRadius: '50%',
      position: 'absolute',
      transform: `translate(${this.props.x-this.props.radius/2}px, ${this.props.y-this.props.radius/2}px) scale(${this.props.scale})`,
      willChange: 'transform',      
      boxAShadow: `5px 5px 20px 0px rgba(0,0,0,1) inset`,
      textAlign: 'center'
    };
    const spanStyle = {
      position: 'relative',
      color: 'white',
      textShadow: '2px 2px rgba(0,0,0,.5)',
      fontSize: this.props.radius / 2,
      top: this.props.radius / 5
    };

    return <div style={style}><span style={spanStyle}>{ this.props.indice }</span></div>;
  }
}
