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
} from "@carbon/react";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const service = url.searchParams.get("service");
  const traceId = url.searchParams.get("traceId");
  const severity = url.searchParams.get("severity");
  const limit = parseInt(url.searchParams.get("limit") || "100", 10);

  const now = BigInt(Date.now()) * 1000000n;
  const oneHourAgo = now - 60n * 60n * 1000n * 1000000n;

  const from = url.searchParams.get("from")
    ? BigInt(url.searchParams.get("from")!)
    : oneHourAgo;
  const to = url.searchParams.get("to")
    ? BigInt(url.searchParams.get("to")!)
    : now;

  let sql = `
    SELECT * FROM logs 
    WHERE timestamp_ns >= ? AND timestamp_ns <= ?
  `;
  const params: any[] = [from, to];

  if (service) {
    sql += ` AND service_name = ?`;
    params.push(service);
  }

  if (traceId) {
    sql += ` AND trace_id = ?`;
    params.push(traceId);
  }

  if (severity) {
    sql += ` AND severity_text = ?`;
    params.push(severity);
  }

  sql += ` ORDER BY timestamp_ns DESC LIMIT ?`;
  params.push(limit);

  const logs = db.prepare(sql).all(...params);

  return {
    logs: logs.map((l: any) => ({
      ...l,
      timestamp_ns: l.timestamp_ns.toString(),
    })),
    filters: {
      service,
      traceId,
      severity,
      from: from.toString(),
      to: to.toString(),
    },
  };
}

export default function Logs() {
  const { logs, filters } = useLoaderData<typeof loader>();

  const headers = [
    { key: "timestamp", header: "Time" },
    { key: "severity", header: "Severity" },
    { key: "service", header: "Service" },
    { key: "body", header: "Body" },
    { key: "traceId", header: "Trace" },
  ];

  const rows = logs.map((log: any) => ({
    id: `${log.timestamp_ns}-${log.body.substring(0, 10)}`,
    timestamp: new Date(
      Number(BigInt(log.timestamp_ns) / 1000000n)
    ).toLocaleString(),
    severity: log.severity_text,
    service: log.service_name,
    body: log.body,
    traceId: log.trace_id,
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Logs</h1>

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
            <TextInput
              id="traceId"
              labelText="Trace ID"
              name="traceId"
              defaultValue={filters.traceId || ""}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <Select
              id="severity"
              labelText="Severity"
              name="severity"
              defaultValue={filters.severity || ""}
            >
              <SelectItem value="" text="All" />
              <SelectItem value="INFO" text="INFO" />
              <SelectItem value="WARN" text="WARN" />
              <SelectItem value="ERROR" text="ERROR" />
              <SelectItem value="DEBUG" text="DEBUG" />
            </Select>
          </Column>
          <Column lg={4} md={4} sm={4} className="flex items-end">
            <Button type="submit">Filter</Button>
          </Column>
        </Grid>
      </Form>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps }) => (
          <TableContainer title="Logs">
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
                        const traceId = cell.value;
                        return (
                          <TableCell key={cell.id}>
                            {traceId && (
                              <Link
                                to={`/traces/${traceId}`}
                                className="text-blue-600 hover:underline"
                              >
                                {traceId.substring(0, 8)}...
                              </Link>
                            )}
                          </TableCell>
                        );
                      }
                      if (cell.info.header === "severity") {
                        return (
                          <TableCell
                            key={cell.id}
                            className={
                              cell.value === "ERROR"
                                ? "text-red-600 font-bold"
                                : cell.value === "WARN"
                                  ? "text-yellow-600 font-bold"
                                  : "text-gray-600"
                            }
                          >
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
