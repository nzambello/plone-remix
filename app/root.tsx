import type { MetaFunction, LoaderFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1'
})

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params['*'])
  const response = await fetch(`https://rawmaterial.it/api/it/@navigation?expand.navigation.depth=2`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  return {
    navigation: data.items ?? []
  }
}

export default function App() {
  const { navigation } = useLoaderData()
  console.log(navigation)

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <nav>
            <ul>
              {navigation.map((item) => (
                <li key={item['@id']}>
                  <a href={item['@id'].replace('https://rawmaterial.it/api/it', '')}>{item.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
