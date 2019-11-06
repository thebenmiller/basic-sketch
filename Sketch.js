import fit from "canvas-fit";
import loop from "raf-loop";
import Stats from "stats.js";
import domready from "domready";
import Color from "color";
import { node, dom } from "jsx-pragmatic";

import ee from "./helpers/Events";

import Renderer from "./Renderer";
import Elements from "./Elements";
import Audio from "./Audio";

import euclid from "./helpers/euclid";

const document = window.document;

export default class Sketch {
  constructor() {

    this.canvas = document.querySelector("#canvas");
    this.canvasContainer = document.querySelector("#canvas-container");
    this.stats = new Stats();


    this.stats.showPanel(0);
    document.body.append(this.stats.dom);
    this.stats.dom.style.display = "none";
    this.stats.dom.classList.add("stats");

    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize, false);
    fit(canvas, this.canvasContainer);

    this.renderer = new Renderer(canvas);
    this.looper = loop();
    this.looper.on("tick", delta => {
      this.loop(delta);
    });

    this.elements = new Elements();
    document.querySelector("#content").append(this.elements.render(dom()));

    this.audio = new Audio();
  }
  updateController(key, value) {
    ee.emit("config", key, value);
    if(key === "steps" || key === "pulses" || key === "rotate"){
      const pattern = euclid(this.controllerData.steps, this.controllerData.pulses, this.controllerData.rotate);
      ee.emit("config", "pattern", pattern);
    }
  }
  start() {
    this.stats.dom.style.display = "block";
    this.looper.start();
  }
  loop(delta) {
    this.stats.begin();
    this.renderer.render(delta);
    this.stats.end();
  }
  resize() {
    fit(this.canvas, this.canvasContainer);
  }
  stop() {
    this.stats.dom.style.display = "none";
    this.looper.stop();
  }
  destroy() {
    this.stats = null;
    if (this.looper.running) {
      this.stop();
    }
    this.looper = null;
    this.renderer.destroy();
    this.renderer = null;
    window.removeEventListener("resize", this.resize, false);
  }
}
