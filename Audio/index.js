import Tone from "tone";
import ee from "../helpers/Events";
import sequences from "./Sequence";

class Audio {
  constructor() {
    this.loop = new Tone.Loop(() => this.transportEvent(), "4n");
    this.started = false;

    this.config = {
      bpm: 0
    };

    ee.on("audio", (key, value) => this.setData(key, value));

    ee.on("play", () => {
      Tone.Transport.start();
    });

    ee.on("stop", () => {
      Tone.Transport.pause();
    });
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
