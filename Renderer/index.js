import testimage from "../testimage.png";
import NoiseFilter from "./NoiseFilter";

import ee from "../helpers/Events";

export default class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.radius = 0;
    this.morph = false;
    this.pattern = [];
    this.activeIndex = 0;

    this.noiseFilter = new NoiseFilter(this.w, this.h);
    this.time = 0;
    this.circles = [];
    this.pixels = new Uint8Array(
      this.noiseFilter.gl.drawingBufferWidth *
        this.noiseFilter.gl.drawingBufferHeight *
        4
    );
    ee.on("config", (key, value) => this.setData(key, value));
    ee.on("pulse", i => this.pulseEvent(i));
  }
  get w() {
    return this.canvas.width;
  }
  get h() {
    return this.canvas.height;
  }
  setupData(initialData) {
    const { radius, morph, pattern } = initialData;
    this.radius = radius;
    this.morph = morph;
    this.pattern = pattern;
  }
  setData(key, value) {
    const keys = ["radius", "morph", "pattern"];
    if (keys.includes(key)) {
      this[key] = value;
    }
  }
  pulseEvent(i) {
    this.activeIndex = i;
    const responses = [];
    if (this.pattern.length !== this.circles.length) {
      console.warn("pulseEvent: Circles not yet drawn, returning 0s");
      ee.emit("pulse-response", new Array(this.pattern.length).fill(0));
    } else {
      for (let i = 0; i < this.pattern.length; i++) {
        const x = this.circles[i].x;
        const y = this.noiseFilter.gl.drawingBufferHeight - this.circles[i].y;
        const l = y * this.noiseFilter.gl.drawingBufferWidth * 4 + x * 4;
        responses.push(this.pixels[l]);
      }
      ee.emit("pulse-response", responses);
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
    this.noiseFilter.gl.readPixels(
      0,
      0,
      this.noiseFilter.gl.drawingBufferWidth,
      this.noiseFilter.gl.drawingBufferHeight,
      this.noiseFilter.gl.RGBA,
      this.noiseFilter.gl.UNSIGNED_BYTE,
      this.pixels
    );
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
    this.circles = [];
    for (let i = 0; i < this.pattern.length; i++) {
      const x = Math.round(
        this.radius * Math.sin(Math.PI * 2 * (i / this.pattern.length)) +
          this.w / 2
      );
      const y = Math.round(
        this.radius * Math.cos(Math.PI * 2 * (i / this.pattern.length)) +
          this.h / 2
      );
      this.circles.push({ x, y });
      this.ctx.beginPath();
      this.ctx.ellipse(x, y, 10, 10, 0, 0, Math.PI * 2);
      if (i === this.activeIndex) {
        this.ctx.fillStyle = "white";
        this.ctx.fill();
      } else if (this.pattern[i] === 1) {
        this.ctx.fillStyle = "magenta";
        this.ctx.fill();
      }
      this.ctx.stroke();
    }
  }
}
