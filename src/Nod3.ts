import { randomUUID } from "crypto";

export type Nod3<T> = {
  id: string;
  label: string;
  value: T;
};

export type Nod3Id = Nod3<unknown>["id"];

export type CreateNod3Input<T> = Omit<Nod3<T>, "id">;

export function generateId() {
  return randomUUID();
}
