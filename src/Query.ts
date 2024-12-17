import { Edg3 } from "./Edg3";
import { Graffio } from "./Graffio";
import { Nod3Id, Nod3 } from "./Nod3";

export class Query<T = unknown, K = unknown> {
  private currentNodes: Set<Nod3Id> = new Set();
  constructor(private graffio: Graffio<T, K>) {}

  byId(id: Nod3Id) {
    if (!this.graffio.nodeStore.has(id)) {
      throw new Error("Node doesnt exists");
    }
    this.currentNodes.add(id);
    return this;
  }

  byLabel(label: string) {
    for (const node of this.graffio.nodeStore.values()) {
      if (node.label !== label) continue;
      this.byId(node.id);
    }
    return this;
  }

  whereNodes(predicate: (node: Nod3<T>) => boolean) {
    for (const node of this.graffio.nodeStore.values()) {
      if (predicate(node)) {
        this.byId(node.id);
      }
    }
    return this;
  }

  whereInEdges(predicate: (edge: Edg3<K>) => boolean) {
    for (const edges of this.graffio.inEdges.values()) {
      for (const edge of edges.values()) {
        if (predicate(edge)) {
          this.byId(edge.in);
        }
      }
    }
    return this;
  }

  whereOutEdges(predicate: (edge: Edg3<K>) => boolean) {
    for (const edges of this.graffio.outEdges.values()) {
      for (const edge of edges.values()) {
        if (predicate(edge)) {
          this.byId(edge.in);
        }
      }
    }
    return this;
  }

  out() {
    const nextNodes = new Set<string>();
    for (const node of this.currentNodes) {
      const neighbors = this.graffio.outEdges.get(node)!.values();
      for (const neig of neighbors) {
        nextNodes.add(neig.out);
      }
    }
    this.currentNodes = nextNodes;
    return this;
  }

  in() {
    const nextNodes = new Set<string>();
    for (const node of this.currentNodes) {
      const neighbors = this.graffio.inEdges.get(node)!.values();
      for (const neig of neighbors) {
        nextNodes.add(neig.in);
      }
    }
    this.currentNodes = nextNodes;
    return this;
  }

  filter(predicate: (node: Nod3<T>) => boolean): this {
    const filteredNodes = new Set<string>();
    for (const node of this.currentNodes) {
      const currentNode = this.graffio.nodeStore.get(node);
      if (currentNode && predicate(currentNode)) {
        filteredNodes.add(node);
      }
    }
    this.currentNodes = filteredNodes;
    return this;
  }

  countNodes(): number {
    return this.graffio.nodeStore.size();
  }

  countEdges(): number {
    let count = 0;
    for (const edges of this.graffio.inEdges.values()) {
      count += edges.size();
    }
    for (const edges of this.graffio.outEdges.values()) {
      count += edges.size();
    }
    return count;
  }

  hasNode(nodeId: string): boolean {
    return this.graffio.nodeStore.has(nodeId);
  }

  hasInEdge(source: string, target: string): boolean {
    return (
      this.graffio.inEdges.has(source) &&
      this.graffio.inEdges.get(source)!.has(target)
    );
  }

  hasOutEdge(source: string, target: string): boolean {
    return (
      this.graffio.outEdges.has(source) &&
      this.graffio.outEdges.get(source)!.has(target)
    );
  }

  toList(): Nod3<T>[] {
    return Array.from(this.currentNodes).map(
      (id) => this.graffio.nodeStore.get(id)!
    );
  }

  toIdList(): string[] {
    return Array.from(this.currentNodes);
  }
}
