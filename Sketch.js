import fit from "canvas-fit";
import loop from "raf-loop";
import dat from "dat.gui/build/dat.gui.js";
import Stats from "stats.js";
import domready from "domready";
import Color from "color";
import { node, dom } from "jsx-pragmatic";

import controllerSetup from "./helpers/controllerSetup";
import ee from "./helpers/Events";

import Renderer from "./Renderer";
import Elements from "./Elements";
import Audio from "./Audio";

import euclid from "./helpers/euclid";

const document = window.document;

export default class Sketch {
  constructor() {
    const controls = {
      audioSettings: [
        "Audio Settings",
        {
          frequency: {
            default: 120,
            options: c => c.min(5).max(1000)
          },
          steps: {
            default: 11,
            options: c => c.min(2).max(16).step(1)
          },
          pulses: {
            default: 5,
            options: c => c.min(0).max(16).step(1)
          },
          rotate: {
            default: 0,
            options: c => c.min(0).max(16).step(1)
          },
          bpm: {
            default: 180,
            options: c => c.min(10).max(400).step(1)
          }
        }
      ],
      noiseSettings: [
        "Noise Settings",
        {
          radius: {
            default: 120,
            options: c => c.min(12).max(400)
          },
          morph: false,
          scale: {
            default: 500,
            options: c=> c.min(10).max(1000).step(1)
          }
        }
      ]
    };
    this.canvas = document.querySelector("#canvas");
    this.canvasContainer = document.querySelector("#canvas-container");
    this.stats = new Stats();
    this.controller = new dat.GUI({ autoPlace: false });
    this.updateController = this.updateController.bind(this);

    this.controllerData = controllerSetup(
      this.controller,
      controls,
      this.updateController
    );

    const initialData = {...this.controllerData, pattern:euclid(this.controllerData.steps, this.controllerData.pulses, this.controllerData.rotate)};

    this.stats.showPanel(0);
    document.body.append(this.stats.dom);
    document.body.append(this.controller.domElement);
    this.stats.dom.style.display = "none";
    this.controller.domElement.style.display = "none";
    this.stats.dom.classList.add("stats");
    this.controller.domElement.classList.add("controls");

    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize, false);
    fit(canvas, this.canvasContainer);

    this.renderer = new Renderer(canvas);
    this.looper = loop();
    this.looper.on("tick", delta => {
      this.loop(delta);
    });

    this.renderer.setupData(initialData);

    this.elements = new Elements();
    document.querySelector("#content").append(this.elements.render(dom()));

    this.audio = new Audio();
    this.audio.setupData(initialData);
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
    this.controller.domElement.style.display = "block";
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
    this.controller.domElement.style.display = "none";
    this.looper.stop();
  }
  destroy() {
    this.stats = null;
    this.controller = null;
    if (this.looper.running) {
      this.stop();
    }
    this.looper = null;
    this.renderer.destroy();
    this.renderer = null;
    window.removeEventListener("resize", this.resize, false);
  }
}
