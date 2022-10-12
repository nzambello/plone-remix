import React from 'react';
import cx from 'classnames';
import { buildStyleClassNamesFromData } from '../../blocks/helpers';

const StyleWrapper = (props: { children: React.ReactChildren; data: any }) => {
  const { children, data = {} } = props;
  const styles = buildStyleClassNamesFromData(data.styles);
  const rewrittenChildren = React.Children.map(
    children,
    (child: React.ReactNode) => {
      if (React.isValidElement(child)) {
        const childProps = {
          ...props,
          className: cx([child.props.className, ...styles])
        };
        return React.cloneElement(child, childProps);
      }
      return child;
    }
  );

  return <>{rewrittenChildren}</>;
};

export default StyleWrapper;
