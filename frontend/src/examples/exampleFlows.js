// Provides isolated starter pipelines for the builder canvas.

import { MarkerType } from 'reactflow';

const edgeDefaults = {
  type: 'smoothstep',
  animated: true,
  interactionWidth: 16,
  markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' },
};

const defaultDataByType = {
  customInput: (index) => ({ inputName: `input_${index}`, inputType: 'Text' }),
  text: () => ({ text: '{{input}}' }),
  prompt: () => ({ instruction: 'Summarize the input' }),
  knowledgeBase: () => ({ collection: 'docs' }),
  filter: () => ({ condition: 'contains keyword' }),
  transform: () => ({ format: 'JSON' }),
  apiRequest: () => ({ method: 'POST', url: 'https://api.example.com' }),
  customOutput: (index) => ({ outputName: `output_${index}`, outputType: 'Text' }),
};

const getDefaultData = (type, index) => {
  return defaultDataByType[type]?.(index) || {};
};

const createNode = ({ type, index = 1, x, y, data = {} }) => {
  const id = `${type}-${index}`;

  return {
    id,
    type,
    position: { x, y },
    data: { id, nodeType: type, ...getDefaultData(type, index), ...data },
  };
};

const createEdge = ({ source, sourceHandle, target, targetHandle }) => {
  return {
    id: `${source}-${sourceHandle}-to-${target}-${targetHandle}`,
    source,
    target,
    sourceHandle: `${source}-${sourceHandle}`,
    targetHandle: `${target}-${targetHandle}`,
    ...edgeDefaults,
  };
};

const connectSummaryFlow = () => [
  createEdge({
    source: 'customInput-1',
    sourceHandle: 'value',
    target: 'prompt-1',
    targetHandle: 'context',
  }),
  createEdge({
    source: 'text-1',
    sourceHandle: 'output',
    target: 'llm-1',
    targetHandle: 'system',
  }),
  createEdge({
    source: 'prompt-1',
    sourceHandle: 'prompt',
    target: 'llm-1',
    targetHandle: 'prompt',
  }),
  createEdge({
    source: 'llm-1',
    sourceHandle: 'response',
    target: 'customOutput-1',
    targetHandle: 'value',
  }),
];

const connectKnowledgeFlow = () => [
  createEdge({
    source: 'customInput-1',
    sourceHandle: 'value',
    target: 'knowledgeBase-1',
    targetHandle: 'query',
  }),
  createEdge({
    source: 'knowledgeBase-1',
    sourceHandle: 'context',
    target: 'prompt-1',
    targetHandle: 'context',
  }),
  createEdge({
    source: 'text-1',
    sourceHandle: 'output',
    target: 'llm-1',
    targetHandle: 'system',
  }),
  createEdge({
    source: 'prompt-1',
    sourceHandle: 'prompt',
    target: 'llm-1',
    targetHandle: 'prompt',
  }),
  createEdge({
    source: 'llm-1',
    sourceHandle: 'response',
    target: 'customOutput-1',
    targetHandle: 'value',
  }),
];

const connectRoutingFlow = () => [
  createEdge({
    source: 'customInput-1',
    sourceHandle: 'value',
    target: 'filter-1',
    targetHandle: 'input',
  }),
  createEdge({
    source: 'filter-1',
    sourceHandle: 'approved',
    target: 'transform-1',
    targetHandle: 'input',
  }),
  createEdge({
    source: 'transform-1',
    sourceHandle: 'output',
    target: 'customOutput-1',
    targetHandle: 'value',
  }),
  createEdge({
    source: 'filter-1',
    sourceHandle: 'rejected',
    target: 'customOutput-2',
    targetHandle: 'value',
  }),
];

const connectApiFlow = () => [
  createEdge({
    source: 'customInput-1',
    sourceHandle: 'value',
    target: 'apiRequest-1',
    targetHandle: 'payload',
  }),
  createEdge({
    source: 'apiRequest-1',
    sourceHandle: 'response',
    target: 'transform-1',
    targetHandle: 'input',
  }),
  createEdge({
    source: 'transform-1',
    sourceHandle: 'output',
    target: 'customOutput-1',
    targetHandle: 'value',
  }),
];

const buildNodeIDs = (nodes) => {
  return nodes.reduce((ids, node) => {
    const [, index] = node.id.split('-');
    const numericIndex = Number(index);

    return {
      ...ids,
      [node.type]: Math.max(ids[node.type] || 0, numericIndex),
    };
  }, {});
};

const cloneNode = (node) => ({
  ...node,
  position: { ...node.position },
  data: { ...node.data },
});

const cloneEdge = (edge) => ({
  ...edge,
  markerEnd: { ...edge.markerEnd },
});

const summaryNodes = [
  createNode({ type: 'customInput', x: 40, y: 230 }),
  createNode({ type: 'text', x: 420, y: 40, data: { text: 'System: be concise' } }),
  createNode({ type: 'prompt', x: 420, y: 300 }),
  createNode({ type: 'llm', x: 820, y: 200 }),
  createNode({ type: 'customOutput', x: 1200, y: 220 }),
];

const knowledgeNodes = [
  createNode({ type: 'customInput', x: 40, y: 220 }),
  createNode({ type: 'knowledgeBase', x: 420, y: 190 }),
  createNode({ type: 'text', x: 420, y: 430, data: { text: 'Use retrieved context only' } }),
  createNode({ type: 'prompt', x: 800, y: 190 }),
  createNode({ type: 'llm', x: 1180, y: 230 }),
  createNode({ type: 'customOutput', x: 1560, y: 230 }),
];

const routingNodes = [
  createNode({ type: 'customInput', x: 40, y: 240 }),
  createNode({ type: 'filter', x: 420, y: 220 }),
  createNode({ type: 'transform', x: 820, y: 80 }),
  createNode({ type: 'customOutput', x: 1200, y: 80 }),
  createNode({ type: 'customOutput', index: 2, x: 1200, y: 360 }),
];

const apiNodes = [
  createNode({ type: 'customInput', x: 40, y: 200 }),
  createNode({ type: 'apiRequest', x: 420, y: 180 }),
  createNode({ type: 'transform', x: 820, y: 180 }),
  createNode({ type: 'customOutput', x: 1200, y: 180 }),
];

export const exampleFlows = [
  {
    id: 'summary',
    label: 'Summarization',
    nodes: summaryNodes,
    edges: connectSummaryFlow(),
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    nodes: knowledgeNodes,
    edges: connectKnowledgeFlow(),
  },
  {
    id: 'routing',
    label: 'Routing',
    nodes: routingNodes,
    edges: connectRoutingFlow(),
  },
  {
    id: 'api',
    label: 'API',
    nodes: apiNodes,
    edges: connectApiFlow(),
  },
];

const getExampleFlow = (flowId) => {
  return exampleFlows.find((flow) => flow.id === flowId) || exampleFlows[0];
};

export const createExampleFlowState = (flowId = exampleFlows[0].id) => {
  const flow = getExampleFlow(flowId);

  return {
    activeExampleFlowId: flow.id,
    nodes: flow.nodes.map(cloneNode),
    edges: flow.edges.map(cloneEdge),
    nodeIDs: buildNodeIDs(flow.nodes),
  };
};
