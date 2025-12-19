import { Fragment } from "react";

type DataPoint = {
  label: string;
  value: number;
};

type Props = {
  total: number;
  data: DataPoint[];
};

export function StackedBarsChart(props: Props) {
  const { total, data } = props;

  return (
    <div className="grid grid-cols-[auto_1fr] gap-4">
      {data.map(({ label, value }, i) => (
        <Fragment key={i}>
          <div className="text-sm">{label}</div>
          <div className="flex">
            <div
              className="bg-iris-12 rounded-md"
              style={{ flex: value / total }}
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
}
