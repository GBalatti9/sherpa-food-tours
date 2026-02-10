"use client";

import { useEffect } from "react";
import { useFareHarbor } from "./fareharbor-context";

export default function FareHarborSetter({ link }: { link?: string | null }) {
  const { setFareharborLink } = useFareHarbor();

  useEffect(() => {
    setFareharborLink(link ?? null);

    return () => {
      setFareharborLink(null);
    };
  }, [link, setFareharborLink]);

  return null;
}
