// toolbar.js

import { DraggableNode } from './draggableNode';
import { nodeDefinitions } from './nodes/nodeDefinitions';

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {nodeDefinitions.map((node) => (
                    <DraggableNode key={node.type} type={node.type} label={node.label} />
                ))}
            </div>
        </div>
    );
};
