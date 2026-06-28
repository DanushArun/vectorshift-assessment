// draggableNode.js

const toneLabels = {
  input: 'Input',
  ai: 'AI',
  output: 'Output',
  logic: 'Logic',
  data: 'Data',
  integration: 'API',
};

export const DraggableNode = ({ type, label, tone = 'neutral' }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };

    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      aria-label={`Drag ${label} node to canvas`}
      className={`node-tile node-tile--${tone}`}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
      role="listitem"
      tabIndex={0}
    >
      <span className="node-tile__label">{label}</span>
      <span className="node-tile__meta">{toneLabels[tone] || 'Node'}</span>
    </div>
  );
};
