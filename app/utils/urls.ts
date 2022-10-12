/**
 * Url helpers.
 * @module utils/urls
 */

import memoize from 'lodash.memoize';
import { urlRegex, telRegex, mailRegex } from './urlRegex';
import config from '../config';

/**
 * @source https://github.com/sindresorhus/prepend-http
 *
 * Prepend `https://` to humanized URLs like `sindresorhus.com` and `localhost`.
 * @param url - The URL to prepend `https://` to.
 * @example
 * ```
 * import prependHttp from 'prepend-http';
 * prependHttp('sindresorhus.com');
 * //=> 'https://sindresorhus.com'
 * prependHttp('localhost', {https: false});
 * //=> 'http://localhost'
 * prependHttp('https://sindresorhus.com');
 * //=> 'https://sindresorhus.com'
 * ```
 */
function prependHttp(url: string, https = true): string {
  url = url.trim();
  if (/^\.*\/|^(?!localhost)\w+?:/.test(url)) {
    return url;
  }
  return url.replace(/^(?!(?:\w+?:)?\/\/)/, https ? 'https://' : 'http://');
}

/**
 * @source lodash
 *
 * Gets the last element of `array`.
 *
 * @static
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array: Array<any>): any {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

/**
 * Get base url.
 * @function getBaseUrl
 * @param {string} url Url to be parsed.
 * @return {string} Base url of content object.
 */
export const getBaseUrl = memoize((url: string) => {
  const { settings } = config;
  if (url === undefined) return;

  // We allow settings.nonContentRoutes to have strings (that are supposed to match
  // ending strings of pathnames, so we are converting them to RegEx to match also
  const normalized_nonContentRoutes = settings.nonContentRoutes.map((item) => {
    if (typeof item === 'string') {
      return new RegExp(item + '$');
    } else {
      return item;
    }
  });

  let adjustedUrl = normalized_nonContentRoutes.reduce(
    (acc: string, item: any) => acc.replace(item, ''),
    url
  );

  adjustedUrl = adjustedUrl || '/';
  return adjustedUrl === '/' ? '' : adjustedUrl;
});

/**
 * Get parent url.
 * @function getParentUrl
 * @param {string} url Url to be parsed.
 * @return {string} Parent url of content object.
 */
export const getParentUrl = memoize((url: string) => {
  return url.substring(0, url.lastIndexOf('/'));
});

/**
 * Get id from url.
 * @function getId
 * @param {string} url Url to be parsed.
 * @return {string} Id of content object.
 */
export function getId(url: string): string {
  return last(url.replace(/\?.*$/, '').split('/'));
}

/**
 * Get view of an url.
 * @function getView
 * @param {string} url Url to be parsed.
 * @return {string} View of content object.
 */
export function getView(url: string): string {
  const view = last(url.replace(/\?.*$/, '').split('/'));
  if (
    [
      'add',
      'layout',
      'contents',
      'edit',
      'delete',
      'diff',
      'history',
      'sharing',
      'controlpanel'
    ].indexOf(view) === -1
  ) {
    return 'view';
  }
  return view === 'layout' ? 'edit' : view;
}

/**
 * Flatten to app server URL - Given a URL if it starts with the API server URL
 * this method flattens it (removes) the server part
 * TODO: Update it when implementing non-root based app location (on a
 * directory other than /, eg. /myapp)
 * @method flattenToAppURL
 * @param {string} url URL of the object
 * @returns {string} Flattened URL to the app server
 */
export function flattenToAppURL(url: string): string {
  const { settings } = config;
  return (
    url &&
    url
      .replace(settings.internalApiPath, '')
      .replace(settings.apiPath, '')
      .replace(settings.publicURL, '')
  );
}
/**
 * Given a URL it remove the querystring from the URL.
 * @method stripQuerystring
 * @param {string} url URL of the object
 * @returns {string} URL without querystring
 */
export function stripQuerystring(url: string): string {
  return url.replace(/\?.*$/, '');
}

/**
 * Given a URL if it starts with the API server URL
 * this method removes the /api or the /Plone part.
 * @method toPublicURL
 * @param {string} url URL of the object
 * @returns {string} public URL
 */
export function toPublicURL(url: string): string {
  const { settings } = config;
  return settings.publicURL.concat(flattenToAppURL(url));
}

/**
 * Returns true if the current view is a cms ui view
 * @method isCmsUi
 * @param {string} currentPathname pathname of the current view
 * @returns {boolean} true if the current view is a cms ui view
 */
export const isCmsUi = memoize((currentPathname: string) => {
  const { settings } = config;
  const fullPath = currentPathname.replace(/\?.*$/, '');
  // WARNING:
  // not working properly for paths like /editors or similar
  // because the regexp test does not take that into account
  // https://github.com/plone/volto/issues/870
  return settings.nonContentRoutes.reduce(
    (acc: any, route: string | RegExp) =>
      acc || new RegExp(route).test(`/${fullPath}`),
    false
  );
});

