import { CreateEdg3Input, Edg3 } from "./Edg3";
import { Edg3MemoryStore, Edg3Store } from "./Edg3Store";
import { CreateNod3Input, generateId, Nod3, Nod3Id } from "./Nod3";
import { Nod3MemoryStore, Nod3Store } from "./Nod3Store";

export class Graffio<T = unknown, K = unknown> {
  nodes: Nod3Store<T> = new Nod3MemoryStore();
  edges: Edg3Store<K> = new Edg3MemoryStore();

  addNode(node: CreateNod3Input<T>): string {
    const id = generateId();
    this.nodes.set(id, { id: id, ...node });
    this.edges.init(id);
    return id;
  }

  addEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<K>) {
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      throw new Error(`Nodes from: ${from} or to: ${to} not exist`);
    }
    this.edges.addEdge(from, to, data);
    return this;
  }

  readInNeighbours(id: Nod3Id): Edg3<K>[] {
    return this.edges.readInEdgesById(id);
  }

  readOutNeighbours(id: Nod3Id): Edg3<K>[] {
    return this.edges.readOutEdgesById(id);
  }

  print(): void {
    for (const node of this.nodes.values()) {
      console.log("-".repeat(72));
      console.log(`(${node.label}:${node.id})\n`);
      for (const ins of this.edges.readInEdgesById(node.id)) {
        const inNode = this.nodes.get(ins.in)!;
        console.log(
          `\t(${node.label}:${node.id}) <- ${ins.label} -- (${inNode.label}:${inNode.id})`
        );
      }
      for (const out of this.edges.readOutEdgesById(node.id)) {
        const outNode = this.nodes.get(out.out)!;
        console.log(
          `\t(${node.label}:${node.id}) -- ${out.label} -> (${outNode.label}:${outNode.id})`
        );
      }
    }
  }
}
