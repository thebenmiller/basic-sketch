import ee from "../helpers/Events";

const Elements = () => {
  function handlePlay(e) {
    ee.emit("play");
  }
  function handleStop(e) {
    ee.emit("stop");
  }

  return (
    <div>
      <div class="global-controls">
        <div class="panel panel-horizontal">
          <div class="buttons">
            <button class="button" onClick={handlePlay}>
              Play
            </button>
            <button class="button" onClick={handleStop}>
              Stop
            </button>
          </div>
          <Range
            name="bpm"
            label="bpm"
            min={1}
            max={400}
            step={1}
            value={180}
            group="audio"
          />
          <CheckBox label="morph" name="morph" group="visual" />
            <Range
              name="gridSize"
              label="gridSize"
              min={1}
              max={72}
              step={2}
              value={1}
              group="visual"
            />
        </div>
      </div>
      <div class="controllers">
        <SequencerDetailsPanel title="Sequencer 1" group="sequencer1"/>
        <SequencerDetailsPanel title="Sequencer 2" group="sequencer2"/>
        <SequencerDetailsPanel title="Sequencer 3" group="sequencer3"/>
      </div>
    </div>
  );
};

export default Elements;

const Range = ({ min, max, step, value, label, name, group }) => {
  const change = e => {
    e.currentTarget.nextSibling.innerText = e.currentTarget.value;
    ee.emit(group, name, parseFloat(e.currentTarget.value));
  };
  return (
    <label class="input-container">
      <span class="input-label">{label}</span>
      <input
        type="range"
        max={max}
        min={min}
        step={step}
        value={value}
        name={name}
        onInput={change}
        class="input range-input"
      />
      <span class="input-value">{value.toString()}</span>
    </label>
  );
};

const CheckBox = ({ label, checked, name, group }) => {
  const change = e => {
    ee.emit(group, name, e.currentTarget.checked);
  };
  return (
    <label class="input-container">
      <span class="input-label">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={change}
        class="input checkbox-input"
      />
    </label>
  );
};

const SequencerDetailsPanel = ({title, group}) => (
  <details class="panel" open>
    <summary class="panel-title">{title}</summary>
    <div class="panel-body">
      <Range
        name="frequency"
        label="frequency"
        min={5}
        max={1000}
        step={1}
        value={120}
        group={group}
      />
      <Range
        name="steps"
        label="steps"
        min={2}
        max={24}
        step={1}
        value={8}
        group={group}
      />
      <Range
        name="pulses"
        label="pulses"
        min={0}
        max={24}
        step={1}
        value={4}
        group={group}
      />
      <Range
        name="rotate"
        label="rotate"
        min={0}
        max={24}
        step={1}
        value={0}
        group={group}
      />
      <Range
        name="scale"
        label="scale"
        min={0}
        max={1000}
        step={1}
        value={0}
        group={group}
      />
      <Range
        name="radius"
        label="radius"
        min={0}
        max={200}
        step={1}
        value={50}
        group={group}
      />
    </div>
  </details>
)
