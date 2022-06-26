import robot from 'robotjs';

export const drawCircle = (radius: number, mouse: { x: number; y: number }) => {
  robot.mouseToggle('down');
  for (let i = 0; i <= Math.PI * 2; i += 0.01) {
    const x = mouse.x - Math.cos(i) * radius + radius;
    const y = mouse.y - Math.sin(i) * radius;
    robot.dragMouse(x, y);
  }
  robot.mouseToggle('up');
};
