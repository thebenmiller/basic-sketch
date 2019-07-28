import domready from "domready";
import Sketch from "./Sketch";

domready(() => {
  const sketch = new Sketch();
  sketch.start();
});

// parcel specific code to disable HMR because it is pretty weird with things
// being added to the dom, and seriously slowing down canvas renderers
// if (module.hot) {
//   module.hot.accept(() => {
//     window.location.reload();
//   });
// }
