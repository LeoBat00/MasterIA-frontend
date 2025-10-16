'use client';

import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimesCircle } from 'react-icons/fa';

type CheckboxItem = {
    label: string;
    value: string | number;
};

type CheckboxProps = {
    id: string;
    label?: string;
    values?: (string | number)[];
    items?: CheckboxItem[]; // agora é opcional, para suportar uso simples
    columns?: 1 | 2 | 3 | 4 | 6 | 12;
    disabled?: boolean;
    onChange?: (value: string | number, checked: boolean) => void;
    help?: string;
    sucesso?: string;
    erro?: string;
    single?: boolean; // caso use apenas um checkbox
};

const Checkbox: React.FC<CheckboxProps> = ({
    id,
    label = '',
    values = [],
    items = [{ label, value: '1' }],
    columns = 1,
    disabled = false,
    onChange,
    help = '',
    sucesso = '',
    erro = '',
}) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(
        values.map((v) => String(v))
    );

    useEffect(() => {
        setSelectedValues(values.map((v) => String(v)));
    }, [values]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        let newValues = selectedValues || [];

        if (checked) {
            newValues = [...newValues, value];
        } else {
            newValues = selectedValues.filter((v) => v !== value);
        }

        setSelectedValues(newValues);
        if (onChange) onChange(value, checked);
    };

    // Divide em colunas se houver mais de um item
    const qtdItemsPerColumn = Math.ceil(items.length / columns);
    const itemsPerColumn = new Array(columns)
        .fill(null)
        .map((_, i) =>
            items.slice(i * qtdItemsPerColumn, i * qtdItemsPerColumn + qtdItemsPerColumn)
        );

    return (
        <div className="text-sm">
            <div
                className={`grid gap-4 ${columns === 1
                        ? 'grid-cols-1'
                        : columns === 2
                            ? 'grid-cols-2'
                            : columns === 3
                                ? 'grid-cols-3'
                                : columns === 4
                                    ? 'grid-cols-4'
                                    : columns === 6
                                        ? 'grid-cols-6'
                                        : 'grid-cols-12'
                    }`}
            >
                {itemsPerColumn.map((columnItems, index) => (
                    <div key={`col_${index}`} className="space-y-2">
                        {columnItems.map((item) => (
                            <label
                                key={`${id}_${item.value}`}
                                htmlFor={`${id}_${item.value}`}
                                className={`flex items-center gap-2 cursor-pointer select-none ${disabled ? 'opacity-60 cursor-not-allowed' : ''
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 flex items-center justify-center rounded-sm border transition-all duration-150 ${selectedValues.includes(String(item.value))
                                            ? 'border-[var(--color-purple-3)] bg-[var(--color-purple-5)]'
                                            : 'border-[var(--color-purple-1)] bg-transparent hover:border-[var(--color-purple-2)]'
                                        }`}
                                >
                                    {selectedValues.includes(String(item.value)) && (
                                        <FaCheck className="text-white text-[20px]" />
                                    )}
                                    <input
                                        id={`${id}_${item.value}`}
                                        type="checkbox"
                                        value={String(item.value)}
                                        disabled={disabled}
                                        checked={selectedValues.includes(String(item.value))}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </div>
                                <span
                                    className={`text-gray-200 text-base ${disabled ? 'text-gray-500' : ''
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                ))}
            </div>

            {erro && (
                <div className="flex items-center gap-2 text-red-400 mt-2 text-xs">
                    <FaTimesCircle />
                    <span>{erro}</span>
                </div>
            )}

            {sucesso && (
                <div className="flex items-center gap-2 text-green-400 mt-2 text-xs">
                    <FaCheck />
                    <span>{sucesso}</span>
                </div>
            )}

            {help && <p className="text-gray-500 text-xs mt-2">{help}</p>}
        </div>
    );
};

export default Checkbox;
