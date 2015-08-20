import React, { Component } from 'react';
import { Spring } from 'react-motion';
import random from 'lodash/number/random';
import range from 'lodash/utility/range';

const SPEED = 100;

class Circle extends Component {
  render() {
    const style = (x, y) => ({
      //background: `radial-gradient(rgb(0, 0, ${~~(255 * this.props.indice / this.props.maxIndice)}) 0%, transparent 100%) 0 0`,
      background: `radial-gradient(rgb(120, 120, 220) 0%, black 100%) 0 0`,
      width: this.props.radius,
      height: this.props.radius,
      borderRadius: this.props.radius,
      position: 'absolute',
      transform: `translate(${x}px, ${y}px)`,
      willChange: 'transform',      
      boxShadow: `${-((x - this.props.ellipse.x)/this.props.ellipse.majorWidth)*10}px ${-((y - this.props.ellipse.y)/this.props.ellipse.minorWidth)*10}px 20px 0px rgba(0,0,0,.5) inset`,
      zIndex: (y > this.props.ellipse.y ? 1: 0)
    });

    const start = {
      size: {
        x: { val: this.props.x },
        y: { val: this.props.y },
        angle: { val: random(0, Math.PI * 2, true) }
      }
    };

    const end = (prevValue) => {
      let x = prevValue.size.x.val;
      let angle = prevValue.size.angle.val;
      angle = angle + Math.PI / 32;
      x += (prevValue.direction === 'left' ? -SPEED : SPEED);

      return {
        size: {
          x: { val: this.props.ellipse.x + Math.cos(angle) * this.props.ellipse.majorWidth },
          y: { val: this.props.ellipse.y + Math.sin(angle) * this.props.ellipse.minorWidth },
          angle: { val: angle }
        }
      };
    };

    return (<Spring defaultValue={start} endValue={end}>
        { interpolated => <div style={ style(interpolated.size.x.val, interpolated.size.y.val) }></div>}
      </Spring>
    );
  }
}

class Ellipse extends Component {
  render() {
    return (
      <ul>
        {range(0, this.props.count).map((i) => 
          <Circle key={i}
            indice={i}
            maxIndice={this.props.count}
            radius={this.props.radius}
            ellipse={this.props}
            x={random(0, window.document.body.clientWidth)}
            y={random(0, window.document.body.clientHeight)}
          />)}
      </ul>
    );
  }
}

class Planet extends Component {
  render() {
    const style = (angle) => ({
      width: this.props.radius,
      height: this.props.radius,
      borderRadius: this.props.radius,
      position: 'absolute',
      transform: `translate(${this.props.x - this.props.radius / 2}px, ${this.props.y - this.props.radius / 2}px)`,
      willChange: 'transform',
      transformOrigin: '50% 50%',
      background: 'url(http://www.solarsystemscope.com/nexus/content/planet_textures/texture_sun.jpg)',
      backgroundSize: 'cover',
      boxShadow: '0 0 50px rgba(0,0,0,.5) inset'
    });

    const start = {
      size: {
        angle: { val: random(0, Math.PI * 2, true) }
      }
    };

    const end = (prevValue) => {
      let angle = prevValue.size.angle.val;
      angle = angle + Math.PI / 4;
      if (angle > Math.PI * 2) {
        angle = 0;
      }

      return {
        size: {
          angle: { val: angle }
        }
      };
    };

    return (
      <Spring defaultValue={start} endValue={end}>
        { interpolated => <div style={ style(interpolated.size.angle.val) }></div>}
      </Spring>
    );
  }
}

export default class App extends Component {
  constructor() {
    super();
    this.state = { x: 800, y: 300 };
  }

  movePlanet(e) {
    const { clientX: x , clientY: y } = e;
    this.setState({ x, y });
  }

  render() {
    return (
      <Spring endValue={{x: { val: this.state.x }, y: { val: this.state.y } }}>
        { interpolated => 
          <div onMouseMove={::this.movePlanet} style={{background: 'url(http://dreamatico.com/data_images/space/space-4.jpg)', height: '100%' }}>      
            <Ellipse key={1} radius={50} count={10} x={interpolated.x.val} y={interpolated.y.val} majorWidth={400} minorWidth={100} />
            <Ellipse key={2} radius={20} count={30} x={interpolated.x.val} y={interpolated.y.val} majorWidth={800} minorWidth={60} />
            <Planet x={interpolated.x.val} y={interpolated.y.val} radius={300} />
          </div>
        }
      </Spring>
    );
  }
}
