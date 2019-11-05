import testimage from "../testimage.png";
import NoiseFilter from "./NoiseFilter";

import ee from "../helpers/Events";

export default class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.steps = 0;
    this.pulses = 0;
    this.rotate = 0;
    this.radius = 0;
    this.morph = false;
    this.euclid = [];

    this.noiseFilter = new NoiseFilter(this.w, this.h);
    this.time = 0;
    ee.on("config", (key, value) => this.setData(key, value));
  }
  get w() {
    return this.canvas.width;
  }
  get h() {
    return this.canvas.height;
  }
  setupData(initialData) {
    const { steps, pulses, rotate, radius, morph } = initialData;
    this.steps = steps;
    this.pulses = pulses;
    this.rotate = rotate;
    this.radius = radius;
    this.morph = morph;
  }
  setData(key, value) {
    console.log(key, value);
    const keys = ["steps", "pulses", "rotate", "radius", "morph"];
    if (keys.includes(key)) {
      this[key] = value;
    }
  }
  clear() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.w, this.h);
  }
  render(delta) {
    this.time += (delta || 0) / 1000;
    this.clear();
    if (this.morph) {
      this.noiseFilter.incrementNoiseValues();
    }
    this.noiseFilter.render();
    this.ctx.drawImage(this.noiseFilter.canvas, 0, 0);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "magenta";
    this.ctx.ellipse(
      this.w / 2,
      this.h / 2,
      this.radius,
      this.radius,
      0,
      0,
      Math.PI * 2
    );
    this.ctx.stroke();
  }
}
