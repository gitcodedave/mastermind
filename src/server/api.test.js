import axios from "axios";

describe('Random number generator api', () => {
    it('should return a number', async () =>  {
        const response = await axios.get('http://localhost:3000/game/newGame');
        expect(typeof response.data).toBe('string');
    });
    it('the string should be 6 digits or less', async () =>  {
        const response = await axios.get('http://localhost:3000/game/newGame');
        expect(response.data.length).toBeLessThan(7);
    });
  });