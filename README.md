# SEO

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

SEO module on Nuxt3 that helps you write title's, descriptions, favicons, and Schema's for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
  <!-- - [🏀 Online playground](https://stackblitz.com/github/tubstrr/seo?file=playground%2Fapp.vue) -->
  <!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->

- Easy page title and description
- One time setup favicon
- One time setup Schema markup
- Easy to extend

## Quick Setup

1. Add `@tubstrr/seo` dependency to your project

```bash
# Using pnpm
pnpm add -D @tubstrr/seo

# Using yarn
yarn add --dev @tubstrr/seo

# Using npm
npm install --save-dev @tubstrr/seo
```

2. Add `@tubstrr/seo` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: ["@tubstrr/seo"],
});
```

3. Do a onetime SEO setup

```js
export default defineNuxtConfig({
  seo: {
    auto: false,
    locale: "en_US",
    general: {
      tagline: "We are a fiercely independent design and development studio.",
      defaultImage: "https://example.com/og-share-image.jpg",
      social: [
        {
          type: "facebook",
          link: "https://www.facebook.com/thisismess/",
        },
        {
          type: "twitter",
          link: "https://twitter.com/thisismess",
        },
        {
          type: "instagram",
          link: "https://www.instagram.com/thisismess",
        },
        {
          type: "linkedin",
          link: "https://www.linkedin.com/company/mess-marketing",
        },
        {
          type: "youtube",
          link: "https://www.youtube.com/@MessMakesVideos",
        },
      ],
    },
    organization: {
      name: "This is Mess",
      url: "https://thisismess.com",
      logo: "https://example.com/favicons/apple-touch-icon.png",
      address: {
        streetAddress: "1824 W Grand Ave #200",
        addressLocality: "Chicago",
        addressRegion: "IL",
        postalCode: "60622",
        addressCountry: "US",
      },
      extra: [
        {
          key: "ContactPoint",
          value: {
            name: "Jon Knoll",
            url: "https://jonknoll.dev",
            email: "jknoll@thisismess.com",
            image: "https://jonknoll.dev/wp-content/uploads/2021/03/use-2.jpg",
          },
        },
        { key: "email", value: "contact@thisismess.com" },
      ],
    },
    website: {
      show: true,
      name: "Mess Marketing",
      url: "https://thisismess.com",
      search: {
        show: true,
        action: "https://thisismess.com/search?search=",
      },
    },
    favicon: {
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "https://example.com/favicons/apple-touch-icon.png",
        },
        {
          rel: "icon",
          sizes: "32x32",
          href: "https://example.com/favicons/favicon-32x32.png",
        },
        {
          rel: "icon",
          sizes: "16x16",
          href: "https://example.com/favicons/favicon-16x16.png",
        },
        {
          rel: "manifest",
          href: "https://example.com/favicons/site.webmanifest",
        },
        {
          rel: "mask-icon",
          color: "#37dbff",
          href: "https://example.com/favicons/safari-pinned-tab.svg",
        },
        {
          rel: "shortcut icon",
          href: "https://example.com/favicons/favicon.ico",
        },
      ],
      meta: [
        {
          name: "msapplication-TileColor",
          content: "#ffffff",
        },
        {
          name: "theme-color",
          content: "#ffffff",
        },
      ],
    },
  },
});
```

That's it! You can now use SEO in your Nuxt app ✨

## Documentation

### Key Concepts

#### `useSeo()` composable

The `useSeo()` composable performs all the `useHead()` manipulations, based on the `SeoModulesOptions` object.

The first thing that the composable does is merge any options passed into it with the options set by the `nuxt.config` (You can see options currently set at `useRuntimeConfig().app.seo`)

The main concept is that you'll be able to write a simple ORM to map your API's into this configuration, and then it'll just work. As an example the `webpage` schema expects these keys:

- `title`
- `description`
- `datePublished`
- `dateModified`

If none are provided, `useSeo()` will use the slug to get the title, and the `general.tagline` for the description, and not show the dates.

You can easily augment this with data from your API by mapping values like this on your `[...slug].vue`:

```js
const route = useRoute();
const {data} = useFetch('/api', {
  query: {
    slug: route.path
  }
})
const options = {
  title: data.value['title'],
  description: data.value['description']
  webpage: {
    image: data.value['social-share-image'],
    datePublished: data.value['publish-date']
    dateModified: data.value['modified-date']
  }
}

