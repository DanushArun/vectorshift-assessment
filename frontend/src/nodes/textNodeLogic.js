const variablePattern = /{{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*}}/g;

const textNodeSize = {
  minWidth: 240,
  maxWidth: 440,
  minHeight: 156,
  maxHeight: 360,
  minTextAreaHeight: 42,
  maxTextAreaHeight: 220,
  charWidth: 8,
  widthPadding: 120,
  rowHeight: 22,
  rowsBeforeWrap: 42,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const toText = (value) => String(value || '');

const getVisualRows = (text) => {
  return toText(text)
    .split('\n')
    .reduce(
      (rows, line) => rows + Math.max(1, Math.ceil(line.length / textNodeSize.rowsBeforeWrap)),
      0
    );
};

const getLongestLineLength = (text) => {
  return Math.max(...toText(text).split('\n').map((line) => line.length), 0);
};

export const extractTextVariables = (text) => {
  const variables = [];
  const seenVariables = new Set();

  for (const match of toText(text).matchAll(variablePattern)) {
    const variableName = match[1];

    if (!seenVariables.has(variableName)) {
      variables.push(variableName);
      seenVariables.add(variableName);
    }
  }

  return variables;
};

export const getTextNodeDimensions = (text) => {
  const visualRows = getVisualRows(text);
  const longestLineLength = getLongestLineLength(text);
  const width = longestLineLength * textNodeSize.charWidth + textNodeSize.widthPadding;
  const minHeight = textNodeSize.minHeight + (visualRows - 1) * textNodeSize.rowHeight;
  const textAreaHeight = textNodeSize.minTextAreaHeight + (visualRows - 1) * textNodeSize.rowHeight;

  return {
    width: clamp(width, textNodeSize.minWidth, textNodeSize.maxWidth),
    minHeight: clamp(minHeight, textNodeSize.minHeight, textNodeSize.maxHeight),
    textAreaHeight: clamp(
      textAreaHeight,
      textNodeSize.minTextAreaHeight,
      textNodeSize.maxTextAreaHeight
    ),
  };
};

export const getTextVariableHandles = (text) => {
  const variables = extractTextVariables(text);

  return variables.map((variableName, index) => ({
    type: 'target',
    position: 'left',
    id: variableName,
    top: `${Math.round(((index + 1) / (variables.length + 1)) * 100)}%`,
  }));
};
