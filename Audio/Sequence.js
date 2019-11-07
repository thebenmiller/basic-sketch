import Tone from "tone";
import ee from "../helpers/Events";
import euclid from "../helpers/euclid";

class Sequence {
  constructor({ frequency, scale, steps, pulses, rotate, radius, group }) {
    this.activeIndex = -1;
    this.frequency = frequency || 0;
    this.scale = scale || 0;
    this.steps = steps || 0;
    this.pulses = pulses || 0;
    this.rotate = rotate || 0;
    this.radius = radius || 0;
    this.group = group;
    this.pulsePattern = [];
    this.cvPattern = [];
    this.loop = new Tone.Loop(() => this.pulseEvent(), this.steps+"n").start(0);
    this.synth = new Tone.Synth().toMaster();
    this.updatePulsePattern();
    this.updateLoop();
    ee.on(this.group, (key, value) => this.setData(key, value));
  }
  step() {
    this.activeIndex =
      (this.activeIndex + 1) % this.pulsePattern.length;
  }
  updatePulsePattern() {
    this.pulsePattern = euclid(
      this.steps,
      this.pulses,
      this.rotate
    );
    if(this.activeIndex >= this.pulsePattern.length){
      this.activeIndex = 0;
    }
  }
  updateCVPattern(pattern){
    this.cvPattern = pattern;
  }
  updateLoop(){
    this.loop.interval = this.steps+"n";
  }
  pulseEvent(){
    this.step();
    if (this.pulsePattern[this.activeIndex]) {
      this.synth.triggerAttackRelease(
        this.frequency + this.cvPattern[this.activeIndex] * this.scale,
        "8n"
      );
    }
  }
  setData(key, value){
    console.log(key, value);
    const keys = ["frequency", "scale", "steps", "pulses", "rotate", "radius"];
    if(keys.includes(key)){
      this[key] = value;
    }
    if(key === "steps" || key === "pulses" || key === "rotate"){
      this.updatePulsePattern();
    }
    if(key === "steps"){
      this.updateLoop();
    }
  }
}

export default [
  new Sequence({ frequency: 120, steps: 8, pulses: 4, rotate: 0, scale: 0, radius: 50, group: "sequencer1" }),
  new Sequence({ frequency: 120, steps: 8, pulses: 4, rotate: 0, scale: 0, radius: 50, group: "sequencer2" }),
  new Sequence({ frequency: 120, steps: 8, pulses: 4, rotate: 0, scale: 0, radius: 50, group: "sequencer3" }),
];
