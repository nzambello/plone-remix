import type { BlockData } from 'types/blocks';

/**
 * View title block component.
 * @class View
 * @extends Component
 */
const TitleBlockView = ({ properties, metadata }: BlockData) => {
  return (
    <h1 className="documentFirstHeading">
      {(metadata || properties)['title'] || ''}
    </h1>
  );
};

TitleBlockView.displayName = 'TitleBlock';

export default TitleBlockView;
