import Color from "color";
import { isArray, isNumber, isString, isObject, isBoolean } from "./isType";
/*

  Expects an options object like:

  controls = {
    message: "test",
    color: "#f00"
    slider: 2,
    sliderWithOptions: {
      default: 2,
      options: g => g.min(0).max(10)
    }
    folder: [
      "folder name",
      {
        message2: "test",
        color2: "#f00"
      }
    ]
  }

*/

export default function controllerSetup(controller, controls, updateCallback) {
  //TODO
  // Better color handling, colors can be objects arrays or strings
  // Less passing of the base object, more DRY

  const ob = {};

  Object.keys(controls).forEach(key => {
    const control = controls[key];

    if (isArray(control)) {
      const folder = controller.addFolder(control[0]);
      try {
        const folderControls = control[1];
        Object.keys(folderControls).forEach(key => {
          const control = folderControls[key];
          if (
            typeof control === "string" ||
            typeof control === "number" ||
            typeof control === "object" ||
            typeof control === "boolean"
          ) {
            addControl(folder, ob, key, control, updateCallback);
          }
        });
      } catch (err) {
        console.warn("Something went wrong inside folder: " + folder, err);
      }
    } else if (isString(control) || isNumber(control) || isObject(control)) {
      addControl(controller, ob, key, control, updateCallback);
    } else if (typeof control === "array") {
    } else {
      console.error("Unknown or broken value found in controllerSetup: " + key);
    }
  });
  return ob;
}

function addControl(base, ob, key, control, updateCallback) {
  if (ob[key])
    console.warn(
      "controllerSetup will overwrite duplicate control named: " + key
    );
  if (isString(control)) {
    try {
      let c = Color(control);
      ob[key] = c.hex();
      base.addColor(ob, key).onFinishChange(val => updateCallback(key, val));
    } catch (err) {
      ob[key] = control;
      base.add(ob, key).onFinishChange(val => updateCallback(key, val));
    }
  } else if (isNumber(control)) {
    ob[key] = control;
    base.add(ob, key).onChange(val => updateCallback(key, val));
  } else if (isBoolean(control)) {
    ob[key] = control;
    base.add(ob, key).onFinishChange(val => updateCallback(key, val));
  } else {
    //has to be an object...
    ob[key] = control.default;
    let f = control.options || (g => g);
    f(base.add(ob, key)).onChange(val => updateCallback(key, val));
  }
}
