import { Edg3 } from "./Edg3";
import { Nod3Id } from "./Nod3";

export interface InnerEdg3Store<T> {
  set(id: string, value: Edg3<T>): void;
  get(id: string): Edg3<T> | undefined;
  has(id: string): boolean;
  values(): Edg3<T>[];
  size(): number;
}

export interface Edg3Store<T> {
  set(id: string, value: InnerEdg3Store<T>): void;
  get(id: string): InnerEdg3Store<T> | undefined;
  has(id: string): boolean;
  values(): InnerEdg3Store<T>[];
  size(): number;
}

export class InnerEdg3MemoryStore<T> implements InnerEdg3Store<T> {
  edges: Map<Nod3Id, Edg3<T>> = new Map();
  set(id: string, value: Edg3<T>): void {
    this.edges.set(id, value);
  }
  get(id: string): Edg3<T> | undefined {
    return this.edges.get(id);
  }
  has(id: string): boolean {
    return this.edges.has(id);
  }
  values(): Edg3<T>[] {
    return [...this.edges.values()];
  }
  size(): number {
    return this.edges.size;
  }
}

export class Edg3MemoryStore<T> implements Edg3Store<T> {
  edges: Map<Nod3Id, InnerEdg3Store<T>> = new Map();
  set(id: string, value: InnerEdg3Store<T>): void {
    this.edges.set(id, value);
  }
  get(id: string): InnerEdg3Store<T> | undefined {
    return this.edges.get(id);
  }
  has(id: string): boolean {
    return this.edges.has(id);
  }
  values(): InnerEdg3Store<T>[] {
    return [...this.edges.values()];
  }
  size(): number {
    return this.edges.size;
  }
}
