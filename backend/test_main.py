import unittest

from main import app, PipelineEdge, PipelineNode, PipelinePayload, parse_pipeline_payload


class PipelineParseTests(unittest.TestCase):
    def test_parse_pipeline_payload_when_graph_is_acyclic_counts_graph(self):
        payload = PipelinePayload(
            nodes=[
                PipelineNode(id="input-1"),
                PipelineNode(id="llm-1"),
                PipelineNode(id="output-1"),
            ],
            edges=[
                PipelineEdge(source="input-1", target="llm-1"),
                PipelineEdge(source="llm-1", target="output-1"),
            ],
        )

        self.assertEqual(
            parse_pipeline_payload(payload),
            {"num_nodes": 3, "num_edges": 2, "is_dag": True},
        )

    def test_parse_pipeline_payload_when_graph_has_cycle_marks_not_dag(self):
        payload = PipelinePayload(
            nodes=[
                PipelineNode(id="a"),
                PipelineNode(id="b"),
            ],
            edges=[
                PipelineEdge(source="a", target="b"),
                PipelineEdge(source="b", target="a"),
            ],
        )

        self.assertFalse(parse_pipeline_payload(payload)["is_dag"])

    def test_parse_pipeline_route_when_registered_accepts_post(self):
        parse_routes = [
            route for route in app.routes
            if getattr(route, "path", "") == "/pipelines/parse"
        ]

        self.assertIn("POST", parse_routes[0].methods)


if __name__ == "__main__":
    unittest.main()
