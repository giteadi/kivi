import { NumberingContext } from "./NumberingContext";

export const NumberingProvider = ({ children }) => {
  const counters = [0, 0, 0, 0, 0];

  const getNumber = (level) => {
    const idx = Math.max(0, level - 1);
    while (counters.length <= idx) counters.push(0);
    counters[idx]++;
    for (let i = idx + 1; i < counters.length; i++) {
      counters[i] = 0;
    }
    return counters.slice(0, idx + 1).join(".");
  };

  return (
    <NumberingContext.Provider value={{ getNumber }}>
      {children}
    </NumberingContext.Provider>
  );
};
