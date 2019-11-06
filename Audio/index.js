import Tone from "tone";
import ee from "../helpers/Events";
import sequences from "./Sequence";

class Audio {
  constructor() {
    this.synths = [
      new Tone.Synth().toMaster(),
      new Tone.Synth().toMaster(),
      new Tone.Synth().toMaster()
    ];
    this.loop = new Tone.Loop(() => this.transportEvent(), "4n");
    this.started = false;

    this.config = {
      bpm: 0
    };

    ee.on("audio", (key, value) => this.setData(key, value));

    ee.on("play", () => {
      if (!this.started) Tone.Transport.start();
      this.loop.start();
    });

    ee.on("stop", () => {
      this.loop.stop();
    });

    ee.on("pulse-response", () => {
      sequences.forEach((sequence, i) => {
        sequence.step();
        const {
          pulsePattern,
          cvPattern,
          activeIndex,
          frequency,
          scale,
        } = sequence;
        if(i == 0){
          console.log(cvPattern, frequency, scale);
        }
        if (pulsePattern[activeIndex]) {
          this.synths[i].triggerAttackRelease(
            frequency + cvPattern[activeIndex] * scale,
            0.25
          );
        }
      });
    });
  }

  transportEvent() {
    ee.emit("pulse", this.activeIndex);
  }

  setupData(initialData) {
    Object.keys(this.config).map(key => {
      if (initialData.hasOwnProperty(key)) this.setData(key, initialData[key]);
    });
  }
  setData(key, value) {
    if (this.config.hasOwnProperty(key)) this.config[key] = value;

    switch (key) {
      case "bpm":
        Tone.Transport.bpm.value = this.config.bpm;
        break;
      default:
        //do nothing...
        break;
    }
  }
}

export default Audio;
