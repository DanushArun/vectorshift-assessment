// Renders a pipeline node from a reusable node definition.

import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const positionByName = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

const getFieldDefault = (field, id) => {
  if (!field.defaultFromId) {
    return field.defaultValue || '';
  }

  return id.replace(`${field.defaultFromId}-`, field.prefix || '');
};

const getFieldValue = (field, id, data) => {
  return data?.[field.name] ?? getFieldDefault(field, id);
};

const NodeField = ({ field, id, data, onChange }) => {
  const value = getFieldValue(field, id, data);

  if (field.kind === 'select') {
    return (
      <label className="node-field">
        <span>{field.label}</span>
        <select value={value} onChange={(event) => onChange(field.name, event.target.value)}>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="node-field">
      <span>{field.label}</span>
      <input value={value} onChange={(event) => onChange(field.name, event.target.value)} />
    </label>
  );
};

const NodeHandles = ({ id, handles }) => {
  return handles.map((handle) => (
    <Handle
      key={`${handle.type}-${handle.position}-${handle.id}`}
      type={handle.type}
      position={positionByName[handle.position]}
      id={`${id}-${handle.id}`}
      style={handle.top ? { top: handle.top } : undefined}
    />
  ));
};

export const BaseNode = ({ id, data, definition }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateField = (fieldName, fieldValue) => {
    updateNodeField(id, fieldName, fieldValue);
  };

  return (
    <div className="pipeline-node">
      <NodeHandles id={id} handles={definition.handles} />
      <div className="pipeline-node__header">
        <span>{definition.label}</span>
      </div>
      <div className="pipeline-node__body">
        {definition.description && <p>{definition.description}</p>}
        {definition.fields.map((field) => (
          <NodeField
            key={field.name}
            field={field}
            id={id}
            data={data}
            onChange={updateField}
          />
        ))}
      </div>
    </div>
  );
};
