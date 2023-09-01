import './style.css';
import { setupDojo, accountAddress } from './dojo';

import p5 from 'p5';

const sketch = (p: p5) => {
  const dojo = setupDojo();

  let pos = [-9999, -9999]; // Out of canvas

  function spawn() {
    dojo.execute('spawn');
  }

  setInterval(async () => {
    let pos_resp = await dojo.entity("Position", accountAddress, 0, 2);
    pos = [
      10 * (pos_resp[1] - 1000),
      10 * (pos_resp[2] - 1000)
    ];
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
    p.text(`${pos}`, 0, 0)
  };
};

new p5(sketch);