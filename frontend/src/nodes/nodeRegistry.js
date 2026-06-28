// Builds the nodeTypes map React Flow uses to render each configured node.

import { BaseNode } from './BaseNode';
import { nodeDefinitions } from './nodeDefinitions';

const createNodeComponent = (definition) => {
  const NodeComponent = ({ id, data }) => (
    <BaseNode id={id} data={data} definition={definition} />
  );

  NodeComponent.displayName = `${definition.label}Node`;
  return NodeComponent;
};

export const nodeTypes = Object.fromEntries(
  nodeDefinitions.map((definition) => [definition.type, createNodeComponent(definition)])
);
