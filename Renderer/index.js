import testimage from "../testimage.png";
import NoiseFilter from "./NoiseFilter";
import AvgGridFilter from "./AvgGridFilter";

import ee from "../helpers/Events";
import sequences from "../Audio/Sequence";

const PI2 = Math.PI * 2;

export default class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.config = {
      morph: false,
      gridSize: 1
    };

    this.noiseFilter = new NoiseFilter(this.w, this.h);
    this.avgGridFilter = new AvgGridFilter(this.w, this.h);

    this.time = 0;
    this.circles = [];
    this.pixels = new Uint8Array(
      this.noiseFilter.gl.drawingBufferWidth *
        this.noiseFilter.gl.drawingBufferHeight *
        4
    );
    ee.on("visual", (key, value) => this.setData(key, value));
  }
  get w() {
    return this.canvas.width;
  }
  get h() {
    return this.canvas.height;
  }
  setupData(initialData) {
    Object.keys(this.config).map(key => {
      if (initialData.hasOwnProperty(key)) this.setData(key, initialData[key]);
    });
  }
  setData(key, value) {
    console.log(key, value);
    if (this.config.hasOwnProperty(key)) this.config[key] = value;
    switch (key) {
      default:
        //do nothing...
        break;
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
    if (this.config.morph) {
      this.noiseFilter.incrementNoiseValues();
    }
    this.noiseFilter.render();
    this.avgGridFilter.setGridSize(this.config.gridSize);
    this.avgGridFilter.textureData = this.noiseFilter.canvas;
    this.avgGridFilter.render();
    this.avgGridFilter.gl.readPixels(
      0,
      0,
      this.avgGridFilter.gl.drawingBufferWidth,
      this.avgGridFilter.gl.drawingBufferHeight,
      this.avgGridFilter.gl.RGBA,
      this.avgGridFilter.gl.UNSIGNED_BYTE,
      this.pixels
    );
    this.ctx.drawImage(this.avgGridFilter.canvas, 0, 0);

    this.circles = [];

    sequences.forEach((sequence, i) => {
      const { radius, pulsePattern, activeIndex } = sequence;
      const xOffset = this.w / (sequences.length * 2);
      const xPos = xOffset + i * xOffset * 2;

      this.ctx.beginPath();
      this.ctx.strokeStyle = "magenta";
      this.ctx.ellipse(xPos, this.h / 2, radius, radius, 0, 0, Math.PI * 2);
      this.ctx.stroke();

      this.circles.push([]);

      for (let n = 0; n < pulsePattern.length; n++) {
        const x = Math.floor(
          radius * Math.sin((PI2 * n) / pulsePattern.length) + xPos
        );
        const y = Math.floor(
          radius * Math.cos((PI2 * n) / pulsePattern.length) + this.h / 2
        );
        this.circles[i].push({ x, y });

        this.ctx.beginPath();
        this.ctx.ellipse(x, y, 10, 10, 0, 0, PI2);
        if (n === activeIndex || pulsePattern[n]) {
          this.ctx.fillStyle = n === activeIndex ? "white" : "magenta";
          this.ctx.fill();
        }
        this.ctx.stroke();
      }

      if (pulsePattern.length !== this.circles[i].length) {
        sequence.updateCVPattern(new Array(pulsePattern.length).fill(0));
        return console.warn("pulseEvent: Circles not yet drawn, returning 0s");
      }
      sequence.updateCVPattern(
        pulsePattern.map((c, n) => {
          const x = this.circles[i][n].x;
          const y = this.noiseFilter.gl.drawingBufferHeight - this.circles[i][n].y;
          const l = y * this.noiseFilter.gl.drawingBufferWidth * 4 + x * 4;
          return this.pixels[l] / 255;
        })
      );
    });
  }
}
