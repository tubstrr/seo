import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface SeoModuleOptions {
  auto: boolean;
  general: {
    tagline: string;
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
        | "other";
      link: string;
    }>;
    siteImage: string;
  };
  organization: {
    show: boolean;
    type: string;
    name: string;
    use: string;
    logo: string;
    address: {
      type: string;
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
      extra: Array<{
        key: string;
        value: any;
      }>;
    };
  };
  website: {
    show: boolean;
    type: string;
    name: string;
    url: string;
    search: {
      show: boolean;
      action: string;
    };
    extra: Array<{
      key: string;
      value: any;
    }>;
  };
  webpage: {
    show: boolean;
    type: string;
    url: string;
    image: string;
    datePublished: string;
    dateModified: string;
    extra: Array<{
      key: string;
      value: any;
    }>;
  };
  breadcrumbs: {
    show: boolean;
    excludedPaths: Array<string>;
  };
  schemas: Array<{
    hid: string;
    schema: object;
  }>;
  titleSeparator: string;
  titleTemplate: string;
  titleParams: object;
  favicon: {
    link: Array<{
      rel:
        | "apple-touch-icon"
        | "icon"
        | "mask-icon"
        | "manifest"
        | "shortcut icon";
      href: string;
      sizes?: "16x16" | "32x32" | "96x96" | "192x192" | "512x512";
      color?: string;
    }>;
    meta: Array<{
      name: "msapplication-TileColor" | "theme-color";
      content: string;
    }>;
  };
  locale: string;
}

export default defineNuxtModule<SeoModuleOptions>({
  meta: {
    name: "seo",
    configKey: "seo",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    auto: true,
    general: {
      locale: "en_US",
      tagline: "",
      social: [],
      siteImage: "",
    },

    organization: {
      show: true,
      type: "Organization",
      name: "",
      logo: "",
      url: "",
      address: {
        type: "PostalAddress",
        streetAddress: "",
        addressLocality: "",
        addressRegion: "",
        postalCode: "",
        addressCountry: "",
      },
      extra: [],
    },

    website: {
      show: true,
      type: "WebSite",
      name: "",
      url: "",
      search: {
        show: false,
        action: "",
      },
      extra: [],
    },

    webpage: {
      show: true,
      type: "WebPage",
      url: "",
      image: "",
      datePublished: "",
      dateModified: "",
      extra: [],
    },

    breadcrumbs: {
      show: true,
      excludedPaths: [],
    },

    favicon: {
      link: [],
      meta: [],
    },

    titleSeparator: "-",
    titleTemplate: "%s %separator %site.name",
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Add default title params
    options.templateParams = {
      site: {
        name: options?.website?.name,
      },
      separator: options.titleSeparator,
      tagline: options.general.tagline,
    };

    // Add seo key to app.seo config
    nuxt.options.runtimeConfig.app.seo = options;

    // Add composables directory
    addImportsDir(resolver.resolve("./runtime/composables"));

    // TODO: Add autoRun plugin if auto is true
    // if (options.auto) {
    addPlugin(resolver.resolve("./runtime/autoRun"));
    // }
  },
});
