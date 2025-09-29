import React, { forwardRef } from "react";
import clsx from "clsx";

export interface Column<T> {
  /** Título exibido no header */
  Header: string | React.ReactNode;
  /** Campo da linha correspondente */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /** Classe opcional para a célula */
  cellClassName?: string;
}

export interface TableProps<T> extends React.TableHTMLAttributes<HTMLTableElement> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  containerClassName?: string;
  tableClassName?: string;
  emptyMessage?: string;
}

function TableInner<T extends object>(
  {
    columns,
    data,
    title,
    containerClassName,
    tableClassName,
    emptyMessage = "Nenhum dado encontrado",
    ...rest
  }: TableProps<T>,
  ref: React.Ref<HTMLTableElement>
) {
  return (
    <div className={clsx("w-full", containerClassName)}>
      {title && <h2 className="text-sm font-semibold mb-2">{title}</h2>}

      <div className="overflow-x-auto">
        <table
          ref={ref}
          className={clsx("min-w-full divide-y divide-gray-700 text-sm", tableClassName)}
          {...rest}
        >
          <thead className="text-[#D9E8FF]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-4 py-2 text-left font-medium tracking-wide"
                >
                  {col.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 text-gray-300 bg-[#12121B]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-3 text-center text-gray-500 italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-700/30 border-l-2 border-l-[var(--color-purple-2)]">
                  {columns.map((col, colIndex) => {
                    const value =
                      typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode);

                    return (
                      <td
                        key={colIndex}
                        className={clsx("px-4 py-2", col.cellClassName)}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🔑 Aqui a mágica: tipamos o forwardRef com genérico
const Table = forwardRef(TableInner) as <T extends object>(
  props: TableProps<T> & { ref?: React.Ref<HTMLTableElement> }
) => ReturnType<typeof TableInner>;

export default Table;
