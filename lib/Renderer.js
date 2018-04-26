import testimage from '../testimage.png';
import BlurFilter from './BlurFilter';
import ThresholdFilter from './ThresholdFilter';
import WebGLFilter from './WebGLFilter';

export default class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.img = new Image();
    this.img.addEventListener('load', () => {
      if (this.waitingToRender) this.render();
    });
    this.img.src = testimage;
    this.blurFilter = new BlurFilter(window.innerWidth, window.innerHeight, 3);
    this.thresholdFilter = new ThresholdFilter(window.innerWidth, window.innerHeight, 0.5);
    this.time = 0;
  }
  get w() {
    return this.canvas.width;
  }
  get h() {
    return this.canvas.height;
  }
  clear() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.w, this.h);
  }
  render(delta) {
    if (isNaN(this.img.width) || this.img.width == 0) {
      this.waitingToRender = true;
      return;
    }
    this.time += delta / 2000;
    this.clear();
    this.ctx.drawImage(this.img, this.w / 2 - this.img.width / 2, this.h / 2 - this.img.height / 2);
    this.ctx.fillStyle = 'black';
    this.ctx.font = '150px Helvetica';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('HELLO WORLD', this.w / 2, this.h / 2);

    this.blurFilter.textureData = this.canvas;
    this.blurFilter.render();
    this.thresholdFilter.textureData = this.blurFilter.canvas;
    this.thresholdFilter.threshold = Math.sin(this.time) * 0.5 + 0.5;
    this.thresholdFilter.render();
    this.ctx.drawImage(this.thresholdFilter.canvas, 0, 0);
  }
}
