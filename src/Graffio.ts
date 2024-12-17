import { CreateEdg3Input, Edg3 } from "./Edg3";
import { CreateNod3Input, generateId, Nod3, Nod3Id } from "./Nod3";

export class Graffio<T = unknown, K = unknown> {
  nodes: Map<Nod3Id, Nod3<T>> = new Map();
  inEdges: Map<Nod3Id, Map<Nod3Id, Edg3<K>>> = new Map();
  outEdges: Map<Nod3Id, Map<Nod3Id, Edg3<K>>> = new Map();

  addNode(node: CreateNod3Input<T>): string {
    const id = generateId();
    this.nodes.set(id, { id: id, ...node });
    this.inEdges.set(id, new Map());
    this.outEdges.set(id, new Map());
    return id;
  }

  addEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<K>) {
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      throw new Error(`Nodes from: ${from} or to: ${to} not exist`);
    }
    this.inEdges.get(to)!.set(from, { in: from, out: to, ...data });
    this.outEdges.get(from)!.set(to, { in: from, out: to, ...data });
    return this;
  }

  print(): void {
    for (const node of this.nodes.values()) {
      console.log("-".repeat(72));
      console.log(`(${node.label}:${node.id})\n`);
      for (const ins of this.inEdges.get(node.id)!.values()) {
        const inNode = this.nodes.get(ins.in)!;
        console.log(
          `\t(${node.label}:${node.id}) <- ${ins.label} -- (${inNode.label}:${inNode.id})`
        );
      }
      for (const out of this.outEdges.get(node.id)!.values()) {
        const outNode = this.nodes.get(out.out)!;
        console.log(
          `\t(${node.label}:${node.id}) -- ${out.label} -> (${outNode.label}:${outNode.id})`
        );
      }
    }
  }
}
