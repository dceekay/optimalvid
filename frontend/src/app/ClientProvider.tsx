'use client'; // Mark this component as client-side

import { Provider } from "react-redux";
import store from "../store";  // Ensure your store is imported correctly

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
