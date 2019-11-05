import ee from "../helpers/Events";

const Elements = () => {
  function handlePlay(e) {
    ee.emit("play");
  }
  function handleStop(e){
    ee.emit("stop");
  }

  return (
    <div>
      <button class="button" onClick={handlePlay}>Play</button>
      <button class="button" onClick={handleStop}>Stop</button>
    </div>
  );
};

export default Elements;
