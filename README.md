# VectorShift Frontend Assessment

Pipeline builder assessment for VectorShift. The app includes reusable React Flow
nodes, VectorShift-styled canvas UI, dynamic Text node handles, example flows,
and a FastAPI backend endpoint that returns node count, edge count, and whether
the submitted graph is a DAG.

## Prerequisites

- Node.js and npm
- Python 3.10+

## Install

```bash
cd frontend
npm install
```

```bash
cd ../backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

## Run

Start the backend:

```bash
cd backend
. .venv/bin/activate
uvicorn main:app --reload
```

Start the frontend in a second terminal:

```bash
cd frontend
npm start
```

Open `http://localhost:3000`.

## Test And Build

Backend:

```bash
backend/.venv/bin/python -m unittest discover backend
```

Frontend:

```bash
cd frontend
npm test -- --watchAll=false
npm run build
```

## API Contract

`POST http://localhost:8000/pipelines/parse`

Request:

```json
{
  "nodes": [{ "id": "input-1" }, { "id": "output-1" }],
  "edges": [{ "source": "input-1", "target": "output-1" }]
}
```

Response:

```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true
}
```

## Assessment Coverage

- Part 1: reusable node abstraction with centralized node definitions.
- Part 2: polished builder UI, example flows, minimap, controls, and branding.
- Part 3: dynamic Text node resizing and variable-based handles.
- Part 4: frontend submit integration with backend DAG parsing.
