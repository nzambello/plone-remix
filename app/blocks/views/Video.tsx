import type { BlockData } from 'types/blocks';
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import cx from 'classnames';

let isHydrating = true;

/**
 * View video block class.
 */
const VideoBlockView = ({
  content,
  data,
  className
}: BlockData<{
  url?: string;
  align?: string;
}>) => {
  let [isHydrated, setIsHydrated] = useState(!isHydrating);

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  if (isHydrated) {
    return (
      <div
        className={cx(
          'block video align',
          {
            center: !data?.align
          },
          data?.align,
          className
        )}
      >
        {content?.url && <ReactPlayer url={content.url} />}
        <div
          className={cx('video-inner', {
            'full-width': data?.align === 'full'
          })}
        ></div>
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
};

VideoBlockView.displayBame = 'VideoBlock';

export default VideoBlockView;