useSeo(options);
```

#### Full SEO Options

These are all the options that the `useSeo()` will use. When the composable is called, it will merge the `options` object that is passed into the function, with `nuxt.config.seo` object, preferring the object passed into the function.

Here are all the options available to the `nuxt.config.seo` object:

```js
// Module options TypeScript interface definition
export interface SeoModuleOptions {
  auto: boolean;
  locale: string;
  general: {
    tagline: string,
    defaultImage: string,
    social: Array<{
      type:
        | "facebook"
        | "twitter"
        | "x"
        | "youtube"
        | "instagram"
        | "linkedin"
        | "pinterest"
        | "tumblr"
        | "reddit"
        | "other",
      link: string,
    }>,
  };
  organization: {
    show: boolean,
    type: string,
    name: string,
    use: string,
    logo: string,
    address: {
      type: string,
      streetAddress: string,
      addressLocality: string,
      addressRegion: string,
      postalCode: string,
      addressCountry: string,
      extra: Array<{
        key: string,
        value: any,
      }>,
    },
  };
  website: {
    show: boolean,
    type: string,
    name: string,
    url: string,
    search: {
      show: boolean,
      action: string,
    },
    extra: Array<{
      key: string,
      value: any,
    }>,
  };
  webpage: {
    show: boolean,
    type: string,
    url: string,
    image: string,
    datePublished: string,
    dateModified: string,
    extra: Array<{
      key: string,
      value: any,
    }>,
  };
  breadcrumbs: {
    show: boolean,
    excludedPaths: Array<string>,
  };
  schemas: Array<{
    hid: string,
    schema: object,
  }>;
  title: {
    separator: string;
    template: string;
    params: object;
  }
  favicon: {
    link: Array<{
      rel:
        | "apple-touch-icon"
        | "icon"
        | "mask-icon"
        | "manifest"
        | "shortcut icon",
      href: string,
      sizes?: "16x16" | "32x32" | "96x96" | "192x192" | "512x512",
      color?: string,
    }>,
    meta: Array<{
      name: "msapplication-TileColor" | "theme-color",
      content: string,
    }>,
  };
}
```

#### auto: true/false

The `auto` key defaults to `true`, here is the code that takes this into account.

Basic idea is that if you don't want to write your own lifecycle, we'll call `useSeo()` automatically for you server side, and then when the page has finished rendering.

```js
const options = useRuntimeConfig().app?.seo;
if (!options?.auto) return;
// Server side on initial render
useSeo();
nuxtApp.hook("page:finish", () => {
  useSeo();
});
```

#### <schema>.show

You can hide any of the default schema pieces by setting <schema>.show to `false`.

```js
export default defineNuxtConfig({
  seo {
    webpage: {
      show: false
    }
  }
})
```

```js
if (options?.<schema>?.show) {
  const <schema> = {
    hid: "defaultSeoBase<schema>Schema",
    type: "application/ld+json",
    processTemplateParams: true,
    innerHTML: {...}
  }
  // ...
  schema.push(<schema>)
}
```

#### <schema>.extra

All base schema's allow for you to extend, or override any key value pair. The `extra` key allows you to write and array of key value pairs that will be injected into the base schema.

##### Example:

This will inject both the `ContactPoint` and `email` schema piece into the base `organization` schema piece

```js
export default defineNuxtConfig({
  seo {
    organization: {
      extra: [
        {
          key: "ContactPoint",
          value: {
            name: "Jon Knoll",
            url: "https://jonknoll.dev",
            email: "jknoll@thisismess.com",
            image: "https://jonknoll.dev/wp-content/uploads/2021/03/use-2.jpg",
          },
        },
        { key: "email", value: "contact@thisismess.com" },
      ]
    }
  }
})
```

#### schemas key

There are a lot of schemas out there, and there's no way we'll be able to have them automated for every site, nor should we try! This is where the `schemas` key comes in.

Similar to the `extra` key inside the base schemas, you'll be able to add your own schema pieces by adding a script ID (hid), and the schema JSON inside the `options.schemas` key. Here is an example of an event schema that will also hide the `webpage`:

```js
const options = {
  webpage: {
    show: false
  }
  schemas: [
    {
      hid: "justinBieber",
      schema: {
        "@context": "https://schema.org",
        "@type": "Event",
        name: "Name",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vestibulum nulla ut nibh vulputate egestas.",
        image: "https://example.com/images/jb.jpg",
        startDate: "2023-12-08T08:00",
        endDate: "2023-12-08T12:00",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: "Mess",
          address: {
            "@type": "PostalAddress",
            streetAddress: "1234 W Street St",
            addressLocality: "Chicago",
            addressRegion: "IL",
            postalCode: "60622",
            addressCountry: "US",
          },
        },
        performer: {
          "@type": "MusicGroup",
          name: "Justin Bieber",
        },
        offers: {
          "@type": "Offer",
          name: "General Admission",
          price: "50",
          priceCurrency: "",
          validFrom: "2023-12-04",
          url: "https://example.com/events/jb",
          availability: "https://schema.org/InStock",
        },
      },
    },
  ],
};

