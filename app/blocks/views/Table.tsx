import type { BlockData } from 'types/blocks';
import type { SlateNode } from '../helpers';
import { useMemo } from 'react';
import { renderSlate } from '../helpers';
import cx from 'classnames';

/**
 * Slate Table block's View class.
 * @class View
 * @extends Component
 * @param {object} data The table data to render as a table.
 */
const TableBlockView = ({
  content
}: BlockData<{
  table?: {
    rows: {
      key: string;
      cells: {
        key: string;
        type: 'header' | 'data';
        value: SlateNode[];
      }[];
    }[];
    fixed?: boolean;
    compact?: boolean;
    striped?: boolean;
    basic?: boolean;
    celled?: boolean;
    inverted?: boolean;
    sortable?: boolean;
    hideHeaders?: boolean;
  };
}>) => {
  // const headers = useMemo(() => {
  //   return content?.table?.rows?.[0]?.cells
  // }, [content?.table?.rows])

  // const rows = useMemo(() => {
  //   const items: { [key: string]: any } = {}
  //   if (!content?.table?.rows) return {}
  //   content.table.rows.forEach((row, index: number) => {
  //     if (index > 0) {
  //       items[row.key] = []
  //       row.cells.forEach((cell, cellIndex) => {
  //         items[row.key][cellIndex] = {
  //           ...cell,
  //           value: cell.value ? renderSlate(cell.key, cell.value) : '\u00A0',
  //           valueText: cell.value ? renderSlate(cell.key, cell.value) : '\u00A0'
  //         }
  //       })
  //     }
  //   })
  //   return items
  // }, [content?.table?.rows])

  const headers = useMemo(() => {
    return content?.table?.rows.filter((row) =>
      row.cells.every((cell) => cell.type === 'header')
    );
  }, [content?.table?.rows]);

  const rows = useMemo(() => {
    return content?.table?.rows.filter((row) =>
      row.cells.every((cell) => cell.type !== 'header')
    );
  }, [content?.table?.rows]);

  return (
    <>
      {content?.table && (
        <table
          className={cx('slate-table-block', {
            fixed: content.table.fixed,
            compact: content.table.compact,
            basic: content.table.basic,
            celled: content.table.celled,
            inverted: content.table.inverted,
            striped: content.table.striped,
            sortable: content.table.sortable
          })}
        >
          {!content.table.hideHeaders && (
            <thead>
              {headers?.map((hRow, index) => (
                <tr key={hRow.key + index}>
                  {hRow.cells?.map((cell) => (
                    <th key={cell.key}>{renderSlate(cell.key, cell.value)}</th>
                  ))}
                </tr>
              ))}
            </thead>
          )}
          <tbody>
            {rows?.map((row, index) => (
              <tr key={row.key + index}>
                {row.cells?.map((cell) => (
                  <td key={cell.key}>{renderSlate(cell.key, cell.value)}</td>
                ))}
              </tr>
            ))}
            {/*             {Object.keys(rows).map((key: string, index: number) => (
              <tr key={index}>
                {rows[key].map((cell: { value: any }, cellIndex: number) => (
                  <td key={cellIndex}>{cell.value}</td>
                ))}
              </tr>
            ))} */}
          </tbody>
        </table>
      )}
    </>
  );
};

TableBlockView.displayName = 'TableBlock';

export default TableBlockView;
