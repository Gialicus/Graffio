import { CreateEdg3Input, Edg3 } from "./Edg3";
import { Nod3Id } from "./Nod3";

export interface Edg3Store<T> {
  init(id: Nod3Id): void;
  addEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<T>): void;
  readEdges(id: Nod3Id): Edg3<T>[];
}

export class Edg3MemoryStore<T> implements Edg3Store<T> {
  edge: Map<Nod3Id, Map<Nod3Id, Edg3<T>>> = new Map();

  init(id: Nod3Id): void {
    if (!this.edge.has(id)) {
      this.edge.set(id, new Map());
    }
  }

  addEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<T>): void {
    this.init(from);
    this.init(to);
    this.edge
      .get(from)!
      .set(to, { in: from, out: to, label: data.label, value: data.value });
  }

  readEdges(id: Nod3Id): Edg3<T>[] {
    const edges = this.edge.get(id);
    return edges ? [...edges.values()] : [];
  }
}
