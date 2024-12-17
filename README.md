# Graffio Graph Library

## Overview

This library provides a simple and efficient way to create and manipulate graphs in TypeScript. It allows users to add nodes and edges, query the graph, and perform various operations such as filtering and navigating through the graph's structure.

## Features

- **Add Nodes**: Easily add nodes to the graph with associated labels and values.
- **Add Edges**: Create directed edges between nodes with customizable labels.
- **Querying**: Retrieve nodes based on their IDs or labels, and filter nodes based on specific criteria.
- **Navigation**: Navigate through the graph using incoming and outgoing edges.
- **Count Nodes and Edges**: Get the total number of nodes and edges in the graph.
- **Check Existence**: Verify if a node or edge exists in the graph.

## Usage

```typescript
import { Graffio } from 'graffio/Graffio';
import { Query } from 'graffio/Query';
// Create a new graph
const graffio = new Graffio<number, number>();
// Add nodes
const id1 = graffio.addNode({ label: "Alice", value: 1 });
const id2 = graffio.addNode({ label: "Bob", value: 2 });
// Add an edge
graffio.addEdge(id1, id2, { label: "knows" });
// Create a query instance
const query = new Query(graffio);
// Query nodes
const result = query.byId(id1).toList();
console.log(result); // Outputs the node with ID id1
// Navigate through the graph
const outgoingNodes = query.byId(id1).out().toIdList();
console.log(outgoingNodes); // Outputs the IDs of nodes that id1 points to
```

## API Reference

### Classes

- **Graffio**
  - `addNode(node: CreateNod3Input<T>): string`
  - `addEdge(from: Nod3Id, to: Nod3Id, data: CreateEdg3Input<K>): void`
  - `print(): void`

- **Query**
  - `byId(id: Nod3Id): this`
  - `byLabel(label: string): this`
  - `whereNodes(predicate: (node: Nod3<T>) => boolean): this`
  - `whereInEdges(predicate: (edge: Edg3<K>) => boolean): this`
  - `whereOutEdges(predicate: (edge: Edg3<K>) => boolean): this`
  - `out(): this`
  - `in(): this`
  - `filter(predicate: (node: Nod3<T>) => boolean): this`
  - `countNodes(): number`
  - `countEdges(): number`
  - `hasNode(nodeId: string): boolean`
  - `hasInEdge(source: string, target: string): boolean`
  - `hasOutEdge(source: string, target: string): boolean`
  - `toList(): Nod3<T>[]`
  - `toIdList(): string[]`

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.