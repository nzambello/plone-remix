import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import config from '~/config'

invariant(config.settings.defaultLanguage, 'Missing defaultLanguage in config.settings')
const DEFAULT_LANG = config.settings.defaultLanguage

export const loader: LoaderFunction = async () => {
  return redirect(`/${DEFAULT_LANG}`)
}
