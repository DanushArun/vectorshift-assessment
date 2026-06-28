// Displays the drag-and-drop pipeline canvas.

import { useCallback, useRef, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { getNodeDefinition } from './nodes/nodeDefinitions';
import { nodeTypes } from './nodes/nodeRegistry';
import { useStore } from './store';

const gridSize = 20;
const gridDotColor = '#bfb7a4';
const proOptions = { hideAttribution: true };
const fitViewOptions = { maxZoom: 1, padding: 0.2 };

const miniMapColors = {
  input: '#5b4824',
  ai: '#14245a',
  output: '#7a6129',
  logic: '#6f5b34',
  data: '#54585f',
  integration: '#20242c',
  neutral: '#8b867d',
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

const getFieldInitValue = (field, nodeID) => {
  if (!field.defaultFromId) {
    return field.defaultValue || '';
  }

  return nodeID.replace(`${field.defaultFromId}-`, field.prefix || '');
};

const getInitNodeData = (nodeID, type) => {
  const definition = getNodeDefinition(type);
  const fieldData = Object.fromEntries(
    (definition?.fields || []).map((field) => [field.name, getFieldInitValue(field, nodeID)])
  );

  return { id: nodeID, nodeType: type, ...fieldData };
};

const getDraggedNodeType = (event) => {
  const rawData = event?.dataTransfer?.getData('application/reactflow');

  if (!rawData) {
    return null;
  }

  try {
    return JSON.parse(rawData)?.nodeType || null;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return null;
    }

    throw error;
  }
};

const getDropPosition = ({ event, instance, wrapper }) => {
  const reactFlowBounds = wrapper.getBoundingClientRect();

  return instance.project({
    x: event.clientX - reactFlowBounds.left,
    y: event.clientY - reactFlowBounds.top,
  });
};

const getMiniMapNodeColor = (node) => {
  const tone = getNodeDefinition(node.type)?.tone || 'neutral';

  return miniMapColors[tone] || miniMapColors.neutral;
};

const useNodeDrop = ({ flowState, reactFlowInstance, reactFlowWrapper }) => {
  const { addNode, getNodeID } = flowState;

  return useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const type = getDraggedNodeType(event);

      if (!type) {
        return;
      }

      const position = getDropPosition({
        event,
        instance: reactFlowInstance,
        wrapper: reactFlowWrapper.current,
      });
      const nodeID = getNodeID(type);

      addNode({
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      });
    },
    [addNode, getNodeID, reactFlowInstance, reactFlowWrapper]
  );
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const flowState = useStore(selector, shallow);
  const onDrop = useNodeDrop({ flowState, reactFlowInstance, reactFlowWrapper });
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="canvas-shell" ref={reactFlowWrapper}>
      <ReactFlow
        className="pipeline-flow"
        nodes={flowState.nodes}
        edges={flowState.edges}
        onNodesChange={flowState.onNodesChange}
        onEdgesChange={flowState.onEdgesChange}
        onConnect={flowState.onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        fitViewOptions={fitViewOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        fitView
      >
        <Background color={gridDotColor} gap={gridSize} />
        <Controls />
        <MiniMap
          maskColor="rgba(255, 254, 251, 0.72)"
          maskStrokeColor="rgba(91, 72, 36, 0.18)"
          nodeBorderRadius={4}
          nodeColor={getMiniMapNodeColor}
          nodeStrokeColor="#fffefb"
          nodeStrokeWidth={2}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
};
