import './style.css';
import { setupDojo, accountAddress } from './dojo';

import p5 from 'p5';

const sketch = (p: p5) => {
  const dojo = setupDojo();

  let pos: number[] = [];

  function spawn() {
    dojo.execute('spawn');
  }

  setInterval(() => {
    dojo.entity("Position", accountAddress, 0, 2).then(pos_resp => {
      pos = [
        10 * (pos_resp[1] - 1000),
        10 * (pos_resp[2] - 1000)
      ];
    }).catch(e => {
      // Same as above with 0 values
      pos = [
        10 * (-1000),
        10 * (-1000)
      ];
    }); // Silent failure

  }, 500);

  p.setup = () => {
    p.createCanvas(500, 500);
    const button = p.createButton('Spawn');
    button.mousePressed(spawn);
  };

  p.draw = () => {
    p.background('#eee');
    p.translate(250, 250);
    p.ellipse(pos[0], pos[1], 25);
  };
};

new p5(sketch);