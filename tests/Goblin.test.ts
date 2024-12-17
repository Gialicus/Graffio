import { Graffio } from "../src/Graffio";
import { Goblin } from "../src/Goblin";

describe("Goblin", () => {
  let graffio: Graffio<number, number>;
  let goblin: Goblin<number, number>;
  let id1: string;
  let id2: string;
  let id3: string;

  beforeEach(() => {
    graffio = new Graffio<number, number>();
    goblin = new Goblin(graffio);

    id1 = graffio.addNode({ label: "Alice", value: 1 });
    id2 = graffio.addNode({ label: "Bob", value: 2 });
    id3 = graffio.addNode({ label: "Charlie", value: 3 });

    graffio.addEdge(id1, id2, { label: "knows" });
    graffio.addEdge(id2, id3, { label: "knows" });
  });

  describe("start", () => {
    it("should initialize with a specific node ID", () => {
      goblin.start(id1);
      expect(goblin.getNodeIds()).toEqual([id1]);
    });

    it("should throw an error if the node does not exist", () => {
      expect(() => goblin.start("invalidId")).toThrow(
        "Node with ID invalidId does not exist."
      );
    });
  });

  describe("out", () => {
    it("should traverse to outgoing nodes", () => {
      goblin.start(id1).out();
      expect(goblin.getNodeIds()).toEqual([id2]);
    });

    it("should return an empty list if there are no outgoing nodes", () => {
      goblin.start(id3).out();
      expect(goblin.getNodeIds()).toEqual([]);
    });
  });

  describe("in", () => {
    it("should traverse to incoming nodes", () => {
      goblin.start(id2).in();
      expect(goblin.getNodeIds()).toEqual([id1]);
    });

    it("should return an empty list if there are no incoming nodes", () => {
      goblin.start(id1).in();
      expect(goblin.getNodeIds()).toEqual([]);
    });
  });

  describe("filter", () => {
    it("should filter nodes based on a predicate", () => {
      goblin
        .start(id1)
        .out()
        .filter((node) => node.value > 1);
      expect(goblin.getNodeIds()).toEqual([id2]);
    });

    it("should return an empty list if no node satisfies the predicate", () => {
      goblin
        .start(id1)
        .out()
        .filter((node) => node.value > 3);
      expect(goblin.getNodeIds()).toEqual([]);
    });
  });

  describe("getNodes", () => {
    it("should return the current nodes", () => {
      goblin.start(id1).out();
      const nodes = goblin.getNodes();
      expect(nodes).toHaveLength(1);
      expect(nodes[0].id).toBe(id2);
    });
  });

  afterAll(() => {
    graffio.print();
  });
});
