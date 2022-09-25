import type { MetaFunction, LoaderFunction, LinksFunction } from '@remix-run/node'
import type { PloneContent } from 'plone-restapi-client/dist/content'
import { Link, Outlet, useLoaderData, useParams } from '@remix-run/react'
import invariant from 'tiny-invariant'
import LanguageSelector from '~/components/LanguageSelector'
import Navigation from '~/components/Navigation'
import { flattenToAppURL } from '~/utils/urls'
import { PLONE_RESTAPI_URL } from '~/utils/variables.server'
import config from '~/config'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1'
})

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.lang, 'params.lang is required')
  const response = await fetch(`${PLONE_RESTAPI_URL}/${params.lang}/@navigation?expand.navigation.depth=2`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  return {
    lang: params.lang,
    navigation:
      data.items?.map((i: PloneContent) => ({
        ...i,
        appURL: flattenToAppURL(i['@id'])
      })) ?? []
  }
}

export default function LanguageRootFolder() {
  const { navigation, lang } = useLoaderData()

  return (
    <>
      <header>
        <Link to={config.settings.isMultilingual ? `/${lang || config.settings.defaultLanguage}` : ''}>
          <img alt="logo" src="" />
        </Link>
        <Navigation items={navigation} />
        <LanguageSelector currentLang={lang} />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
