import type { PloneContent } from 'plone-restapi-client/dist/content'
import { Link } from '@remix-run/react'
import { flattenToAppURL } from '../utils/urls'
import cx from 'classnames'
import config from '../config'
import langmap from '~/utils/language'

interface Props {
  currentLang?: string
  translation?: PloneContent
  onClickAction?: () => void
}

const LanguageSelector = ({ currentLang, translation, onClickAction }: Props) => {
  const { settings } = config

  return settings.isMultilingual ? (
    <div className="language-selector">
      {settings.supportedLanguages.map((lang) => {
        return (
          <Link
            aria-label={`Switch to ${langmap[lang].nativeName.toLowerCase()}`}
            className={cx({ selected: lang === currentLang })}
            to={translation ? flattenToAppURL(translation['@id']) : `/${lang}`}
            title={langmap[lang].nativeName}
            onClick={() => {
              if (onClickAction) onClickAction()
            }}
            key={`language-selector-${lang}`}
          >
            {langmap[lang].nativeName}
          </Link>
        )
      })}
    </div>
  ) : null
}

export default LanguageSelector
