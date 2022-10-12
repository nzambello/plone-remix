import type { BlockData } from 'types/blocks';
import cx from 'classnames';

/**
 * View image block class.
 * @class View
 * @extends Component
 */

const MapsBlockView = ({
  data,
  content
}: BlockData<{
  align?: string;
  title?: string;
  url?: string;
}>) => (
  <div
    className={cx(
      'block maps align',
      {
        center: !data?.align
      },
      data?.align
    )}
  >
    <div
      className={cx('maps-inner', {
        'full-width': data?.align === 'full'
      })}
    >
      <iframe
        title={content?.title}
        src={content?.url}
        className="google-map"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  </div>
);

MapsBlockView.displayName = 'MapsBlock';

export default MapsBlockView;
