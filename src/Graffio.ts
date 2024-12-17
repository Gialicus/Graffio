import { CreateEdg3Input, Edg3 } from "./Edg3";
import {
  Edg3MemoryStore,
  Edg3Store,
  InnerEdg3MemoryStore,
  InnerEdg3Store,
} from "./Edg3Store";
import { CreateNod3Input, generateId, Nod3, Nod3Id } from "./Nod3";
import { Nod3MemoryStore, Nod3Store } from "./Nod3Store";

export class Graffio<T = unknown, K = unknown> {
  nodeStore: Nod3Store<T> = new Nod3MemoryStore();
  inEdges: Edg3Store<K> = new Edg3MemoryStore();
  outEdges: Edg3Store<K> = new Edg3MemoryStore();

  addNode(node: CreateNod3Input<T>): string {
    const id = generateId();
    this.nodeStore.set(id, { id: id, ...node });
    this.inEdges.set(id, new InnerEdg3MemoryStore());
    this.outEdges.set(id, new InnerEdg3MemoryStore());
    return id;
  }

  addEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<K>) {
    if (!this.nodeStore.has(from) || !this.nodeStore.has(to)) {
      throw new Error(`Nodes from: ${from} or to: ${to} not exist`);
    }
    this.inEdges.get(to)!.set(from, { in: from, out: to, ...data });
    this.outEdges.get(from)!.set(to, { in: from, out: to, ...data });
    return this;
  }

  print(): void {
    for (const node of this.nodeStore.values()) {
      console.log("-".repeat(72));
      console.log(`(${node.label}:${node.id})\n`);
      for (const ins of this.inEdges.get(node.id)!.values()) {
        const inNode = this.nodeStore.get(ins.in)!;
        console.log(
          `\t(${node.label}:${node.id}) <- ${ins.label} -- (${inNode.label}:${inNode.id})`
        );
      }
      for (const out of this.outEdges.get(node.id)!.values()) {
        const outNode = this.nodeStore.get(out.out)!;
        console.log(
          `\t(${node.label}:${node.id}) -- ${out.label} -> (${outNode.label}:${outNode.id})`
        );
      }
    }
  }
}
