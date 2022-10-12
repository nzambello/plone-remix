import type { PloneContent } from 'plone-restapi-client/dist/content';
import { Link } from '@remix-run/react';
import { flattenToAppURL } from '~/utils/urls';

const Navigation = ({ items }: { items: PloneContent[] }) => {
  return (
    <nav>
      <ul>
        {items.map((item) => (
          <li key={item['@id']}>
            <Link to={flattenToAppURL(item['@id'])}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
