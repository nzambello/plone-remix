import type { PloneContent } from 'plone-restapi-client/dist/content';
import { hasBlocksData } from '~/blocks/helpers';
import RenderBlocks from '~/blocks/RenderBlocks';

const View = ({
  content
}: {
  content: PloneContent & {
    subtitle?: string;
    image?: {
      'content-type': string;
      download: string;
      scales: {
        [key: string]: {
          download: string;
          width: number;
          height: number;
        };
      };
    };
    text?: {
      data: string;
    };
  };
}) => {
  return hasBlocksData(content) ? (
    <div id="page-document" className="viewwrapper blocks-view">
      <RenderBlocks content={content} />
    </div>
  ) : (
    <div id="page-document" className="view-wrapper">
      {content.title && (
        <h1 className="documentFirstHeading">
          {content.title}
          {content.subtitle && ` - ${content.subtitle}`}
        </h1>
      )}
      {content.description && (
        <p className="documentDescription">{content.description}</p>
      )}
      {content.image && (
        <img
          className="documentImage"
          alt={content.title}
          title={content.title}
          src={
            content.image['content-type'] === 'image/svg+xml'
              ? content.image.download
              : content.image.scales.mini.download
          }
        />
      )}
      {content.text && (
        <div
          dangerouslySetInnerHTML={{
            __html: content.text.data
          }}
        />
      )}
    </div>
  );
};

export default View;
