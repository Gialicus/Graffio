import { Nod3Id } from "./Nod3";

export type Edg3<K> = {
  in: Nod3Id;
  out: Nod3Id;
  label: string;
  value?: K;
};

export type CreateEdg3Input<K> = Omit<Edg3<K>, "in" | "out">;
