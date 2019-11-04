import ee from '../helpers/Events';
import './base.css';

const Elements = () => {

  function handleClick(e){
    ee.emit("click");
  }

  return (
    <div><a class="test" href="#" onClick={handleClick}>This is a test!</a></div>
  )
}

export default Elements;
