// Renders the pipeline submit action.

import { exampleFlows } from './examples/exampleFlows';
import { useStore } from './store';

export const SubmitButton = () => {
  const activeExampleFlowId = useStore((state) => state.activeExampleFlowId);
  const loadExampleFlow = useStore((state) => state.loadExampleFlow);
  const startBlankFlow = useStore((state) => state.startBlankFlow);

  return (
    <footer className="submit-bar">
      <div className="example-switch" aria-label="Example flows">
        <span className="example-switch__label">Examples</span>
        <div className="example-switch__buttons">
          {exampleFlows.map((flow, index) => (
            <button
              key={flow.id}
              type="button"
              className={
                flow.id === activeExampleFlowId
                  ? 'example-button example-button--active'
                  : 'example-button'
              }
              onClick={() => loadExampleFlow(flow.id)}
              aria-label={`Load example ${index + 1}: ${flow.label}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            className={
              activeExampleFlowId === 'blank'
                ? 'example-button example-button--active'
                : 'example-button'
            }
            onClick={startBlankFlow}
            aria-label="Start blank pipeline"
          >
            +
          </button>
        </div>
      </div>
      <button className="submit-button" type="submit">
        Submit Pipeline
      </button>
    </footer>
  );
};
