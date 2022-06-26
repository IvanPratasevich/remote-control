import robot from 'robotjs';
import Jimp from 'jimp';

export const screenCapture = async (mouse: { x: number; y: number }): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const screenWidth: number = 200;
      const screenHeight: number = 200;
      const screenBuffer: Buffer = robot.screen.capture(
        mouse.x - screenWidth / 2,
        mouse.y - screenHeight / 2,
        screenWidth,
        screenHeight
      ).image;
      for (let i = 0; i < screenBuffer.length; i += 4) {
        [screenBuffer[i], screenBuffer[i + 2]] = [screenBuffer[i + 2], screenBuffer[i]];
      }
      const image: Jimp = new Jimp({ data: screenBuffer, width: screenWidth, height: screenHeight });
      const base64: string = await image.getBase64Async(Jimp.MIME_PNG);
      resolve(base64.split(',')[1]);
    } catch (error) {
      reject((error as Error).message);
    }
  });
};
