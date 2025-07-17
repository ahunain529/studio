import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyD6EIHD0eI7LzJrdFXc8mUc8LQyls1AOV0'})],
  model: 'googleai/gemini-2.0-flash',
});
