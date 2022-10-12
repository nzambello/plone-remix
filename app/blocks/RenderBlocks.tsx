import type { PloneContent } from 'plone-restapi-client/dist/content';
import type { BlockData } from 'types/blocks';
import { hasBlocksData } from './helpers';
import config from '../config';

const RenderBlocks = (props: {
  content: PloneContent;
  metadata?: any;
  blocksConfig?: any;
}) => {
  const { content, metadata } = props;
  const blocksConfig = props.blocksConfig || config.blocksConfig;

  return hasBlocksData(content) ? (
    <>
      {content.blocks_layout?.items?.map((blockId: string) => {
        const blockData = content.blocks?.[blockId];
        const blockType = blockData?.['@type'];
        const Block = blocksConfig[blockType]?.view as (
          props: BlockData
        ) => JSX.Element | null;

        if (Block) {
          return (
            <Block
              key={blockId}
              id={blockId}
              content={blockData}
              metadata={metadata}
              properties={content}
              blocksConfig={blocksConfig}
            />
          );
        }

        return (
          <div key={blockId}>
            <p>Unknown block type {blockType ?? 'unknown'}</p>
          </div>
        );

        // return Block ? (
        //   <StyleWrapper key={block} {...props} id={block} data={blockData}>
        //     <Block id={blockId} metadata={metadata} properties={content} data={blockData} blocksConfig={blocksConfig} />
        //   </StyleWrapper>
        // ) : (
        //   <div key={blockId}>
        //     <p>Unknown block type {content.blocks?.[blockId]['@type']}</p>
        //   </div>
        // )
      })}
    </>
  ) : (
    <></>
  );
};

export default RenderBlocks;
