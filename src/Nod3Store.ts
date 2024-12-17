import { Nod3Id, Nod3 } from "./Nod3";

export interface Nod3Store<T> {
  set(id: string, value: Nod3<T>): void;
  get(id: string): Nod3<T> | undefined;
  has(id: string): boolean;
  values(): Nod3<T>[];
  size(): number;
}

export class Nod3MemoryStore<T> implements Nod3Store<T> {
  nodes: Map<Nod3Id, Nod3<T>> = new Map();
  set(id: string, value: Nod3<T>): void {
    this.nodes.set(id, value);
  }
  get(id: string): Nod3<T> | undefined {
    return this.nodes.get(id);
  }
  has(id: string): boolean {
    return this.nodes.has(id);
  }
  values(): Nod3<T>[] {
    return [...this.nodes.values()];
  }
  size(): number {
    return this.nodes.size;
  }
}
