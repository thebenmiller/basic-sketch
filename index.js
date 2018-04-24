import fit from 'canvas-fit';
import loop from 'raf-loop';
import dat from 'dat.gui/build/dat.gui.js';
import Stats from 'stats.js';
import domready from 'domready';

// for the future -> server side rendering?
import isServer from './lib/isServer';
import Renderer from './lib/Renderer';

domready(() => {
  const canvas = document.querySelector('#canvas');
  window.addEventListener('resize', fit(canvas, window), false);
  const looper = loop();
  const renderer = new Renderer(canvas);

  fit(canvas);
  renderer.clear();

  looper.on('tick', delta => renderer.render(delta));
  looper.start();
});
