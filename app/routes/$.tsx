import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import type { PloneContent } from 'plone-restapi-client/dist/content';
import { Link, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import LanguageSelector from '~/components/LanguageSelector';
import Navigation from '~/components/Navigation';
import { flattenToAppURL } from '~/utils/urls';
import { PLONE_RESTAPI_URL } from '~/utils/variables.server';
import config from '~/config';
import * as plone from 'plone-restapi-client';
import View from '~/views/View';

plone.client.init(PLONE_RESTAPI_URL);

invariant(
  config.settings.defaultLanguage,
  'Missing defaultLanguage in config.settings'
);

export const meta: MetaFunction = ({ data }) => ({
  charset: 'utf-8',
  title: `${data?.content?.title}${data?.content?.title ? ' | ' : ''}${
    config.settings.siteTitle
  }`,
  viewport: 'width=device-width,initial-scale=1'
});

type LoaderData = {
  lang: string;
  content: PloneContent;
  navigation: PloneContent[]; // PloneContent['@components']['navigation']['items'][]
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const lang = config.settings.isMultilingual
    ? flattenToAppURL(request.url).split('/')?.[1] ??
      config.settings.defaultLanguage
    : config.settings.defaultLanguage;

  const navReq = await fetch(
    `${PLONE_RESTAPI_URL}/${lang}/@navigation?expand.navigation.depth=2`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  const navigation = await navReq.json();

  const content = await plone.content.get(
    `/${params['*']}?expand=translations`
  );

  if (!content || !!content.message)
    throw new Response('Not Found', { status: 404 });

  if (content['@type'] === 'PloneSite' && config.settings.isMultilingual) {
    const DEFAULT_LANG = config.settings.defaultLanguage;
    return redirect(`/${DEFAULT_LANG}`);
  }

  return json<LoaderData>({
    lang,
    content: {
      ...content,
      '@id': flattenToAppURL(content['@id']),
      '@components': {
        ...(content['@components'] || {}),
        translations: {
          ...(content['@components']?.['translations'] || {}),
          items: [
            // @ts-ignore
            ...(content['@components']?.['translations']?.items?.map((i) => ({
              ...i,
              '@id': flattenToAppURL(i['@id'])
            })) || [])
          ]
        }
      }
    },
    navigation:
      navigation?.items?.map((i: PloneContent) => ({
        ...i,
        '@id': flattenToAppURL(i['@id'])
      })) ?? []
  });
};

export default function ContentPage() {
  const { navigation, lang, content } = useLoaderData() as LoaderData;

  return (
    <>
      <header>
        <Link
          to={
            config.settings.isMultilingual
              ? `/${lang || config.settings.defaultLanguage}`
              : ''
          }
        >
          <img alt="logo" src="" />
        </Link>
        <Navigation items={navigation} />
        <LanguageSelector
          currentLang={lang}
          translations={content['@components'].translations?.items}
        />
      </header>
      <main>
        <View content={content} />
      </main>
    </>
  );
}
