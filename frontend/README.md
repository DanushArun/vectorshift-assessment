# VectorShift Frontend Assessment

This React/FastAPI assessment implements a pipeline builder with reusable node
definitions, polished VectorShift-styled UI, dynamic Text node handles, example
flows, and backend parsing for node/edge counts plus DAG detection.

## Frontend

```bash
cd frontend
npm install
npm start
```

The frontend runs at `http://localhost:3000`.

## Backend

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend runs at `http://localhost:8000`.

## Verification

```bash
cd frontend
npm test -- --watchAll=false
npm run build
```

```bash
cd ..
backend/.venv/bin/python -m unittest discover backend
```

## Implemented Parts

- Part 1: reusable node abstraction and centralized node definitions.
- Part 2: styled builder interface with VectorShift-aligned colors and examples.
- Part 3: dynamic Text node sizing and variable-derived handles.
- Part 4: `/pipelines/parse` integration with iterative DAG detection.
