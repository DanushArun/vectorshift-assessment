// Owns pipeline graph state for React Flow.

import { createWithEqualityFn } from 'zustand/traditional';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';
import { createExampleFlowState } from './examples/exampleFlows';

const initialFlow = createExampleFlowState();

export const useStore = createWithEqualityFn((set, get) => ({
  nodes: initialFlow.nodes,
  edges: initialFlow.edges,
  nodeIDs: initialFlow.nodeIDs,
  activeExampleFlowId: initialFlow.activeExampleFlowId,
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };

    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }

    newIDs[type] += 1;
    set({ nodeIDs: newIDs });

    return `${type}-${newIDs[type]}`;
  },
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  loadExampleFlow: (flowId) => {
    set(createExampleFlowState(flowId));
  },
  startBlankFlow: () => {
    set({
      nodes: [],
      edges: [],
      nodeIDs: {},
      activeExampleFlowId: 'blank',
    });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge({
        ...connection,
        type: 'smoothstep',
        animated: true,
        interactionWidth: 16,
        markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' },
      }, get().edges),
    });
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id !== nodeId) {
          return node;
        }

        return {
          ...node,
          data: { ...node.data, [fieldName]: fieldValue },
        };
      }),
    });
  },
}));
