import { ReactNode } from "react";

const Show = ({ when, children }: { when: boolean; children: ReactNode }) => {
    return when ? <>{children}</> : null;
  };
  
export {
    Show,
}