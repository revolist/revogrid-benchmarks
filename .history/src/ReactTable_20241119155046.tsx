import React from "react";
import { useTable, Column } from "@tanstack/react-table";

interface Props {
  data: any[];
  columns: Column<any>[];
}

const ReactTable: React.FC<Props> = ({ data, columns }) => {
  const table = useTable({
    data,
    columns,
  });

  return (
    <div style={{ overflow: "auto", height: "600px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    border: "1px solid black",
                    padding: "5px",
                    textAlign: "left",
                  }}
                >
                  {header.renderHeader()}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    border: "1px solid black",
                    padding: "5px",
                    textAlign: "left",
                  }}
                >
                  {cell.renderCell()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReactTable;