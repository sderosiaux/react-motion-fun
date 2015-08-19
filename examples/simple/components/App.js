import React, { Component } from 'react';
import { Spring } from 'react-motion';
import { range, random } from 'lodash';

class Circle extends Component {
  render() {
    const style = (x, y) => ({
      background: 'radial-gradient(orange 0%, hsla(0, 100%, 20%, 0) 100%) 0 0',
      width: this.props.radius,
      height: this.props.radius,
      borderRadius: this.props.radius,
      position: 'absolute',
      left: x,
      top: y
    });

    const start = {
      size: {
        x: { val: this.props.x },
        y: { val: this.props.y }
      }
    };

    const end = (prevValue) => ({
      size: {
        x: { val: (this.props.x + random(-100,100)) },
        y: { val: (this.props.y + random(-100,100)) }
      }
    });

    return (<Spring defaultValue={start} endValue={end}>
        { interpolated => <div onClick={this.props.onCatchMe} style={ style(interpolated.size.x.val, interpolated.size.y.val) }></div>}
      </Spring>
    );
  }
}

export default class App extends Component {
  constructor() {
    super();
    this.state = { score: 0 };
    setInterval(() => { this.forceUpdate(); }, 2000);
  }

  handleMouseMove(e) {
    const x = e.clientX;
    const y = e.clientY;
    this.setState({ x, y });
  }
  handleCatchCircle(e) {
    this.setState({ score: this.state.score + 1 });
  }
  render() {
    return (
      <div>
        <p>Click on a ball to catch it!</p>
        <p>You catched {this.state.score} balls!</p>
        <ul onMouseMove={::this.handleMouseMove}>
          {range(0, 20).map((i) => <Circle key={i} onCatchMe={::this.handleCatchCircle} radius={random(50, 150)} x={random(10, window.document.body.clientWidth)} y={random(10, window.document.body.clientHeight)} />)}
        </ul>
      </div>      
    );
  }
}
