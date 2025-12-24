import { Grid, Column, Tile, ClickableTile } from "@carbon/react";
import { Activity, List, ChartLine, ArrowRight } from "@carbon/icons-react";
import { Link } from "react-router";

export function Welcome() {
  return (
    <Grid className="p-4">
      <Column lg={16} md={8} sm={4} className="mb-4">
        <h1 className="text-4xl font-bold mb-2">Telemetry Dashboard</h1>
        <p className="text-gray-600">
          Overview of your system's observability data.
        </p>
      </Column>

      <Column lg={4} md={4} sm={4} className="mb-4">
        <ClickableTile as={Link} to="/traces" className="h-full">
          <div className="flex justify-between items-start mb-4">
            <Activity size={32} />
            <ArrowRight size={20} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Traces</h3>
          <p className="text-gray-500">
            Analyze distributed traces and latency.
          </p>
        </ClickableTile>
      </Column>

      <Column lg={4} md={4} sm={4} className="mb-4">
        <ClickableTile as={Link} to="/logs" className="h-full">
          <div className="flex justify-between items-start mb-4">
            <List size={32} />
            <ArrowRight size={20} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Logs</h3>
          <p className="text-gray-500">View and search system logs.</p>
        </ClickableTile>
      </Column>

      <Column lg={4} md={4} sm={4} className="mb-4">
        <ClickableTile as={Link} to="/metrics" className="h-full">
          <div className="flex justify-between items-start mb-4">
            <ChartLine size={32} />
            <ArrowRight size={20} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Metrics</h3>
          <p className="text-gray-500">Monitor system performance metrics.</p>
        </ClickableTile>
      </Column>

      <Column lg={16} md={8} sm={4} className="mt-8">
        <Tile>
          <h3 className="text-xl font-semibold mb-4">System Status</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}
