import type { BlockData } from 'types/blocks';
import cx from 'classnames';
import { flattenToAppURL } from '../../utils/urls';

/**
 * View leadimage block class.
 */
const LeadImageView = ({
  data,
  content,
  properties
}: BlockData<{
  align?: string;
  href?: string;
  target?: string;
}>) => (
  <p
    className={cx(
      'block leadimage image align',
      {
        center: !data?.align
      },
      data?.align
    )}
  >
    {properties.image && (
      <>
        {(() => {
          const image = (
            <img
              className={cx({ 'full-width': data?.align === 'full' })}
              src={flattenToAppURL(properties.image.download)}
              alt={properties.image_caption || ''}
            />
          );
          if (data?.href) {
            return (
              // eslint-disable-next-line react/jsx-no-target-blank
              <a
                href={data?.href}
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

LeadImageView.displayName = 'LeadImage';

export default LeadImageView;
