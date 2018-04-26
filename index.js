import fit from 'canvas-fit';
import loop from 'raf-loop';
import dat from 'dat.gui/build/dat.gui.js';
import Stats from 'stats.js';
import domready from 'domready';

// for the future -> server side rendering?
import isServer from './lib/isServer';
import Renderer from './lib/Renderer';

const controllerOptions = {
  message: 'test',
  slider: 2,
};

domready(() => {
  const stats = new Stats();
  const controls = new dat.GUI();
  Object.keys(controllerOptions).forEach(key => controls.add(controllerOptions, key));

  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  const canvas = document.querySelector('#canvas');
  window.addEventListener('resize', fit(canvas, window), false);
  const looper = loop();
  const renderer = new Renderer(canvas);

  looper.on('tick', (delta) => {
    stats.begin();
    renderer.render(delta);
    stats.end();
  });

  looper.start();
});

// parcel specific code to disable HMR because it is pretty weird with things
// being added to the dom, and seriously slowing down canvas renderers
if (module.hot) {
  module.hot.accept(() => {
    window.location.reload();
  });
}
