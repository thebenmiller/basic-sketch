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
            default: 8,
            options: c => c.min(2).max(16)
          },
          pulses: {
            default: 4,
            options: c => c.min(0).max(16)
          },
          rotate: {
            default: 0,
            options: c => c.min(0).max(16)
          },
          bpm: {
            default: 90,
            options: c => c.min(10).max(240)
          }
        }
      ],
      noiseSettings: [
        "Noise Settings",
        {
          radius: {
            default: 50,
            options: c => c.min(12).max(400)
          },
          morph: false
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

    console.log(this.controllerData);

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

    this.renderer.setupData({
      steps: this.controllerData.steps,
      pulses: this.controllerData.pulses,
      radius: this.controllerData.radius,
      morph: this.controllerData.morph
    });

    this.elements = new Elements();
    document.querySelector("#content").append(this.elements.render(dom()));

    this.audio = new Audio();
    this.audio.setupData(this.controllerData);
  }
  updateController(key, value) {
    ee.emit("config", key, value);
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
