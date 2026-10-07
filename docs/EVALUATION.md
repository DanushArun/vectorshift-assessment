# Pipeline Builder — Evaluation guide

Start with the smallest path that exercises the project. Distinguish source inspection,
syntax/build checks, functional behavior and domain validation when recording a result.

## Guided reading and demonstration

1. **Build a graph.** Drag nodes into the React Flow canvas or load an example. Inspect node
identifiers and the connections represented in store state.

2. **Use text variables.** Enter variable syntax in a Text node and inspect dynamically created
handles. Node sizing and handle derivation are implemented separately from backend graph
traversal.

3. **Submit the graph.** The frontend sends node IDs and source/target edges to /pipelines/parse.
The backend models validate the request shape.

4. **Read the result.** The response reports array counts and DAG status. It does not execute an
LLM, input transformation or other node operation.

## Declared checks

These commands/checks describe the intended verification path. Their presence in this
guide does not claim that they passed. See the dated evidence below and the README for setup.

```text
backend/.venv/bin/python -m unittest discover backend
cd frontend && npm test -- --watchAll=false
cd frontend && npm run build
```

## Evidence levels

| Level | What it establishes | What it does not establish |
| --- | --- | --- |
| Source review | A path exists in tracked code | Successful runtime behavior |
| Syntax/build | Parser/compiler accepts that path | End-to-end correctness |
| Behavioral check | A specific input/output case passed | Generalization beyond cases |
| Domain evaluation | Performance on a stated target setting | Other users/data/environments |

## What to record

- Commit, environment, dependency versions and date.
- Input provenance and whether data is synthetic, public or privately supplied.
- Absolute pass/fail/skip counts; keep failed cases and their root causes.
- Whether external services, hardware or a production deployment were actually exercised.
- Expected output and an artifact showing the observation.

## Review scenarios

- **Registry-backed nodes:** Shared rendering behavior is separated from individual node
definitions.

- **Kahn traversal:** Indegree-based traversal detects whether all graph vertices can be visited
without a cycle.

- **Array counts vs graph vertices:** Edge endpoints can expand traversal vertices while counts
still describe submitted arrays.

## Documentation inspection — 7 October 2026

The documentation was traced to committed source and checked for local links, balanced
code fences and supported implementation claims. Historical notebook outputs remain labeled
as historical. Live provider access, private databases and hardware behavior are not inferred
from configuration or dependency files. Any fresh run is recorded separately in the README.

## Next evidence to collect

- Record backend and frontend suite results with absolute counts.
- Exercise invalid payload and dangling-endpoint behavior through the UI.
- Capture keyboard and narrow-screen editing behavior.

## Fresh checks

The README records fresh checks on 7 October 2026, including commands and absolute results.
Those measured checks supersede an inspection-only description for the paths they cover.
