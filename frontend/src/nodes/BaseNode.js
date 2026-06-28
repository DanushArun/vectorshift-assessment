// Renders a pipeline node from a reusable node definition.

import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { getTextNodeDimensions, getTextVariableHandles } from './textNodeLogic';

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

const getTextFieldValue = (definition, id, data) => {
  const textField = definition.fields.find((field) => field.name === 'text');

  return textField ? getFieldValue(textField, id, data) : '';
};

const getNodeHandles = (definition, id, data) => {
  if (definition.type !== 'text') {
    return definition.handles;
  }

  return [
    ...getTextVariableHandles(getTextFieldValue(definition, id, data)),
    ...definition.handles,
  ];
};

const getNodeStyle = (definition, id, data) => {
  if (definition.type !== 'text') {
    return undefined;
  }

  const dimensions = getTextNodeDimensions(getTextFieldValue(definition, id, data));

  return {
    width: `${dimensions.width}px`,
    minHeight: `${dimensions.minHeight}px`,
  };
};

const getTextAreaStyle = (value) => ({
  height: `${getTextNodeDimensions(value).textAreaHeight}px`,
});

const SelectField = ({ field, onChange, value }) => (
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

const TextAreaField = ({ field, onChange, value }) => (
  <label className="node-field">
    <span>{field.label}</span>
    <textarea
      value={value}
      onChange={(event) => onChange(field.name, event.target.value)}
      style={getTextAreaStyle(value)}
    />
  </label>
);

const TextField = ({ field, onChange, value }) => (
  <label className="node-field">
    <span>{field.label}</span>
    <input value={value} onChange={(event) => onChange(field.name, event.target.value)} />
  </label>
);

const NodeField = ({ field, id, data, onChange }) => {
  const value = getFieldValue(field, id, data);

  if (field.kind === 'select') {
    return <SelectField field={field} onChange={onChange} value={value} />;
  }

  if (field.kind === 'textarea') {
    return <TextAreaField field={field} onChange={onChange} value={value} />;
  }

  return <TextField field={field} onChange={onChange} value={value} />;
};

const NodeHandles = ({ id, handles }) => {
  return (
    <>
      {handles.map((handle) => (
        <Handle
          key={`${handle.type}-${handle.position}-${handle.id}`}
          type={handle.type}
          position={positionByName[handle.position]}
          id={`${id}-${handle.id}`}
          style={handle.top ? { top: handle.top } : undefined}
        />
      ))}
    </>
  );
};

export const BaseNode = ({ id, data, definition }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateField = (fieldName, fieldValue) => {
    updateNodeField(id, fieldName, fieldValue);
  };
  const tone = definition.tone || 'neutral';
  const handles = getNodeHandles(definition, id, data);

  return (
    <div
      className={`pipeline-node pipeline-node--${tone}`}
      style={getNodeStyle(definition, id, data)}
    >
      <NodeHandles id={id} handles={handles} />
      <div className="pipeline-node__header">
        <span className="pipeline-node__accent" aria-hidden="true" />
        <span className="pipeline-node__title">{definition.label}</span>
      </div>
      <div className="pipeline-node__body">
        {definition.description && (
          <p className="pipeline-node__description">{definition.description}</p>
        )}
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
