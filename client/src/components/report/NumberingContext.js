import { createContext, useContext } from "react";

export const NumberingContext = createContext(null);

export const useSectionNumber = (level) => {
  const ctx = useContext(NumberingContext);
  return ctx ? ctx.getNumber(level) : null;
};
