import type { PloneContent } from 'plone-restapi-client/dist/content';

export interface BlockData<T = any> {
  id: string;
  data?: T;
  content?: T;
  styling?: { [key: string]: any };
  properties: { [key: string]: any };
  metadata?: { [key: string]: any };
  detached?: boolean;
  [key: string]: any;
}

export type BlockConfig = {
  id: string;
  title: string;
  view: React.ReactNode;
  variations?: BlockConfig[];
  getAsyncData?: () => {};
};

export type SlateElement = {
  [element: string]: ({
    attributes,
    data,
    children
  }: {
    attributes?: { [key: string]: any };
    data?: SlateElementData;
    children: JSX.Element[];
  }) => JSX.Element;
};

export type SlateElementData = {
  title: string;
  url?: string;
  link: {
    external?: {
      external_link: string;
      target?: string;
    };
    internal?: {
      internal_link: PloneContent[];
      target?: string;
    };
    email?: {
      email_address: string;
      email_subject?: string;
    };
  };
};

export type Settings = {
  siteTitle: string;
  isMultilingual: boolean;
  supportedLanguages: string[];
  defaultLanguage: string;
  internalApiPath: string;
  apiPath: string;
  publicURL: string;
  legacyTraverse: boolean;
  slate: {
    elements: SlateElement;
    topLevelTargetElements: string[];
    [key: string]: any;
  };
  nonContentRoutes: (string | RegExp)[];
  [key: string]: any;
};
