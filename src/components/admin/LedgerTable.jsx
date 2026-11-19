'use client';

import { Fragment } from 'react';

import EmptyState from './EmptyState';

function alignClass(align) {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
}

function Skeleton({ columns, selectable }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((row) => (
        <tr key={row} className="border-b border-[var(--a-line)] last:border-0">
          {selectable && (
            <td className="w-10 py-4 pl-5 pr-0">
              <span className="block h-4 w-4 animate-pulse rounded bg-[var(--a-line)]" />
            </td>
          )}
          {columns.map((column) => (
            <td key={column.key} className="px-3 py-4 first:pl-5 last:pr-5">
              <span
                className={`block h-3.5 animate-pulse rounded bg-[var(--a-line)] ${
                  column.key === columns[0].key ? 'w-40' : 'w-20'
                } ${column.align === 'right' ? 'ml-auto' : ''}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function LedgerTable({
  columns,
  rows = [],
  rowKey = '_id',
  getRowKey,
  loading = false,
  empty,
  caption,
  selectable = false,
  selected = [],
  onToggleRow,
  onToggleAll,
}) {
  const primary = columns.find((column) => column.primary) || columns[0];
  const actions = columns.find((column) => column.actions);
  const secondary = columns.filter(
    (column) => column !== primary && column !== actions && column.mobile !== false
  );

  const rowId = (row, index) =>
    typeof getRowKey === 'function' ? getRowKey(row, index) : (row[rowKey] ?? index);
  const rowIds = rows.map(rowId);
  const allSelected = selectable && rowIds.length > 0 && rowIds.every((id) => selected.includes(id));

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-[13.5px]">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr>
              {selectable && (
                <th scope="col" className="w-10 border-b border-[var(--a-line)] bg-[var(--a-raised)]/70 py-2.5 pl-5 pr-0">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(event) => onToggleAll?.(event.target.checked)}
                    aria-label="Chọn tất cả"
                    className="h-4 w-4 rounded border-[var(--a-line-strong)] accent-[var(--a-cham)]"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`border-b border-[var(--a-line)] bg-[var(--a-raised)]/70 px-3 py-2.5 text-[12px] font-medium text-[var(--a-faint)] first:pl-5 last:pr-5 ${alignClass(column.align)}`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Skeleton columns={columns} selectable={selectable} />
            ) : (
              rows.map((row, index) => {
                const id = rowId(row, index);
                return (
                  <tr
                    key={id}
                    className="border-b border-[var(--a-line)] transition-colors last:border-0 hover:bg-[var(--a-raised)]/70"
                  >
                    {selectable && (
                      <td className="w-10 py-3 pl-5 pr-0">
                        <input
                          type="checkbox"
                          checked={selected.includes(id)}
                          onChange={() => onToggleRow?.(id)}
                          aria-label="Chọn dòng"
                          className="h-4 w-4 rounded border-[var(--a-line-strong)] accent-[var(--a-cham)]"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-3 py-3 align-middle first:pl-5 last:pr-5 ${alignClass(column.align)}`}
                      >
                        {column.render(row, index)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        {selectable && rows.length > 0 && (
          <div className="flex items-center gap-2 border-b border-[var(--a-line)] px-4 py-2.5">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(event) => onToggleAll?.(event.target.checked)}
              aria-label="Chọn tất cả"
              className="h-4 w-4 rounded border-[var(--a-line-strong)] accent-[var(--a-cham)]"
            />
            <span className="text-[12px] text-[var(--a-muted)]">Chọn tất cả</span>
          </div>
        )}
        <div className="divide-y divide-[var(--a-line)]">
          {loading
            ? [0, 1, 2].map((row) => (
                <div key={row} className="animate-pulse space-y-3 px-4 py-4">
                  <div className="h-4 w-2/3 rounded bg-[var(--a-line)]" />
                  <div className="h-3 w-1/2 rounded bg-[var(--a-line)]" />
                  <div className="h-3 w-1/3 rounded bg-[var(--a-line)]" />
                </div>
              ))
            : rows.map((row, index) => {
                const id = rowId(row, index);
                return (
                  <div key={id} className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      {selectable && (
                        <input
                          type="checkbox"
                          checked={selected.includes(id)}
                          onChange={() => onToggleRow?.(id)}
                          aria-label="Chọn dòng"
                          className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--a-line-strong)] accent-[var(--a-cham)]"
                        />
                      )}
                      <div className="min-w-0 flex-1 text-[13.5px]">{primary.render(row, index)}</div>
                    </div>
                    {secondary.length > 0 && (
                      <dl className="mt-3 grid grid-cols-[92px_1fr] gap-x-3 gap-y-1.5">
                        {secondary.map((column) => (
                          <Fragment key={column.key}>
                            <dt className="text-[12px] leading-5 text-[var(--a-faint)]">
                              {column.label}
                            </dt>
                            <dd className="min-w-0 text-[12.5px] leading-5 text-[var(--a-ink)]">
                              {column.render(row, index)}
                            </dd>
                          </Fragment>
                        ))}
                      </dl>
                    )}
                    {actions && <div className="mt-3 flex justify-end">{actions.render(row, index)}</div>}
                  </div>
                );
              })}
        </div>
      </div>

      {!loading && rows.length === 0 && empty && <EmptyState {...empty} />}
    </>
  );
}
