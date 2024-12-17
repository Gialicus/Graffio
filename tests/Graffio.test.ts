import { InnerEdg3MemoryStore } from "../src/Edg3Store";
import { Graffio } from "../src/Graffio";

describe("Graffio", () => {
  let graffio: Graffio<number, number>;

  beforeEach(() => {
    graffio = new Graffio<number, number>();
  });

  describe("addNode", () => {
    it("should add a node correctly", () => {
      const id = graffio.addNode({ label: "test", value: 1 });
      expect(graffio.nodeStore.has(id)).toBeTruthy();
      expect(graffio.nodeStore.get(id)).toEqual({
        id: id,
        label: "test",
        value: 1,
      });
    });

    it("should initialize edge store istance", () => {
      const id = graffio.addNode({ label: "test", value: 1 });
      expect(graffio.inEdges.get(id)).toBeInstanceOf(InnerEdg3MemoryStore);
      expect(graffio.outEdges.get(id)).toBeInstanceOf(InnerEdg3MemoryStore);
    });
  });

  describe("addEdge", () => {
    it("should add an edge between two nodes", () => {
      const id1 = graffio.addNode({ label: "node1", value: 1 });
      const id2 = graffio.addNode({ label: "node2", value: 2 });

      graffio.addEdge(id1, id2, { label: "connects" });

      expect(graffio.inEdges.get(id2)?.get(id1)).toBeDefined();
      expect(graffio.outEdges.get(id1)?.get(id2)).toBeDefined();
    });

    it("should throw an error if nodes do not exist", () => {
      expect(() => {
        graffio.addEdge("invalid1", "invalid2", { label: "connects" });
      }).toThrow("Nodes from: invalid1 or to: invalid2 not exist");
    });
  });

  describe("print", () => {
    it("should print nodes and edges correctly", () => {
      console.log = jest.fn();

      const id1 = graffio.addNode({ label: "A", value: 1 });
      const id2 = graffio.addNode({ label: "B", value: 2 });

      graffio.addEdge(id1, id2, { label: "connected to" });

      graffio.print();

      expect(console.log).toHaveBeenCalledWith("-".repeat(72));
      expect(console.log).toHaveBeenCalledWith(`(A:${id1})\n`);
      expect(console.log).toHaveBeenCalledWith(
        `\t(A:${id1}) -- connected to -> (B:${id2})`
      );
      expect(console.log).toHaveBeenCalledWith("-".repeat(72));
      expect(console.log).toHaveBeenCalledWith(`(B:${id2})\n`);
    });
  });
});
