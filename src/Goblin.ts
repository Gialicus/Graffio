import { Graffio } from "./Graffio";
import { Nod3Id, Nod3 } from "./Nod3";
import { Edg3 } from "./Edg3";

export class Goblin<T, K> {
  private graffio: Graffio<T, K>;
  private currentNodes: Nod3Id[];

  constructor(graffio: Graffio<T, K>) {
    this.graffio = graffio;
    this.currentNodes = [];
  }

  // Start the traversal with a specific node ID
  start(id: Nod3Id): this {
    if (this.graffio.hasNode(id)) {
      this.currentNodes = [id];
    } else {
      throw new Error(`Node with ID ${id} does not exist.`);
    }
    return this;
  }

  // Traverse outgoing edges
  out(): this {
    const nextNodes: Set<Nod3Id> = new Set();
    for (const nodeId of this.currentNodes) {
      const outEdges = this.graffio.readOutEdges(nodeId);
      if (outEdges) {
        for (const edge of outEdges) {
          nextNodes.add(edge.out);
        }
      }
    }
    this.currentNodes = Array.from(nextNodes); // Convert Set back to Array
    return this;
  }

  // Traverse incoming edges
  in(): this {
    const nextNodes: Set<Nod3Id> = new Set();
    for (const nodeId of this.currentNodes) {
      const inEdges = this.graffio.readInEdges(nodeId);
      if (inEdges) {
        for (const edge of inEdges) {
          nextNodes.add(edge.out);
        }
      }
    }
    this.currentNodes = Array.from(nextNodes); // Convert Set back to Array
    return this;
  }

  // Filter nodes based on a predicate
  filter(predicate: (node: Nod3<T>) => boolean): this {
    this.currentNodes = this.currentNodes.filter((id) => {
      const node = this.graffio.getNode(id);
      return node ? predicate(node) : false;
    });
    return this;
  }

  // Get the current nodes
  getNodes(): Nod3<T>[] {
    return this.currentNodes
      .map((id) => this.graffio.getNode(id))
      .filter((node): node is Nod3<T> => node !== undefined); // Type guard
  }

  // Get the IDs of the current nodes
  getNodeIds(): Nod3Id[] {
    return this.currentNodes;
  }
}
