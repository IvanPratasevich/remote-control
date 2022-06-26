import robot from 'robotjs';

export const drawRectangle = (mouse: { x: number; y: number }, width: number, length: number) => {
  robot.mouseToggle('down');
  robot.moveMouseSmooth(mouse.x + width, mouse.y);
  robot.moveMouseSmooth(mouse.x + width, mouse.y + length);
  robot.moveMouseSmooth(mouse.x, mouse.y + length);
  robot.moveMouseSmooth(mouse.x, mouse.y);
  robot.mouseToggle('up');
};
