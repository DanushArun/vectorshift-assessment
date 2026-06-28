from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class PipelineNode(BaseModel):
    id: str


class PipelineEdge(BaseModel):
    source: str
    target: str


class PipelinePayload(BaseModel):
    nodes: list[PipelineNode]
    edges: list[PipelineEdge]


def build_graph(payload: PipelinePayload) -> tuple[dict[str, list[str]], dict[str, int]]:
    adjacency = {node.id: [] for node in payload.nodes}
    indegree = {node.id: 0 for node in payload.nodes}

    for edge in payload.edges:
        adjacency.setdefault(edge.source, [])
        adjacency.setdefault(edge.target, [])
        indegree.setdefault(edge.source, 0)
        indegree[edge.target] = indegree.get(edge.target, 0) + 1
        adjacency[edge.source].append(edge.target)

    return adjacency, indegree


def is_directed_acyclic_graph(payload: PipelinePayload) -> bool:
    adjacency, indegree = build_graph(payload)
    queue = [node for node, degree in indegree.items() if degree == 0]
    visited_count = 0
    queue_index = 0

    while queue_index < len(queue):
        node = queue[queue_index]
        queue_index += 1
        visited_count += 1

        for next_node in adjacency[node]:
            indegree[next_node] -= 1

            if indegree[next_node] == 0:
                queue.append(next_node)

    return visited_count == len(indegree)


def parse_pipeline_payload(payload: PipelinePayload) -> dict[str, int | bool]:
    return {
        "num_nodes": len(payload.nodes),
        "num_edges": len(payload.edges),
        "is_dag": is_directed_acyclic_graph(payload),
    }


@app.get('/')
def read_root() -> dict[str, str]:
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(payload: PipelinePayload) -> dict[str, int | bool]:
    return parse_pipeline_payload(payload)
