export default class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
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
  }
  render(delta) {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(100, 100, this.w - 200, this.h - 200);
    this.ctx.fillStyle = 'blue';
    this.ctx.fillText(this.time, this.w / 2, this.h / 2);
    this.time += delta;
  }
}
