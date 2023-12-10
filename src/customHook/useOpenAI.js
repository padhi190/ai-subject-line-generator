import { useState } from 'react';

const baseUrl = 'api/'
/**
 * Custom hook for calling openAI endpoint and getting the response, 
 * loading state, and error message 
 * @date 9/5/2023 - 5:32:24 AM
 *
 * @export
 * @param {'subject' | 'writing' | 'custom'} endpoint
 */
export function useOpenAI(endpoint) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState(null);

  function callOpenAI(data = {}) {
    return (async () => {
      try {
        setError(false);
        setIsLoading(true);
        const resp = await fetch(baseUrl + endpoint, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(data),
        });
        console.log('resp', resp);
        const ans = await resp.json();
        console.log('resp.json', ans);

        setIsLoading(false);
        setAnswer(ans);
        return ans;
      } catch (error) {
        console.log('error', error);
        setIsLoading(false);
        setError(error.toString());
      }
    })();
  }

  return { callOpenAI, isLoading, error, answer };
}
