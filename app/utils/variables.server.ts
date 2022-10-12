import invariant from 'tiny-invariant';

invariant(
  process.env.PLONE_RESTAPI_URL,
  'Missing PLONE_RESTAPI_URL env variable'
);
const PLONE_RESTAPI_URL = process.env.PLONE_RESTAPI_URL;

invariant(process.env.PUBLIC_URL, 'Missing PUBLIC_URL env variable');
const PUBLIC_URL = process.env.PUBLIC_URL;

export { PLONE_RESTAPI_URL, PUBLIC_URL };
