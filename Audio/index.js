import Tone from "tone";
import ee from "../helpers/Events";

class Audio {
  constructor() {
    this.synth = new Tone.Synth().toMaster();

    this.frequency = 0;
    this.steps = 0;
    this.pulses = 0;
    this.rotate = 0;
    this.bpm = 0;

    ee.on("config", (key, value) => this.setData(key, value));

    ee.on("click", () => {
      this.synth.triggerAttackRelease(this.frequency, ".5");
    });
  }
  setupData(initialData) {
    const { frequency, steps, pulses, rotate, bpm } = initialData;
    this.frequency = frequency;
    this.steps = steps;
    this.pulses = pulses;
    this.rotate = rotate;
    this.bpm = bpm;
  }
  setData(key, value) {
    console.log(key, value);
    const keys = ["frequency", "steps", "pulses", "rotate", "bpm"];
    if (keys.includes(key)) {
      this[key] = value;
    }
  }
}

export default Audio;
