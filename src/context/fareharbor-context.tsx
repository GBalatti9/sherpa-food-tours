"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface FareHarborContextValue {
  fareharborLink: string | null;
  setFareharborLink: (link: string | null) => void;
}

const FareHarborContext = createContext<FareHarborContextValue>({
  fareharborLink: null,
  setFareharborLink: () => {},
});

export function FareHarborProvider({ children }: { children: ReactNode }) {
  const [fareharborLink, setFareharborLink] = useState<string | null>(null);

  return (
    <FareHarborContext.Provider value={{ fareharborLink, setFareharborLink }}>
      {children}
    </FareHarborContext.Provider>
  );
}

export function useFareHarbor() {
  return useContext(FareHarborContext);
}
