import type { BlockData } from 'types/blocks';
import { renderSlate } from '../helpers';

const TextBlockView = (props: BlockData) => {
  const { id, data, content } = props;
  const metadata = props.metadata || props.properties;

  return content?.value ? (
    <>{renderSlate(id, content.value, data?.override_toc, metadata)}</>
  ) : null;
};

TextBlockView.displayName = 'SlateTextBlock';

export default TextBlockView;
