import { CreateEdg3Input, Edg3 } from "./Edg3";
import { Nod3Id } from "./Nod3";

export interface Edg3Store<T> {
  init(id: Nod3Id): void;
  addEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<T>): void;
  readInEdgesById(id: string): Edg3<T>[];
  readOutEdgesById(id: string): Edg3<T>[];
}

export class Edg3MemoryStore<T> implements Edg3Store<T> {
  inEdges: Map<Nod3Id, Map<Nod3Id, Edg3<T>>> = new Map();
  outEdges: Map<Nod3Id, Map<Nod3Id, Edg3<T>>> = new Map();
  init(id: Nod3Id): void {
    this.inEdges.set(id, new Map());
    this.outEdges.set(id, new Map());
  }
  addEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<T>): void {
    this.inEdges.get(to)!.set(from, { in: from, out: to, ...data });
    this.outEdges.get(from)!.set(to, { in: from, out: to, ...data });
  }
  readInEdgesById(id: string): Edg3<T>[] {
    return [...this.inEdges.get(id)!.values()];
  }
  readOutEdgesById(id: string): Edg3<T>[] {
    return [...this.outEdges.get(id)!.values()];
  }
}
