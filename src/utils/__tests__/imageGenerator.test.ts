import { generateShareImage } from '../imageGenerator';

describe('Image Generator', () => {
  beforeAll(() => {
    // Mock canvas
    if (typeof window !== 'undefined') {
      window.HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation(() => ({
        fillRect: jest.fn(),
        fillStyle: '',
        createLinearGradient: jest.fn(() => ({
          addColorStop: jest.fn(),
        })),
        fillText: jest.fn(),
        measureText: jest.fn(() => ({ width: 100 })),
        beginPath: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        font: '',
      } as unknown as CanvasRenderingContext2D));
      
      window.HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,fake');
    }
  });

  it('generates a share image with user data', async () => {
    const result = await generateShareImage('testuser', { correct: 5, incorrect: 2 });
    
    expect(result).toBe('data:image/png;base64,fake');
  });
}); 