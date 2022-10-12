/**
 * Blocks helper.
 * @module helpers/Blocks
 */

import type { SlateElementData } from 'types/blocks';
import { Fragment } from 'react';
import config from '../config';

/**
 * Get blocks field.
 * @function getBlocksFieldname
 * @param {Object} props Properties.
 * @return {string} Field name of the blocks
 */
export function getBlocksFieldname(props: {
  [key: string]: any;
}): string | null {
  return (
    Object.keys(props).find(
      (key) => key !== 'volto.blocks' && key.endsWith('blocks')
    ) || null
  );
}

/**
 * Get blocks layout field.
 * @function getBlocksLayoutFieldname
 * @param {Object} props Properties.
 * @return {string} Field name of the blocks layout
 */
export function getBlocksLayoutFieldname(props: {
  [key: string]: any;
}): string | null {
  return (
    Object.keys(props).find(
      (key) => key !== 'volto.blocks' && key.endsWith('blocks_layout')
    ) || null
  );
}

/**
 * Has blocks data.
 * @function hasBlocksData
 * @param {Object} props Properties.
 * @return {boolean} True if it has blocks data.
 */
export function hasBlocksData(props: { [key: string]: any }): boolean {
  // return !!Object.keys(props).find((key) => key !== 'volto.blocks' && key.endsWith('blocks'))
  const blocksFieldName = getBlocksFieldname(props);

  if (blocksFieldName) {
    return (
      props[blocksFieldName] && !!Object.keys(props[blocksFieldName]).length
    );
  }

  return false;
}

/**
 * Get block pairs of [id, block] from content properties
 * @function getBlocks
 * @param {Object} properties
 * @return {Array} a list of block [id, value] pairs, in order from layout
 */
export const getBlocks = (properties: {
  [x: string]: any;
}): [string, any][] => {
  const blocksFieldName = getBlocksFieldname(properties);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(properties);
  if (!blocksFieldName || !blocksLayoutFieldname) return [];
  return (
    properties[blocksLayoutFieldname]?.items?.map((n: string | number) => [
      n,
      properties[blocksFieldName][n]
    ]) || []
  );
};

/**
 * Get the next block UID within form
 * @function nextBlockId
 * @param {Object} formData Form data
 * @param {string} currentBlock Block uid
 * @return {string} Next block uid
 */
export function nextBlockId(
  formData: { [x: string]: any },
  currentBlock: string
): string | null {
  const blocksLayoutFieldname = getBlocksLayoutFieldname(formData);
  if (!blocksLayoutFieldname) return null;

  const currentIndex =
    formData[blocksLayoutFieldname].items.indexOf(currentBlock);
  if (currentIndex === formData[blocksLayoutFieldname].items.length - 1) {
    // We are already at the bottom block don't do anything
    return null;
  }

  const newIndex = currentIndex + 1;
  return formData[blocksLayoutFieldname].items[newIndex];
}

/**
 * Get the previous block UID within form
 * @function previousBlockId
 * @param {Object} formData Form data
 * @param {string} currentBlock Block uid
 * @return {string} Previous block uid
 */
export function previousBlockId(
  formData: { [x: string]: any },
  currentBlock: any
): string | null {
  const blocksLayoutFieldname = getBlocksLayoutFieldname(formData);
  if (!blocksLayoutFieldname) return null;

  const currentIndex =
    formData[blocksLayoutFieldname].items.indexOf(currentBlock);
  if (currentIndex === 0) {
    // We are already at the top block don't do anything
    return null;
  }
  const newindex = currentIndex - 1;
  return formData[blocksLayoutFieldname].items[newindex];
}

/**
 * Recursively discover blocks in data and call the provided callback
 * @function visitBlocks
 * @param {Object} content A content data structure (an object with blocks and blocks_layout)
 * @param {Function} callback A function to call on each discovered block
 */
export function visitBlocks(content: any, callback: (arg0: any[]) => void) {
  const queue = getBlocks(content);
  while (queue.length > 0) {
    const queueItem = queue.shift();
    const [id, blockdata] = queueItem ?? [];
    callback([id, blockdata]);

    // assumes that a block value is like: {blocks, blocks_layout} or
    // { data: {blocks, blocks_layout}}
    if (Object.keys(blockdata || {}).indexOf('blocks') > -1) {
      queue.push(...getBlocks(blockdata));
    }
    if (Object.keys(blockdata?.data || {}).indexOf('blocks') > -1) {
      queue.push(...getBlocks(blockdata.data));
    }
  }
}

export const toPairs = (obj: { [x: string]: any }) =>
  Object.keys(obj).map((key) => [key, obj[key]]);
const isObject = (obj: { [x: string]: any }) => obj && typeof obj === 'object';

export const buildStyleClassNamesFromData = (styles: CSSStyleDeclaration) => {
  // styles has the form
  // const styles = {
  // color: 'red',
  // backgroundColor: '#AABBCC',
  // }
  // Returns: ['has--color--red', 'has--backgroundColor--AABBCC']
  let styleArray: string[][] = [];
  const pairedStyles = toPairs(styles);
  pairedStyles.forEach((item) => {
    if (isObject(item[1])) {
      const flattenedNestedStyles = toPairs(item[1]).map((nested) => [
        item[0],
        ...nested
      ]);
      flattenedNestedStyles.forEach((sub) => styleArray.push(sub));
    } else {
      styleArray.push(item);
    }
  });
  return styleArray.map((item) => {
    const classname = item.map((item) => {
      const str_item = item ? item.toString() : '';
      return str_item && str_item.startsWith('#')
        ? str_item.replace('#', '')
        : str_item;
    });
    return `has--${classname[0]}--${classname[1]}${
      classname[2] ? `--${classname[2]}` : ''
    }`;
  });
};

export type SlateNode = {
  type?: string;
  children?: SlateNode[];
  text?: string;
  data?: SlateElementData;
};

export const renderSlate = (
  id: string,
  nodes?: SlateNode[],
  override_toc?: boolean,
  metadata?: any
) => {
  const renderedNodes = (nodes ?? []).map((node: SlateNode, i) => {
    if (node.text) {
      return (
        <Fragment key={id + i}>
          {node.text.split('\n').map((t, x) =>
            (node.text?.indexOf('\n') ?? -1) > -1 ? (
              <span key={t + x}>
                {t}
                <br />
              </span>
            ) : (
              <span key={t + x}>{t}</span>
            )
          )}
        </Fragment>
      );
    }

    if (!node.type) {
      return <Fragment key={id + i}></Fragment>;
    }

    const elements = config.settings.slate.elements;
    const shouldHaveID =
      config.settings.slate.topLevelTargetElements.includes(node.type!) ||
      override_toc;

    if (!elements[node.type]) {
      console.warn(`Unknown slate element type ${node.type}`);
      console.log(node);
    }

    const Element = elements[node.type] || elements['default'];

    return (
      <Element
        key={id + node.type + i}
        attributes={{
          id: shouldHaveID ? id : undefined
        }}
        data={node.data}
      >
        {renderSlate(id, node.children, undefined, metadata)}
      </Element>
    );
  });

  return renderedNodes.flat();
};
