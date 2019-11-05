import ee from "../helpers/Events";

const Elements = () => {
  function handleClick(e) {
    ee.emit("click");
  }

  return (
    <div>
      <a class="button" href="#" onClick={handleClick}>
        This is a test!
      </a>
    </div>
  );
};

export default Elements;
