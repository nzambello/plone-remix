import type { PloneContent } from 'plone-restapi-client/dist/content'
import { flattenToAppURL } from '~/utils/urls'

const Navigation = ({
  items
}: {
  items: (PloneContent & {
    appURL?: string
  })[]
}) => {
  return (
    <nav>
      <ul>
        {items.map((item) => (
          <li key={item['@id']}>
            <a href={item.appURL ?? flattenToAppURL(item['@id'])}>{item.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
