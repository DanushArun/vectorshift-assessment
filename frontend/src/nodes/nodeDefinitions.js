// Defines every available pipeline node in one shared configuration list.

export const nodeDefinitions = [
  {
    type: 'customInput',
    label: 'Input',
    tone: 'input',
    description: 'Pipeline input',
    fields: [
      {
        name: 'inputName',
        label: 'Name',
        kind: 'text',
        defaultFromId: 'customInput',
        prefix: 'input_',
      },
      {
        name: 'inputType',
        label: 'Type',
        kind: 'select',
        defaultValue: 'Text',
        options: ['Text', 'File'],
      },
    ],
    handles: [{ type: 'source', position: 'right', id: 'value' }],
  },
  {
    type: 'llm',
    label: 'LLM',
    tone: 'ai',
    description: 'Generates a response from system and prompt inputs.',
    fields: [],
    handles: [
      { type: 'target', position: 'left', id: 'system', top: '33%' },
      { type: 'target', position: 'left', id: 'prompt', top: '67%' },
      { type: 'source', position: 'right', id: 'response' },
    ],
  },
  {
    type: 'customOutput',
    label: 'Output',
    tone: 'output',
    description: 'Pipeline output',
    fields: [
      {
        name: 'outputName',
        label: 'Name',
        kind: 'text',
        defaultFromId: 'customOutput',
        prefix: 'output_',
      },
      {
        name: 'outputType',
        label: 'Type',
        kind: 'select',
        defaultValue: 'Text',
        options: ['Text', 'Image'],
      },
    ],
    handles: [{ type: 'target', position: 'left', id: 'value' }],
  },
  {
    type: 'text',
    label: 'Text',
    tone: 'data',
    description: 'Template text for a prompt.',
    fields: [{ name: 'text', label: 'Text', kind: 'text', defaultValue: '{{input}}' }],
    handles: [{ type: 'source', position: 'right', id: 'output' }],
  },
  {
    type: 'prompt',
    label: 'Prompt',
    tone: 'ai',
    description: 'Combines instructions and context.',
    fields: [
      {
        name: 'instruction',
        label: 'Instruction',
        kind: 'text',
        defaultValue: 'Summarize the input',
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'context' },
      { type: 'source', position: 'right', id: 'prompt' },
    ],
  },
  {
    type: 'knowledgeBase',
    label: 'Knowledge Base',
    tone: 'data',
    description: 'Retrieves relevant context for a query.',
    fields: [{ name: 'collection', label: 'Collection', kind: 'text', defaultValue: 'docs' }],
    handles: [
      { type: 'target', position: 'left', id: 'query' },
      { type: 'source', position: 'right', id: 'context' },
    ],
  },
  {
    type: 'filter',
    label: 'Filter',
    tone: 'logic',
    description: 'Routes data that matches a condition.',
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        kind: 'text',
        defaultValue: 'contains keyword',
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'input' },
      { type: 'source', position: 'right', id: 'approved', top: '33%' },
      { type: 'source', position: 'right', id: 'rejected', top: '67%' },
    ],
  },
  {
    type: 'transform',
    label: 'Transform',
    tone: 'logic',
    description: 'Changes data into another format.',
    fields: [
      {
        name: 'format',
        label: 'Format',
        kind: 'select',
        defaultValue: 'JSON',
        options: ['JSON', 'Text', 'CSV'],
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'input' },
      { type: 'source', position: 'right', id: 'output' },
    ],
  },
  {
    type: 'apiRequest',
    label: 'API Request',
    tone: 'integration',
    description: 'Sends a payload to an external endpoint.',
    fields: [
      {
        name: 'method',
        label: 'Method',
        kind: 'select',
        defaultValue: 'POST',
        options: ['GET', 'POST', 'PUT'],
      },
      { name: 'url', label: 'URL', kind: 'text', defaultValue: 'https://api.example.com' },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'payload' },
      { type: 'source', position: 'right', id: 'response' },
    ],
  },
];

export const getNodeDefinition = (type) => {
  return nodeDefinitions.find((node) => node.type === type);
};
