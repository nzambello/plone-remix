import type { SlateElementData, Settings, BlockConfig } from 'types/blocks';
import { PLONE_RESTAPI_URL, PUBLIC_URL } from '~/utils/variables.server';

/*
 * Blocks
 */

import TitleBlock from './blocks/views/Title';
import DescriptionBlock from './blocks/views/Description';
import TextBlock from './blocks/views/Text';
import HTMLBlock from './blocks/views/HTML';
import TableBlock from './blocks/views/Table';
import ImageBlock from './blocks/views/Image';
import MapsBlock from './blocks/views/Maps';
import LeadImage from './blocks/views/LeadImage';
import VideoBlock from './blocks/views/Video';

const LinkElement = ({
  attributes,
  data,
  children
}: {
  attributes?: { [key: string]: any };
  data?: SlateElementData;
  children: JSX.Element[];
}) => {
  const internal_link = data?.link?.internal?.internal_link?.[0]?.['@id'];
  const external_link = data?.link?.external?.external_link;
  const email = data?.link?.email;

  const target = data?.link?.internal?.target ?? data?.link?.external?.target;

  const href = email
    ? `mailto:${email.email_address}${
        email.email_subject ? `?subject=${email.email_subject}` : ''
      }`
    : external_link || internal_link || data?.url;

  return (
    <a
      {...attributes}
      href={href}
      title={data?.title}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
};

const settings: Settings = {
  siteTitle: 'Plome Remix',

  isMultilingual: true,
  supportedLanguages: ['en', 'it'],
  defaultLanguage: 'it',
  internalApiPath: PLONE_RESTAPI_URL,
  apiPath: PLONE_RESTAPI_URL,
  publicURL: PUBLIC_URL,
  legacyTraverse: false,

  slate: {
    topLevelTargetElements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

    // Default rendered elements
    elements: {
      default: ({ attributes, children }) => <p {...attributes}>{children}</p>,

      h1: ({ attributes, children }) => <h1 {...attributes}>{children}</h1>,
      h2: ({ attributes, children }) => <h2 {...attributes}>{children}</h2>,
      h3: ({ attributes, children }) => <h3 {...attributes}>{children}</h3>,
      h4: ({ attributes, children }) => <h4 {...attributes}>{children}</h4>,

      li: ({ attributes, children }) => <li {...attributes}>{children}</li>,
      ol: ({ attributes, children }) => <ol {...attributes}>{children}</ol>,
      ul: ({ attributes, children }) => {
        return <ul {...attributes}>{children}</ul>;
      },

      div: ({ attributes, children }) => <div {...attributes}>{children}</div>,
      p: ({ attributes, children }) => {
        return <p {...attributes}>{children}</p>;
      },

      // While usual slate editor consider these to be Leafs, we treat them as
      // inline elements because they can sometimes contain elements (ex:
      // <b><a/></b>
      em: ({ children }) => <em>{children}</em>,
      i: ({ children }) => <i>{children}</i>,
      b: ({ children }) => {
        return <b>{children}</b>;
      },
      strong: ({ children }) => {
        return <strong>{children}</strong>;
      },
      u: ({ children }) => <u>{children}</u>,
      s: ({ children }) => <del>{children}</del>,
      del: ({ children }) => <del>{children}</del>,
      sub: ({ children }) => <sub>{children}</sub>,
      sup: ({ children }) => <sup>{children}</sup>,
      code: ({ children }) => <code>{children}</code>,

      blockquote: ({ children }) => <blockquote>{children}</blockquote>,
      a: LinkElement
    }
  },
  nonContentRoutes: [
    /\?.*$/,
    /\/add$/,
    '/contents',
    '/delete',
    '/diff',
    /\/edit$/,
    '/history',
    '/layout',
    '/login',
    '/logout',
    '/sitemap',
    '/register',
    '/sharing',
    '/search',
    '/change-password',
    /\/controlpanel\/.*$/,
    '/controlpanel',
    '/contact-form',
    '/personal-information',
    '/personal-preferences',
    '/register',
    /\/passwordreset\/.*$/,
    '/passwordreset',
    '/create-translation',
    '/manage-translations'
  ]
};

const blocksConfig: { [type: string]: BlockConfig } = {
  title: {
    id: 'title',
    title: 'Title',
    view: TitleBlock
  },
  description: {
    id: 'description',
    title: 'Description',
    view: DescriptionBlock
  },
  slate: {
    id: 'slate',
    title: 'Rich text',
    view: TextBlock
  },
  text: {
    id: 'slate',
    title: 'Rich text',
    view: TextBlock
  },
  html: {
    id: 'html',
    title: 'HTML',
    view: HTMLBlock
  },
  table: {
    id: 'table',
    title: 'Table',
    view: TableBlock
  },
  slateTable: {
    id: 'slateTable',
    title: 'Table',
    view: TableBlock
  },
  image: {
    id: 'image',
    title: 'Image',
    view: ImageBlock
  },
  maps: {
    id: 'maps',
    title: 'Maps',
    view: MapsBlock
  },
  leadimage: {
    id: 'leadimage',
    title: 'Lead Image Field',
    view: LeadImage
  },
  video: {
    id: 'video',
    title: 'Video',
    view: VideoBlock
  }
  // listing: {
  //   id: 'listing',
  //   title: 'Listing',
  //   view: ViewListingBlock,
  //   variations: [
  //     {
  //       id: 'default',
  //       isDefault: true,
  //       title: 'Default',
  //       template: DefaultListingBlockTemplate
  //     },
  //     {
  //       id: 'imageGallery',
  //       title: 'Image gallery',
  //       template: ImageGalleryListingBlockTemplate
  //     },
  //     {
  //       id: 'summary',
  //       title: 'Summary',
  //       template: SummaryListingBlockTemplate
  //     }
  //   ],
  //   getAsyncData: getListingBlockAsyncData
  // },
  // toc: {
  //   id: 'toc',
  //   title: 'Table of Contents',
  //   view: ViewToCBlock,
  //   variations: ToCVariations
  // },
  // hero: {
  //   id: 'hero',
  //   title: 'Hero',
  //   view: ViewHeroImageLeftBlock
  // },
  // search: {
  //   id: 'search',
  //   title: 'Search',
  //   view: SearchBlockView,
  //   variations: [
  //     {
  //       id: 'facetsRightSide',
  //       title: 'Facets on right side',
  //       view: RightColumnFacets
  //     },
  //     {
  //       id: 'facetsLeftSide',
  //       title: 'Facets on left side',
  //       view: LeftColumnFacets
  //     },
  //     {
  //       id: 'facetsTopSide',
  //       title: 'Facets on top',
  //       view: TopSideFacets
  //     }
  //   ],
  //   extensions: {
  //     facetWidgets: {
  //       rewriteOptions: (name, choices) => {
  //         return name === 'review_state'
  //           ? choices.map((opt) => ({
  //               ...opt,
  //               label: opt.label.replace(/\[.+\]/, '').trim()
  //             }))
  //           : choices
  //       },
  //       types: [
  //         {
  //           id: 'selectFacet',
  //           title: 'Select',
  //           view: SelectFacet,
  //           isDefault: true,
  //           schemaEnhancer: SelectFacet.schemaEnhancer,
  //           stateToValue: SelectFacet.stateToValue,
  //           valueToQuery: SelectFacet.valueToQuery,
  //           filterListComponent: SelectFacetFilterListEntry
  //         },
  //         {
  //           id: 'checkboxFacet',
  //           title: 'Checkbox',
  //           view: CheckboxFacet,
  //           isDefault: false,
  //           schemaEnhancer: CheckboxFacet.schemaEnhancer,
  //           stateToValue: CheckboxFacet.stateToValue,
  //           valueToQuery: CheckboxFacet.valueToQuery,
  //           filterListComponent: SelectFacetFilterListEntry
  //         },
  //         {
  //           id: 'daterangeFacet',
  //           title: 'Date range',
  //           view: DateRangeFacet,
  //           isDefault: false,
  //           stateToValue: DateRangeFacet.stateToValue,
  //           valueToQuery: DateRangeFacet.valueToQuery,
  //           filterListComponent: DateRangeFacetFilterListEntry
  //         },
  //         {
  //           id: 'toggleFacet',
  //           title: 'Toggle',
  //           view: ToggleFacet,
  //           isDefault: false,
  //           stateToValue: ToggleFacet.stateToValue,
  //           valueToQuery: ToggleFacet.valueToQuery,
  //           filterListComponent: ToggleFacetFilterListEntry
  //         }
  //       ]
  //     }
  //   }
  // }
};

export default { blocksConfig, settings };
