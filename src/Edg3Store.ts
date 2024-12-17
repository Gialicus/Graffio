import { CreateEdg3Input, Edg3 } from "./Edg3";
import { Nod3Id } from "./Nod3";

export interface Edg3Store<T> {
  init(id: Nod3Id): void;
  addEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<T>): void;
  addInverseEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<T>): void;
  readEdges(id: string): Edg3<T>[];
}

export class Edg3MemoryStore<T> implements Edg3Store<T> {
  edge: Map<Nod3Id, Map<Nod3Id, Edg3<T>>> = new Map();
  init(id: Nod3Id): void {
    this.edge.set(id, new Map());
  }
  addEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<T>): void {
    this.edge.get(to)!.set(from, { in: from, out: to, ...data });
  }
  addInverseEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<T>): void {
    this.edge.get(from)!.set(to, { in: from, out: to, ...data });
  }
  readEdges(id: string): Edg3<T>[] {
    return [...this.edge.get(id)!.values()];
  }
}
