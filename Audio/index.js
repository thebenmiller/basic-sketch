import Tone from "tone";
import ee from '../helpers/Events';

class Audio {
  constructor() {
    this.synth = new Tone.Synth().toMaster();
    ee.on('click', ()=>{
      this.synth.triggerAttackRelease('120', '.5');
    });
  }
}

export default Audio;
