import { LoaderFunction, redirect } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { PLONE_RESTAPI_URL } from '~/utils/variables.server'
import { client, content } from 'plone-restapi-client'
import View from '~/views/View'

client.init(PLONE_RESTAPI_URL)

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.lang, `params.lang is required`)
  const lang = params.lang

  const response = await content.get(`/${lang}`)
  return response
}

export default function ContentRoute() {
  const params = useParams()
  const data = useLoaderData()

  return <View content={data} />
}
