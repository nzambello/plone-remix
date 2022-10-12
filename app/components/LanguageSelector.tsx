import type { PloneContent } from 'plone-restapi-client/dist/content';
import { Link, useLoaderData } from '@remix-run/react';
import { flattenToAppURL } from '../utils/urls';
import cx from 'classnames';
import config from '../config';
import langmap from '~/utils/language';
import { useTranslation } from 'react-i18next';

interface Props {
  currentLang?: string;
  translations?: {
    '@id': string;
    language: string;
  }[];
  onClickAction?: () => void;
}

const LanguageSelector = ({
  currentLang,
  translations,
  onClickAction
}: Props) => {
  const { content } = useLoaderData<{
    content: PloneContent;
  }>();
  const { settings } = config;
  const { i18n } = useTranslation();

  return settings.isMultilingual ? (
    <div className="language-selector">
      {settings.supportedLanguages.map((lang) => {
        let translation = translations
          ? // if we have translations, we use them as target to change language
            // we also add content to match current content in current language
            [...(translations || []), content]?.find((t) => t.language === lang)
          : null;
        return (
          <Link
            className={cx({ selected: lang === currentLang })}
            to={
              translation
                ? flattenToAppURL(translation['@id'])
                : lang === content?.language?.token
                ? content['@id']
                : `/${lang}`
            }
            title={langmap[lang].nativeName}
            onClick={() => {
              i18n.changeLanguage(lang);
              if (onClickAction) onClickAction();
            }}
            key={`language-selector-${lang}`}
          >
            {langmap[lang].nativeName}
          </Link>
        );
      })}
    </div>
  ) : null;
};

export default LanguageSelector;
