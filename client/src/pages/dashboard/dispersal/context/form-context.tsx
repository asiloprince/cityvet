import { useContext } from "react";
import { SingleDispersionsFormContext } from "./single-dispersions-context";

export function useFormState() {
  return useContext(SingleDispersionsFormContext);
}
