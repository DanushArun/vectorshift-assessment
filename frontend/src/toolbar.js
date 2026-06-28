// toolbar.js

import { DraggableNode } from './draggableNode';
import { nodeDefinitions } from './nodes/nodeDefinitions';

export const PipelineToolbar = () => {
  return (
    <aside className="node-palette" aria-label="Node palette">
      <div className="node-palette__header">
        <span className="node-palette__title">Nodes</span>
        <span className="node-palette__count">{nodeDefinitions.length}</span>
      </div>
      <div className="node-palette__grid" role="list" aria-label="Available nodes">
        {nodeDefinitions.map((node) => (
          <DraggableNode
            key={node.type}
            type={node.type}
            label={node.label}
            tone={node.tone}
          />
        ))}
      </div>
    </aside>
  );
};