/**
 * Flatten to app server HTML - Given a text if it contains some urls that starts
 * with the API server URL this method flattens it (removes) the server part.
 * TODO: Update it when implementing non-root based app location (on a
 * directory other than /, eg. /myapp)
 * @method flattenHTMLToAppURL
 * @param {string} html Some html snippet
 * @returns {string} Same HTML with Flattened URLs to the app server
 */
export function flattenHTMLToAppURL(html: string): string {
  const { settings } = config;
  return settings.internalApiPath
    ? html
        .replace(new RegExp(settings.internalApiPath, 'g'), '')
        .replace(new RegExp(settings.apiPath, 'g'), '')
    : html.replace(new RegExp(settings.apiPath, 'g'), '');
}

/**
 * Add the app url
 * @method addAppURL
 * @param {string} url URL of the object
 * @returns {string} New URL with app
 */
export function addAppURL(url: string): string {
  const { settings } = config;
  return url.indexOf(settings.apiPath) === 0
    ? url
    : `${settings.apiPath}${url}`;
}

/**
 * Given a URL expands it to the backend URL
 * Useful when you have to actually call the backend from the
 * frontend code (eg. ICS calendar download)
 * It is seamless mode aware
 * @method expandToBackendURL
 * @param {string} path URL or path of the object
 * @returns {string} New URL with the backend URL
 */
export function expandToBackendURL(path: string): string {
  const { settings } = config;
  const APISUFIX = settings.legacyTraverse ? '' : '/++api++';
  let adjustedPath;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // flattenToAppURL first if we get a full URL
    adjustedPath = flattenToAppURL(path);
  } else {
    // Next adds a / in front if not a full URL to make sure it's a valid relative path
    adjustedPath = path[0] !== '/' ? `/${path}` : path;
  }

  let apiPath = '';
  //  if (settings.internalApiPath && __SERVER__) {
  //    apiPath = settings.internalApiPath;
  //  } else if (settings.apiPath) {
  //    apiPath = settings.apiPath;
  //  }
  if (settings.apiPath) {
    apiPath = settings.apiPath;
  }

  return `${apiPath}${APISUFIX}${adjustedPath}`;
}

/**
 * Check if internal url
 * @method isInternalURL
 * @param {string} url URL of the object
 * @returns {boolean} True if internal url
 */
export function isInternalURL(url: string): boolean {
  const { settings } = config;
  return (
    !!url &&
    (url.includes(settings.publicURL) ||
      (!!settings.internalApiPath && url.includes(settings.internalApiPath)) ||
      url.includes(settings.apiPath) ||
      url.charAt(0) === '/' ||
      url.charAt(0) === '.' ||
      url.startsWith('#'))
  );
}

/**
 * Check if it's a valid url
 * @method isUrl
 * @param {string} url URL of the object
 * @returns {boolean} True if is a valid url
 */
export function isUrl(url: string): boolean {
  return urlRegex().test(url);
}

/**
 * Normalize URL, adds protocol (if required eg. user has not entered the protocol)
 * @method normalizeUrl
 * @param {string} url URL of the object
 * @returns {string} URL with the protocol
 */
export function normalizeUrl(url: string): string {
  return prependHttp(url);
}

/**
 * Removes protocol from URL (for display)
 * @method removeProtocol
 * @param {string} url URL of the object
 * @returns {string} URL without the protocol part
 */
export function removeProtocol(url: string): string {
  return url.replace('https://', '').replace('http://', '');
}

export function isMail(text: string) {
  return mailRegex().test(text);
}

export function isTelephone(text: string) {
  return telRegex().test(text);
}

export function normaliseMail(email: string) {
  if (email.toLowerCase().startsWith('mailto:')) {
    return email;
  }
  return `mailto:${email}`;
}

export function normalizeTelephone(tel: string) {
  if (tel.toLowerCase().startsWith('tel:')) {
    return tel;
  }
  return `tel:${tel}`;
}

export function checkAndNormalizeUrl(url: string) {
  let res = {
    isMail: false,
    isTelephone: false,
    url: url,
    isValid: true
  };
  if (URLUtils.isMail(URLUtils.normaliseMail(url))) {
    //Mail
    res.isMail = true;
    res.url = URLUtils.normaliseMail(url);
  } else if (URLUtils.isTelephone(url)) {
    //Phone
    res.isTelephone = true;
    res.url = URLUtils.normalizeTelephone(url);
  } else {
    //url
    if (!res.url.startsWith('/') && !res.url.startsWith('#')) {
      res.url = URLUtils.normalizeUrl(url);
      if (!URLUtils.isUrl(res.url)) {
        res.isValid = false;
      }
    }
  }
  return res;
}

export const URLUtils = {
  normalizeTelephone,
  normaliseMail,
  normalizeUrl,
  isTelephone,
  isMail,
  isUrl,
  checkAndNormalizeUrl
};
