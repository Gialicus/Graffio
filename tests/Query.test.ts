import { Graffio } from "../src/Graffio";
import { Query } from "../src/Query";

describe("Query", () => {
  let graffio: Graffio<number, number>;
  let query: Query<number, number>;
  let id1: string;
  let id2: string;
  let id3: string;

  beforeEach(() => {
    graffio = new Graffio<number, number>();
    query = new Query(graffio);

    id1 = graffio.addNode({ label: "person1", value: 1 });
    id2 = graffio.addNode({ label: "person2", value: 2 });
    id3 = graffio.addNode({ label: "person3", value: 3 });

    graffio.addEdge(id1, id2, { label: "knows" });
    graffio.addEdge(id2, id3, { label: "knows" });
  });

  describe("byId", () => {
    it("should select a node by id", () => {
      const result = query.byId(id1).toList();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(id1);
    });

    it("should throw an error if the node does not exist", () => {
      expect(() => {
        query.byId("invalidId");
      }).toThrow("Node doesnt exists");
    });
  });

  describe("byLabel", () => {
    it("should select nodes by label", () => {
      query.byLabel("person1");
      const result = query.toList();
      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("person1");
    });
  });

  describe("whereNodes", () => {
    it("should select nodes that satisfy the predicate", () => {
      const result = query.whereNodes((node) => node.value > 1).toList();
      expect(result).toHaveLength(2);
      expect(result.map((n) => n.id)).toEqual([id2, id3]);
    });
  });

  describe("whereInEdges", () => {
    it("should select nodes based on incoming edges", () => {
      const result = query
        .whereInEdges((edge) => edge.label === "knows")
        .toList();
      expect(result).toHaveLength(2);
      expect(result.map((n) => n.id)).toEqual([id1, id2]);
    });
  });

  describe("whereOutEdges", () => {
    it("should select nodes based on outgoing edges", () => {
      const result = query
        .whereOutEdges((edge) => edge.label === "knows")
        .toList();
      expect(result).toHaveLength(2);
      expect(result.map((n) => n.id)).toEqual([id1, id2]);
    });
  });

  describe("out", () => {
    it("should navigate to the outgoing nodes", () => {
      query.byId(id1);
      query.out();
      const result = query.toIdList();
      expect(result).toEqual([id2]);
    });

    it("should return an empty list if there are no outgoing nodes", () => {
      query.byId(id3);
      query.out();
      const result = query.toIdList();
      expect(result).toEqual([]);
    });
  });

  describe("in", () => {
    it("should navigate to the incoming nodes", () => {
      query.byId(id2);
      query.in();
      const result = query.toIdList();
      expect(result).toEqual([id1]);
    });

    it("should return an empty list if there are no incoming nodes", () => {
      query.byId(id1);
      query.in();
      const result = query.toIdList();
      expect(result).toEqual([]);
    });
  });

  describe("filter", () => {
    it("should filter nodes based on the predicate", () => {
      const result = query
        .byLabel("person1")
        .filter((node) => node.value > 0)
        .toList();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(id1);
    });

    it("should return an empty array if no node satisfies the predicate", () => {
      const result = query
        .byLabel("person1")
        .filter((node) => node.value > 3)
        .toList();
      expect(result).toHaveLength(0);
    });
  });

  describe("countNodes", () => {
    it("should return the correct number of nodes", () => {
      expect(query.countNodes()).toBe(3);
    });
  });

  describe("countEdges", () => {
    it("should return the correct number of edges", () => {
      expect(query.countEdges()).toBe(4);
    });
  });

  describe("hasNode", () => {
    it("should return true if the node exists", () => {
      expect(query.hasNode(id1)).toBeTruthy();
    });

    it("should return false if the node does not exist", () => {
      expect(query.hasNode("invalidId")).toBeFalsy();
    });
  });

  describe("hasInEdge", () => {
    it("should return true if there is an incoming edge", () => {
      expect(query.hasInEdge(id2, id1)).toBeTruthy();
    });

    it("should return false if there is no incoming edge", () => {
      expect(query.hasInEdge(id3, id1)).toBeFalsy();
    });
  });

  describe("hasOutEdge", () => {
    it("should return true if there is an outgoing edge", () => {
      expect(query.hasOutEdge(id1, id2)).toBeTruthy();
    });

    it("should return false if there is no outgoing edge", () => {
      expect(query.hasOutEdge(id2, id1)).toBeFalsy();
    });
  });

  describe("toList", () => {
    it("should return an array of currently selected nodes", () => {
      query.byId(id1).byId(id2);
      const result = query.toList();
      expect(result).toHaveLength(2);
      expect(result.map((n) => n.id)).toEqual([id1, id2]);
    });
  });

  describe("toIdList", () => {
    it("should return an array of IDs of the currently selected nodes", () => {
      query.byId(id1).byId(id2);
      const result = query.toIdList();
      expect(result).toEqual([id1, id2]);
    });

    it("should return an empty array if there are no selected nodes", () => {
      const result = query.toIdList();
      expect(result).toEqual([]);
    });
  });
});
