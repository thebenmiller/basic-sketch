export default function euclid(stepCount, pulseCount, rotate = 0) {
  rotate *= -1;
  rotate %= stepCount;
  console.log(rotate);
  pulseCount = Math.min(stepCount, pulseCount);

  const steps = new Array(stepCount).fill(0);

  let increment = 0;
  for (let i = 0; i < stepCount; i++) {
    increment += pulseCount;
    if (increment >= stepCount) {
      increment -= stepCount;
      steps[i] = 1;
    }
  }
  steps.reverse();
  if (rotate) {
    return [].concat(steps.slice(rotate), steps.slice(0, rotate)).join("");
  }
  return steps.join("");
}
