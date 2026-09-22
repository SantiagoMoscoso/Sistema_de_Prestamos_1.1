import { useContext } from "react";
import { LoansContext } from "../context/LoansContext";

export function useLoans() {
  const context = useContext(LoansContext);

  if (!context) {
    throw new Error("useLoans debe usarse dentro de un LoansProvider");
  }

  return context;
}