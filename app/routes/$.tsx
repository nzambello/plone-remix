import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params['*'])
  const response = await fetch(`https://rawmaterial.it/api/it/${params['*']}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  return data
}

export default function ContentRoute() {
  const params = useParams()
  const data = useLoaderData()
  console.log(params['*'], data)

  return <div>{data.title && <h1>{data.title}</h1>}</div>
}
