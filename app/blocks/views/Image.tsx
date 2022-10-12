import type { BlockData } from 'types/blocks';
import type { PloneContent } from 'plone-restapi-client/dist/content';
import cx from 'classnames';
import { isInternalURL, flattenToAppURL } from '../../utils/urls';
import config from '~/config';

/**
 * View image block class.
 * @class ImageBlockView
 * @extends Component
 */
export const ImageBlockView = ({
  content,
  data,
  detached
}: BlockData<{
  align?: string;
  alt?: string;
  size?: string;
  url?: string;
  href?: PloneContent[];
  target?: string;
}>) => {
  const href = data?.href?.[0]?.['@id'];
  return (
    <p
      className={cx('block image align', {
        center: !content?.align,
        detached
      })}
    >
      {content?.url && (
        <>
          {(() => {
            const image = (
              <img
                className={cx({
                  'full-width': content.align === 'full',
                  large: content.size === 'l',
                  medium: content.size === 'm',
                  small: content.size === 's'
                })}
                src={
                  isInternalURL(content.url)
                    ? // Backwards compat in the case that the block is storing the full server URL
                      (() => {
                        if (content.size === 'l')
                          return `${config.settings.apiPath}${flattenToAppURL(
                            content.url
                          )}/@@images/image`;
                        if (content.size === 'm')
                          return `${config.settings.apiPath}${flattenToAppURL(
                            content.url
                          )}/@@images/image/preview`;
                        if (content.size === 's')
                          return `${config.settings.apiPath}${flattenToAppURL(
                            content.url
                          )}/@@images/image/mini`;
                        return `${config.settings.apiPath}${flattenToAppURL(
                          content.url
                        )}/@@images/image`;
                      })()
                    : content.url
                }
                alt={content.alt || ''}
                loading="lazy"
              />
            );
            if (href) {
              return (
                // eslint-disable-next-line react/jsx-no-target-blank
                <a
                  href={href}
                  target={data?.target ? '_blank' : undefined}
                  rel={data?.target ? 'noopener noreferrer' : undefined}
                >
                  {image}
                </a>
              );
            } else {
              return image;
            }
          })()}
        </>
      )}
    </p>
  );
};

ImageBlockView.displayName = 'ImageBlock';

export default ImageBlockView;
