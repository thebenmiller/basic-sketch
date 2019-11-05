import Tone from "tone";
import ee from "../helpers/Events";

class Audio {
  constructor() {
    this.synth = new Tone.Synth().toMaster();
    this.loop = new Tone.Loop(()=>this.transportEvent(), "4n");

    this.started = false;

    this.pattern = [];
    this.activeIndex = 0;
    this.frequency = 0;
    this.bpm = 0;

    ee.on("config", (key, value) => this.setData(key, value));

    ee.on("play", () => {
      if(!this.started)
        Tone.Transport.start();
      this.loop.start();
    });

    ee.on("stop", () => {
      this.loop.stop();
    });

    ee.on("pulse-response", (frequencies) => {
      if(this.pattern[this.activeIndex]){
        this.synth.triggerAttackRelease(this.frequency + frequencies[this.activeIndex], .25);
      }
      console.log(frequencies, frequencies[this.activeIndex]);
      this.activeIndex = (this.activeIndex+1)%this.pattern.length;
    });
  }

  transportEvent(){
    ee.emit("pulse", this.activeIndex);
  }

  setupData(initialData) {
    const { frequency, bpm, pattern } = initialData;
    this.frequency = frequency;
    this.bpm = bpm;
    this.pattern = pattern;
    this.setBpm();
    this.setPattern();

  }
  setData(key, value) {
    const keys = ["frequency", "bpm", "pattern"];
    if (keys.includes(key)) {
      this[key] = value;
    }
    switch(key){
      case "bpm":
        this.setBpm();
      break;
      case "pattern":
        this.setPattern();
      default:
      //do nothing...
      break;
    }
  }
  setBpm(){
    Tone.Transport.bpm.value = this.bpm;
  }
  setPattern(){
    if(this.activeIndex >= this.pattern.length){
      this.activeIndex = 0;
    }
  }
}

export default Audio;
