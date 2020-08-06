import { useState, useCallback, useRef,useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, header = {}) => {
      setIsLoading(true);
      const httpAbortCtrll = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrll);
      try {
        const response = fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrll.signal,
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        return responseData;
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    },
    []
  );
  const clearError = () => {
    setError(null);
  };
  useEffect(()=>{
      return()=>{
          activeHttpRequests.current.forEach(abortCtrl=>abortCtrl.abortCtrl();)
      }
  },[]
  )

  return { isLoading, error, sendRequest, clearError };
};
