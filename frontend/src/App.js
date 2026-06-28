import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <h1 aria-label="VectorShift">
            Vector<span className="app-brand__accent">Shift</span>
          </h1>
        </div>
      </header>
      <section className="builder-workspace" aria-label="Pipeline builder">
        <PipelineToolbar />
        <PipelineUI />
        <SubmitButton />
      </section>
    </main>
  );
}

export default App;
