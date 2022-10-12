import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react';
import i18next from '~/i18next.server';
import { useChangeLanguage } from 'remix-i18next';
import { useTranslation } from 'react-i18next';
import { i18nCookie } from './cookies.server';
import config from './config';

type LoaderData = { locale: string };
export let loader = async ({ request }: LoaderArgs) => {
  let locale = await i18next.getLocale(request);
  return json<LoaderData>(
    { locale },
    {
      headers: { 'Set-Cookie': await i18nCookie.serialize(locale) }
    }
  );
};

export let handle = {
  i18n: 'common'
};

// export const links: LinksFunction = () => {
//   return [{ rel: 'stylesheet', href: 'https://unpkg.com/mvp.css@1.11/mvp.css' }]
// }

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: config.settings.siteTitle,
  viewport: 'width=device-width,initial-scale=1'
});

export default function App() {
  // Get the locale from the loader
  let { locale } = useLoaderData<LoaderData>();
  let { i18n } = useTranslation();

  useChangeLanguage(locale);

  return (
    <html lang={i18n.language} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