useSeo(options)
```

#### title key

The title key, is a simple way to augment [unhead](https://unhead.unjs.io/usage/composables/use-head)'s [`titleTemplate`](https://unhead.unjs.io/usage/guides/title-template), and [`templateParams`](https://unhead.unjs.io/usage/guides/template-params)

Here are the default options that are set for `useSeo()`:

```js
// Add default title params
options.titles.params = {
  site: {
    name: options?.website?.name,
  },
  separator: options.titles.separator,
  tagline: options.general.tagline,
};
```

#### favicon key....

There isn't really a way to trim this down. You can use a [favicon generator](https://realfavicongenerator.net/), or you can just use a simple `.png`, it's up to you! Inside the `favicon` key there is support for the correct `link`s and `meta` tags.

Here is the simplest example:

```js
seo: {
  favicon: {
    link: [
      {
        rel: "icon",
        sizes: "32x32",
        href: "https://example.com/favicons/favicon-32x32.png",
      },
    ];
  }
}
```

Here is a full setup:

```js
seo: {
  favicon: {
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "https://example.com/favicons/apple-touch-icon.png",
        },
        {
          rel: "icon",
          sizes: "32x32",
          href: "https://example.com/favicons/favicon-32x32.png",
        },
        {
          rel: "icon",
          sizes: "16x16",
          href: "https://example.com/favicons/favicon-16x16.png",
        },
        {
          rel: "manifest",
          href: "https://example.com/favicons/site.webmanifest",
        },
        {
          rel: "mask-icon",
          color: "#37dbff",
          href: "https://example.com/favicons/safari-pinned-tab.svg",
        },
        {
          rel: "shortcut icon",
          href: "https://example.com/favicons/favicon.ico",
        },
      ],
      meta: [
        {
          name: "msapplication-TileColor",
          content: "#ffffff",
        },
        {
          name: "theme-color",
          content: "#ffffff",
        },
      ],
    }
}
```

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint
# or npx eslint .

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/seo/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/seo
[npm-downloads-src]: https://img.shields.io/npm/dm/seo.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/seo
[license-src]: https://img.shields.io/npm/l/seo.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/seo
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
