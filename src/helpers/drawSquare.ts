import robot from 'robotjs';

export const drawSquare = (mouse: { x: number; y: number }, width: number) => {
  robot.mouseToggle('down');
  robot.moveMouseSmooth(mouse.x + width, mouse.y);
  robot.moveMouseSmooth(mouse.x + width, mouse.y + width);
  robot.moveMouseSmooth(mouse.x, mouse.y + width);
  robot.moveMouseSmooth(mouse.x, mouse.y);
  robot.mouseToggle('up');
};
