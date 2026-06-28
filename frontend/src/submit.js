// Renders the pipeline submit action.

import { exampleFlows } from './examples/exampleFlows';
import { useStore } from './store';

const parseEndpoint = 'http://localhost:8000/pipelines/parse';
const parseErrorMessage = 'Unable to parse pipeline. Please try again.';

const formatPipelineAlert = ({ num_nodes, num_edges, is_dag }) => (
  `Pipeline summary:\nNodes: ${num_nodes}\nEdges: ${num_edges}\nDAG: ${is_dag ? 'Yes' : 'No'}`
);

const parsePipeline = async ({ nodes, edges }) => {
  const response = await fetch(parseEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges }),
  });

  if (!response.ok) {
    throw new Error(`Pipeline parse failed with status ${response.status}`);
  }

  return response.json();
};

const getExampleButtonClass = (isActive) => (
  isActive ? 'example-button example-button--active' : 'example-button'
);

const ExampleSwitch = ({ activeExampleFlowId, loadExampleFlow, startBlankFlow }) => (
  <div className="example-switch" aria-label="Example flows">
    <span className="example-switch__label">Examples</span>
    <div className="example-switch__buttons">
      {exampleFlows.map((flow, index) => (
        <button
          key={flow.id}
          type="button"
          className={getExampleButtonClass(flow.id === activeExampleFlowId)}
          onClick={() => loadExampleFlow(flow.id)}
          aria-label={`Load example ${index + 1}: ${flow.label}`}
        >
          {index + 1}
        </button>
      ))}
      <button
        type="button"
        className={getExampleButtonClass(activeExampleFlowId === 'blank')}
        onClick={startBlankFlow}
        aria-label="Start blank pipeline"
      >
        +
      </button>
    </div>
  </div>
);

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const activeExampleFlowId = useStore((state) => state.activeExampleFlowId);
  const loadExampleFlow = useStore((state) => state.loadExampleFlow);
  const startBlankFlow = useStore((state) => state.startBlankFlow);
  const submitPipeline = async () => {
    try {
      const result = await parsePipeline({ nodes, edges });
      window.alert(formatPipelineAlert(result));
    } catch {
      window.alert(parseErrorMessage);
    }
  };

  return (
    <footer className="submit-bar">
      <ExampleSwitch
        activeExampleFlowId={activeExampleFlowId}
        loadExampleFlow={loadExampleFlow}
        startBlankFlow={startBlankFlow}
      />
      <button
        className="submit-button"
        type="button"
        onClick={submitPipeline}
      >
        Submit Pipeline
      </button>
    </footer>
  );
};
