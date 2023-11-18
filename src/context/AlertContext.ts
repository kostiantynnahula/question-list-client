import { createContext } from "react";

export type AlertContext = {
  alert?: AlertDetails,
  setAlert?: (alert: AlertDetails | undefined) => void,
}

export type AlertDetails = {
  message: string;
  type: string;
};

export const AlertContext = createContext<AlertContext>({});