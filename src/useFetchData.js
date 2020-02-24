import { useReducer, useEffect } from "react";

const initState = {
  loading: false,
  error: null,
  data: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "init":
      return initState;
    case "start":
      return { ...state, loading: true };
    case "done":
      return { ...state, loading: false, data: action.data };
    case "error":
      return { ...state, loading: false, error: action.error };
    default:
      throw new Error("no such action type");
  }
};

const defaultOpts = {};

const useFetchData = (url, opts = defaultOpts) => {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    if (!url) return;
    dispatch({ type: "start" });
    const fetchData = async () => {
      try {
        const results = await (await fetch(url, opts)).json();
        const data = results;
        dispatch({ type: "done", data: data });
      } catch (e) {
        dispatch({ type: "error", error: e });
      }
    };
    fetchData();
    return () => {
      dispatch({ type: "init" });
    };
  }, [url, opts]);

  return state;
};

export default useFetchData;
