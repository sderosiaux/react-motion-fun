import React, { Component } from 'react';
import { Motion, spring, StaggeredMotion } from 'react-motion';
import random from 'lodash/random';
import range from 'lodash/range';

const SPEED = 100;

class Circle extends Component {
  render() {
    const getstyle = (x, y) => ({
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
      x: this.props.x,
      y: this.props.y,
      angle: random(0, Math.PI * 2, true)
    };

    let x = this.props.x;
    let angle = this.props.angle;
    angle = angle + Math.PI / 32;
    x += (this.props.direction === 'left' ? -SPEED : SPEED);

    const end = {
      x: spring(this.props.ellipse.x + Math.cos(angle) * this.props.ellipse.majorWidth),
      y: spring(this.props.ellipse.y + Math.sin(angle) * this.props.ellipse.minorWidth),
      angle: spring(angle)
    };

    return (<Motion defaultStyle={start} style={start}>
        { interpolated => <div style={ getstyle(interpolated.x, interpolated.y) }></div>}
      </Motion>
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
    const getstyle = (angle) => ({
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
      angle: random(0, Math.PI * 2, true)
    };

    const end = (prevValue) => {
      let angle = prevValue.angle;
      angle = angle + Math.PI / 4;
      if (angle > Math.PI * 2) {
        angle = 0;
      }

      return {
        angle: spring(angle)
      };
    };

    return (
      <Motion defaultStyle={start} style={end}>
        { interpolated => <div style={ getstyle(interpolated.angle) }></div>}
      </Motion>
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
      <Motion style={{x: spring(this.state.x), y: spring(this.state.y) }}>
        { interpolated => 
          <div onMouseMove={(e) => this.movePlanet(e)} style={{background: 'url(http://dreamatico.com/data_images/space/space-4.jpg)', height: '100%' }}>      
            <Ellipse key={1} radius={50} count={10} x={interpolated.x} y={interpolated.y} majorWidth={400} minorWidth={100} />
            <Ellipse key={2} radius={20} count={30} x={interpolated.x} y={interpolated.y} majorWidth={800} minorWidth={60} />
            <Planet x={interpolated.x} y={interpolated.y} radius={300} />
          </div>
        }
      </Motion>
    );
  }
}
