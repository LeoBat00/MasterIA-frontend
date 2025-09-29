import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import clsx from "clsx";

export interface Column<T> {
    Header: string | React.ReactNode;
    accessor: keyof T | ((row: T) => React.ReactNode);
    cellClassName?: string;
}

export type FetchParams = {
    page: number;
    pageSize: number;
};

export type FetchResult<T> = {
    items: T[];
    total: number;
};

export interface TableProps<T> extends React.TableHTMLAttributes<HTMLTableElement> {
    columns: Column<T>[];
    data?: T[]; // opcional se for usar fetchData
    fetchData?: (params: FetchParams) => Promise<FetchResult<T>>;
    title?: string;
    containerClassName?: string;
    tableClassName?: string;
    emptyMessage?: string;
    initialPageSize?: number;
    pageSizeOptions?: number[];
}

function TableInner<T extends object>(
    {
        columns,
        data = [],
        fetchData,
        title,
        containerClassName,
        tableClassName,
        emptyMessage = "Nenhum dado encontrado",
        initialPageSize = 5,
        pageSizeOptions = [5, 10, 20, 50],
        ...rest
    }: TableProps<T>,
    ref: React.Ref<HTMLTableElement>
) {
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [pageIndex, setPageIndex] = useState(0);
    const [rows, setRows] = useState<T[]>(data);
    const [total, setTotal] = useState(data.length);
    const [loading, setLoading] = useState(false);

    const pageCount = Math.ceil(total / pageSize);

    const currentPageData = useMemo(() => {
        if (fetchData) return rows;
        const start = pageIndex * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, pageIndex, pageSize, rows, fetchData]);

    useEffect(() => {
        if (!fetchData) return;
        setLoading(true);
        fetchData({ page: pageIndex + 1, pageSize })
            .then((res) => {
                setRows(res.items);
                setTotal(res.total);
            })
            .finally(() => setLoading(false));
    }, [pageIndex, pageSize, fetchData]);

    return (
        <div className={clsx("w-full relative", containerClassName)}>
            {title && <h2 className="text-sm font-semibold mb-2">{title}</h2>}

            <div className="overflow-x-auto relative">
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
                        {currentPageData.length === 0 && !loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-3 text-center text-gray-500 italic"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            currentPageData.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="hover:bg-gray-700/30 border-l-2 border-l-[var(--color-purple-2)]"
                                >
                                    {columns.map((col, colIndex) => {
                                        const value =
                                            typeof col.accessor === "function"
                                                ? col.accessor(row)
                                                : (row[col.accessor] as React.ReactNode);

                                        return (
                                            <td key={colIndex} className={clsx("px-4 py-2", col.cellClassName)}>
                                                {value}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Overlay de loading */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#12121B]/70">
                        <div className="w-10 h-10 border-4 border-[var(--color-purple-5)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Footer de paginação */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm text-gray-300 gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs">Número de linhas</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageIndex(0);
                        }}
                        disabled={loading}
                        className="bg-[#12121B] border border-[var(--color-purple-2)] rounded px-2 py-1 text-xs disabled:opacity-40"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
                        disabled={pageIndex === 0 || loading}
                        className="px-2 py-1 rounded disabled:opacity-40 text-[var(--color-purple-5)] hover:cursor-pointer hover:text-white flex items-center justify-center gap-2"
                    >
                        <FaChevronLeft /> Anterior
                    </button>

                    {Array.from({ length: pageCount }).map((_, i) => {
                        if (i === 0 || i === pageCount - 1 || (i >= pageIndex - 1 && i <= pageIndex + 1)) {
                            return (
                                <button
                                    key={i}
                                    onClick={() => setPageIndex(i)}
                                    disabled={loading}
                                    className={clsx(
                                        "mx-1 w-8 h-8 rounded-full flex items-center justify-center border border-[var(--color-purple-5)] disabled:opacity-40",
                                        i === pageIndex
                                            ? "bg-[var(--color-purple-5)] text-white"
                                            : "text-[var(--color-purple-5)] hover:bg-[var(--color-purple-3)] hover:text-white"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            );
                        }
                        if (i === 1 || i === pageCount - 2) {
                            return (
                                <span key={i} className="px-2 text-[var(--color-purple-5)]">
                                    ...
                                </span>
                            );
                        }
                        return null;
                    })}

                    <button
                        onClick={() => setPageIndex((i) => Math.min(pageCount - 1, i + 1))}
                        disabled={pageIndex === pageCount - 1 || loading} // 🔒
                        className="px-2 py-1 rounded disabled:opacity-40 text-[var(--color-purple-5)] hover:cursor-pointer hover:text-white flex items-center justify-center gap-2"
                    >
                        Próximo <FaChevronRight />
                    </button>
                </div>
            </div>

        </div>
    );
}

const Table = forwardRef(TableInner) as <T extends object>(
    props: TableProps<T> & { ref?: React.Ref<HTMLTableElement> }
) => ReturnType<typeof TableInner>;

export default Table;
