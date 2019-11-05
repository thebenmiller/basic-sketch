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
      message: "Hello World!",
      color: "#f00",
      slider: 2,
      sliderWithOptions: {
        default: 2,
        options: g => g.min(0).max(10)
      },
      folder: [
        "folder name",
        {
          message2: "test",
          color2: "#ff0000",
          sliderWithOptions2: {
            default: 2,
            options: g => g.min(0).max(10)
          }
        }
      ]
    };
    this.canvas = document.querySelector("#canvas");
    this.stats = new Stats();
    this.controller = new dat.GUI({ autoPlace: false });
    this.updateController = this.updateController.bind(this);

    this.controllerData = controllerSetup(
      this.controller,
      controls,
      this.updateController
    );

    this.stats.showPanel(0);
    this.canvas.insertAdjacentElement("afterend", this.stats.dom);
    this.canvas.insertAdjacentElement("afterend", this.controller.domElement);
    this.stats.dom.style.display = "none";
    this.controller.domElement.style.display = "none";
    this.stats.dom.classList.add("stats");
    this.controller.domElement.classList.add("controls");

    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize, false);
    fit(canvas, window);

    this.renderer = new Renderer(canvas, window);
    this.looper = loop();
    this.looper.on("tick", delta => {
      this.loop(delta);
    });

    this.elements = new Elements();
    document.body.append(this.elements.render(dom()));

    this.audio = new Audio();
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
    fit(this.canvas, window);
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
