import { createContext, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

export const CompareContext = createContext(null);

const readInitial = () => {
  try {
    return JSON.parse(localStorage.getItem("jkautos_compare") || "[]");
  } catch (_error) {
    return [];
  }
};

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState(readInitial);

  const persist = (items) => {
    setCompareList(items);
    localStorage.setItem("jkautos_compare", JSON.stringify(items));
  };

  const addToCompare = useCallback(
    (car) => {
      if (compareList.some((item) => item.id === car.id)) return;
      if (compareList.length >= 3) {
        toast.error("You can compare up to 3 cars");
        return;
      }
      persist([...compareList, car]);
      toast.success(`${car.title} added to compare`);
    },
    [compareList]
  );

  const removeFromCompare = useCallback(
    (id) => persist(compareList.filter((car) => car.id !== id)),
    [compareList]
  );

  const clearCompare = useCallback(() => persist([]), []);

  const value = useMemo(
    () => ({ compareList, addToCompare, removeFromCompare, clearCompare }),
    [compareList, addToCompare, removeFromCompare, clearCompare]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}
