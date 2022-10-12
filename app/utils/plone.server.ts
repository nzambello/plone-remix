import ploneClient from 'plone-restapi-client';
import { PLONE_RESTAPI_URL } from './variables.server';

ploneClient.client.init(PLONE_RESTAPI_URL);

export default ploneClient;
