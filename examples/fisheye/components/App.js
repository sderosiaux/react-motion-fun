import React, { Component } from 'react';
import { TransitionSpring } from 'react-motion';
import random from 'lodash/number/random';
import range from 'lodash/utility/range';
import zipWith from 'lodash/array/zipWith';
import Line from 'react-line';
import fisheye from 'fisheye';

import Zoom from './Zoom.js';
import Circle from './Circle.js';

import { NB_CIRCLES, RADIUS, MAX_CIRCLE_RADIUS } from './constants';

const f = fisheye(3, RADIUS / 2);


function createCircles(count) {
  const margin = MAX_CIRCLE_RADIUS / 2;

  return range(0, count).map(i => ({
        i: i,
        x: random(margin, window.document.body.clientWidth - margin),
        y: random(margin, window.document.body.clientHeight - margin),
        radius: random(20, MAX_CIRCLE_RADIUS),
        scale: 1
      })).map(c => {
        c.originX = c.x;
        c.originY = c.y;
        return c;
      })
}
function d(c1, c2) {
  return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2)); 
}

function findNearest(circles, origin) {
  return circles.reduce((min, circle) => {
    if (d(min, origin) > d(circle, origin)) {
      return circle;
    }
    return min;
  });
}

function orderCirclesByPosition(circles) {
  const len = circles.length;
  const sorted = [ circles[0] ];
  circles.splice(0, 1);
  circles[0].i = 0;
  for (var i = 1; i < len; i++) {
    const nearest = findNearest(circles, sorted[i - 1]);
    sorted.push(nearest);
    nearest.i = i;
    circles.splice(circles.indexOf(nearest), 1);
  }
  return sorted;
}

function createLines(circles) {
  let lines = [];
  for (let i = 1; i < circles.length; i++) {
    const circle = circles[i];
    const prevCircle = circles[i-1];
    lines.push({
        from: { x: prevCircle.x, y: prevCircle.y },
        to: { x: circle.x, y: circle.y }
    });
  }
  return lines;
}

export default class App extends Component {
  constructor() {
    super();

    let circles = createCircles(NB_CIRCLES);
    circles = orderCirclesByPosition(circles);
    const lines = createLines(circles);

    this.state = {
      eye: { x: NaN, y: NaN },
      circles,
      lines
    };
  }

  moveFocus(e) {
    const { clientX: x , clientY: y } = e;
    this.setState({ eye: { x, y } });
    // we need to map the originX/Y, not the x/y that represents the dynamic
    // position of the circles (dynamic due to the fisheye deformation)
    const getOnlyXY = (c => ({ x: c.originX, y: c.originY }));
    const mutations = this.state.circles.map(getOnlyXY).map(f({x, y}));
    const circles = zipWith(this.state.circles, mutations, (circle, mutation) => ({
        ...circle,
        x: mutation.x,
        y: mutation.y,
        scale: mutation.scale
    }));

    this.setState({ circles : circles });
    this.setState({ lines : createLines(circles) });
  }

  render() {

    const getCircleEndValue = (c) => ({
      x: { val: c.x, config: [180, 7] },
      y: { val: c.y, config: [180, 7] },
      scale: { val: c.scale, config: [200, 9] }
    });

    const getLineEndValue = (l) => ({
      from: {
        x: { val: l.from.x, config: [180, 7] },
        y: { val: l.from.y, config: [180, 7] }
      },
      to: {
        x: { val: l.to.x, config: [180, 7] },
        y: { val: l.to.y, config: [180, 7] }
      }
    });

    const unwrap = (π) => ({
      x: π.x.val,
      y: π.y.val
    });

    const willEnter = (key, endValue) => {
      console.log('willEnter', JSON.stringify(arguments));
      //return endValue[key];
      return 1;
    }
    const willLeave = (key, endValue, expectedEndValue, interpolatedValue, speed) => {
      console.log('willLeave', JSON.stringify(arguments));
    }

    return (
      <div style={{height: '100%' }} onMouseMove={::this.moveFocus}>
        {/*
        {this.state.lines.map((l, i) => 
          <Line key={i} style="2px dashed #ccc"
                from={l.from}
                to={l.to}
          />
        )}
        */}

       {this.state.lines.map((l, i) =>
          <TransitionSpring endValue={getLineEndValue(l)}> 
            { π => <Line key={i} style="2px dashed #ccc"
                         from={unwrap(π.from)}
                         to={unwrap(π.to)}
            /> }
          </TransitionSpring>
        )}

        {this.state.circles.map(c => 
          <TransitionSpring willEnter={willEnter} willLeave={willLeave} endValue={getCircleEndValue(c)}>
            { π => <Circle key={c.i} indice={c.i}
                radius={c.radius}
                x={π.x.val}
                y={π.y.val}
                scale={π.scale.val}
            /> }
          </TransitionSpring>
        )}
        <Zoom key="eye" radius={RADIUS} x={this.state.eye.x} y={this.state.eye.y} scale={1} />
      </div>

    );
  }
}
