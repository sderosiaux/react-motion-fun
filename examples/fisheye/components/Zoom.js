import React, { Component } from 'react';

export default class Zoom extends Component {
  constructor() {
    super();
  }
  render() {
    const style = {
      WebkitFilter: 'blur(0)',
      width: `${this.props.radius}px`,
      height: `${this.props.radius}px`,
      border: '5px solid black',
      borderRadius: '50%',
      position: 'absolute',
      transform: `translate(${this.props.x-this.props.radius/2}px, ${this.props.y-this.props.radius/2}px)`,
      willChange: 'transform', 
      boxShadow: '10px 10px 10px rgba(0,0,0,.2), 10px 10px 10px rgba(0,0,0,.2) inset'
    };

    return <div style={style}></div>
  }
}
