import { CreateEdg3Input, Edg3 } from "./Edg3";
import { Edg3MemoryStore, Edg3Store } from "./Edg3Store";
import { CreateNod3Input, generateId, Nod3, Nod3Id } from "./Nod3";
import { Nod3MemoryStore, Nod3Store } from "./Nod3Store";

export class Graffio<T = unknown, K = unknown> {
  #nodes: Nod3Store<T> = new Nod3MemoryStore();
  #inEdges: Edg3Store<K> = new Edg3MemoryStore();
  #outEdges: Edg3Store<K> = new Edg3MemoryStore();

  addNode(node: CreateNod3Input<T>): string {
    const id = generateId();
    this.#nodes.set(id, { id: id, ...node });
    this.#inEdges.init(id);
    this.#outEdges.init(id);
    return id;
  }

  addEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<K>) {
    if (!this.#nodes.has(from) || !this.#nodes.has(to)) {
      throw new Error(`Nodes from: ${from} or to: ${to} not exist`);
    }
    this.#outEdges.addEdge(from, to, data);
    this.#inEdges.addEdge(to, from, data);
    return this;
  }

  hasNode(id: Nod3Id): boolean {
    return this.#nodes.has(id);
  }

  getNode(id: Nod3Id): Nod3<T> | undefined {
    return this.#nodes.get(id);
  }

  readInEdges(id: Nod3Id): Edg3<K>[] {
    return this.#inEdges.readEdges(id);
  }

  readOutEdges(id: Nod3Id): Edg3<K>[] {
    return this.#outEdges.readEdges(id);
  }

  print(): void {
    for (const node of this.#nodes.values()) {
      console.log("-".repeat(72));
      console.log(`(${node.label}:${node.id})\n`);

      // Stampa gli archi in entrata
      const inEdges = this.#inEdges.readEdges(node.id);
      for (const edge of inEdges) {
        const inNode = this.#nodes.get(edge.out);
        if (inNode) {
          console.log(
            `\t(${node.label}:${node.id}) <-- ${edge.label} -- (${inNode.label}:${inNode.id})`
          );
        }
      }

      // Stampa gli archi in uscita
      const outEdges = this.#outEdges.readEdges(node.id);
      for (const edge of outEdges) {
        const outNode = this.#nodes.get(edge.out);
        if (outNode) {
          console.log(
            `\t(${node.label}:${node.id}) -- ${edge.label} -> (${outNode.label}:${outNode.id})`
          );
        }
      }
    }
  }
}
