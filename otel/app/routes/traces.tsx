import { Link, useLoaderData, Form } from "react-router";
import { db } from "../db/client.server";
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  TextInput,
  Select,
  SelectItem,
  Grid,
  Column,
  Tag,
} from "@carbon/react";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const service = url.searchParams.get("service");
  const hasError = url.searchParams.get("hasError");
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);

  const now = BigInt(Date.now()) * 1000000n;
  const oneHourAgo = now - 60n * 60n * 1000n * 1000000n;

  const from = url.searchParams.get("from")
    ? BigInt(url.searchParams.get("from")!)
    : oneHourAgo;
  const to = url.searchParams.get("to")
    ? BigInt(url.searchParams.get("to")!)
    : now;

  let sql = `
    SELECT * FROM traces 
    WHERE start_time_ns >= ? AND start_time_ns <= ?
  `;
  const params: any[] = [from, to];

  if (service) {
    sql += ` AND service_name = ?`;
    params.push(service);
  }

  if (hasError === "true") {
    sql += ` AND has_error = 1`;
  }

  sql += ` ORDER BY start_time_ns DESC LIMIT ?`;
  params.push(limit);

  const traces = db.prepare(sql).all(...params);

  return {
    traces: traces.map((t: any) => ({
      ...t,
      start_time_ns: t.start_time_ns.toString(),
      duration_ms: Number(t.duration_ns) / 1000000,
    })),
    filters: { service, hasError, from: from.toString(), to: to.toString() },
  };
}

export default function Traces() {
  const { traces, filters } = useLoaderData<typeof loader>();

  const headers = [
    { key: "traceId", header: "Trace ID" },
    { key: "timestamp", header: "Time" },
    { key: "service", header: "Service" },
    { key: "rootSpan", header: "Root Span" },
    { key: "duration", header: "Duration (ms)" },
    { key: "spanCount", header: "Spans" },
    { key: "hasError", header: "Errors" },
  ];

  const rows = traces.map((trace: any) => ({
    id: trace.trace_id,
    traceId: trace.trace_id,
    timestamp: new Date(
      Number(BigInt(trace.start_time_ns) / 1000000n)
    ).toLocaleString(),
    service: trace.service_name,
    rootSpan: trace.root_span_name,
    duration: trace.duration_ms.toFixed(2),
    spanCount: trace.span_count,
    hasError: trace.has_error,
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Traces</h1>

      <Form className="mb-6">
        <Grid className="pl-0">
          <Column lg={4} md={4} sm={4}>
            <TextInput
              id="service"
              labelText="Service"
              name="service"
              defaultValue={filters.service || ""}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <Select
              id="hasError"
              labelText="Has Error"
              name="hasError"
              defaultValue={filters.hasError || ""}
            >
              <SelectItem value="" text="All" />
              <SelectItem value="true" text="Yes" />
              <SelectItem value="false" text="No" />
            </Select>
          </Column>
          <Column lg={4} md={4} sm={4} className="flex items-end">
            <Button type="submit">Filter</Button>
          </Column>
        </Grid>
      </Form>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps }) => (
          <TableContainer title="Traces">
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => {
                      if (cell.info.header === "traceId") {
                        return (
                          <TableCell key={cell.id}>
                            <Link
                              to={`/traces/${cell.value}`}
                              className="text-blue-600 hover:underline"
                            >
                              {cell.value.substring(0, 8)}...
                            </Link>
                          </TableCell>
                        );
                      }
                      if (cell.info.header === "hasError") {
                        return (
                          <TableCell key={cell.id}>
                            {cell.value ? (
                              <Tag type="red">Yes</Tag>
                            ) : (
                              <Tag type="gray">No</Tag>
                            )}
                          </TableCell>
                        );
                      }
                      if (cell.info.header === "duration") {
                        return (
                          <TableCell key={cell.id} className="text-right">
                            {cell.value}
                          </TableCell>
                        );
                      }
                      return <TableCell key={cell.id}>{cell.value}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
}
