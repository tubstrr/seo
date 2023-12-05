import type { SeoModuleOptions } from "~/src/module";

export const useSeo = (options: SeoModuleOptions | boolean = false) => {
  // Setup options
  options = initOptions(options);

  // Setup options.meta && options.link
  options.meta = options.meta || [];
  options.link = options.link || [];
  options.script = options.script || [];

  // Setup Title and Description
  const pageTitle = getPageTitle(options);
  const pageDescription = getPageDescription(options);
  // Setup Favicons
  const favicons = prepareFavicons(options);

  // TODO: When we do canonical URLs, we'll need to add the og:url tag here too
  // TODO: When we get Schema markup working, we'll need to add og:type tag here too
  const ogTags = prepareOpenGraphTags(options, pageTitle, pageDescription);

  // Setup Base Schema
  const schemas = [
    ...generateBaseSchema(options, pageTitle, pageDescription),
    ...generateExtraSchemas(options?.schemas || []),
  ];
  useHead({
    title: pageTitle,
    templateParams: options.templateParams,
    titleTemplate: options.titleTemplate,
    meta: [
      ...favicons.meta,
      ...options.meta,
      ...ogTags,
      {
        hid: "description",
        name: "description",
        content: pageDescription,
      },
    ],
    link: [...favicons.link, ...options.link],
    script: [...options.script, ...schemas],
  });
};

// Generate Extra Schemas
const generateExtraSchemas = (schemas: Array<{ hid; schema }>) => {
  if (!schemas) return [];
  if (typeof schemas === "object") {
    schemas = Object.values(schemas);
  }
  return schemas.map((schema) => {
    return {
      hid: schema.hid,
      type: "application/ld+json",
      innerHTML: schema.schema,
      processTemplateParams: true,
    };
  });
};

// Generate Base Schema
const generateBaseSchema = (
  options: SeoModuleOptions,
  title: string,
  description: string
) => {
  const schemas = [];
  // Add Organization Schema
  if (options?.organization?.show) {
    const organizationSchema = {
      hid: "defaultSeoBaseOrganizationSchema",
      type: "application/ld+json",
      innerHTML: {
        "@context": "https://schema.org",
        "@type": options?.organization?.type,
        name: options?.organization?.name,
        url: options?.organization?.url,
        logo: options?.organization?.logo,
        address: {
          "@type": "PostalAddress",
          streetAddress: options?.organization?.address?.streetAddress,
          addressLocality: options?.organization?.address?.addressLocality,
          addressRegion: options?.organization?.address?.addressRegion,
          postalCode: options?.organization?.address?.postalCode,
          addressCountry: options?.organization?.address?.addressCountry,
        },
      },
    };
    // sameAs: options?.general?.social?.map((social) => social.link),
    if (typeof options?.general?.social === "object") {
      options.general.social = Object.values(options.general.social);
    }

    if (options?.general?.social?.length) {
      organizationSchema.innerHTML.sameAs = options?.general?.social?.map(
        (social) => social.link
      );
    }
    if (options?.organization?.extra?.length) {
      organizationSchema.innerHTML = {
        ...organizationSchema.innerHTML,
        ...arrayToSchema(options?.organization?.extra),
      };
    }
    schemas.push(organizationSchema);
  }

  // Add Website Schema
  if (options?.website?.show) {
    const websiteSchema = {
      hid: "defaultSeoBaseWebsiteSchema",
      type: "application/ld+json",
      innerHTML: {
        "@context": "https://schema.org",
        "@type": options?.website?.type || "WebSite",
        "@id": options?.website?.url + "#website",
        name: options?.website?.name,
        url: options?.website?.url,
      },
    };
    if (options?.website?.search?.show) {
      websiteSchema.innerHTML.potentialAction = {
        "@type": "SearchAction",
        target: options?.website?.search?.action + "{search_term_string}",
        "query-input": "required name=search_term_string",
      };
    }

    if (options?.website?.extra?.length) {
      websiteSchema.innerHTML = {
        ...websiteSchema.innerHTML,
        ...arrayToSchema(options?.website?.extra),
      };
    }
    schemas.push(websiteSchema);
  }

  // Add WebPage Schema
  if (options?.webpage?.show) {
    const webpageSchema = {
      hid: "defaultSeoBaseWebpageSchema",
      type: "application/ld+json",
      processTemplateParams: true,
      innerHTML: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": options?.website?.url + options?.webpage?.url + "#webpage",
        url: options?.website?.url,
        name: options?.titleTemplate,
        isPartOf: {
          "@type": options?.website?.type || "WebSite",
          "@id": options?.website?.url + "#website",
        },
        // datePublished: options?.webpage?.datePublished,
        // dateModified: options?.webpage?.dateModified,
        description: description,
        inLanguage: options?.locale,
        potentialAction: [
          {
            "@type": "ReadAction",
            target: [options?.webpage?.url],
          },
        ],
      },
    };
    // Add datePublished and dateModified
    if (options?.webpage?.datePublished) {
      webpageSchema.innerHTML.datePublished = options?.webpage?.datePublished;
    }
    if (options?.webpage?.dateModified) {
      webpageSchema.innerHTML.dateModified = options?.webpage?.dateModified;
    }

    // Add extra properties
    if (options?.webpage?.extra?.length) {
      webpageSchema.innerHTML = {
        ...webpageSchema.innerHTML,
        ...arrayToSchema(options?.webpage?.extra),
      };
    }
    schemas.push(webpageSchema);
  }

  // Add BreadCrumb Schema
  if (options?.breadcrumbs?.show) {
    const breadcrumbSchema = {
      hid: "defaultSeoBaseBreadcrumbSchema",
      type: "application/ld+json",
      innerHTML: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [...generateBreadcrumbList(options, title)],
      },
    };
    if (useRoute().path !== "/") {
      schemas.push(breadcrumbSchema);
    }
  }

  return schemas;
};

// Generate Breadcrumb List
const generateBreadcrumbList = (options: SeoModuleOptions, title: string) => {
  const ListElements = [
    {
      "@type": "ListItem",
      position: 1,
      name: options?.website?.name || "Home",
      item: options?.website?.url,
    },
  ];
  const segments = useRoute().path.slice(1).split("/");
  const path = useRoute().path;
  if (path === "/") return [];
  let onGoingPath = "";
  const excludedPaths = options?.breadcrumbs?.excludedPaths;
  const hasExcludedPaths = excludedPaths?.length;

  segments.forEach((segment, index) => {
    onGoingPath += "/" + segment;
    const position = ListElements.length + 1;
    const name = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const item = options?.website?.url + onGoingPath;

    if (hasExcludedPaths && excludedPaths?.includes("/" + segment)) return;
    const ListElement = {
      "@type": "ListItem",
      position,
      name,
    };

    if (index !== segments.length - 1) {
      ListElement.item = item;
    }

    ListElements.push(ListElement);
  });

  return ListElements;
};

// Convert array of objects to schema
const arrayToSchema = (array: Array<{ key; value }>) => {
  const schema = {};
  array.forEach((item) => {
    schema[item.key] = item.value;
  });
  return schema;
};

// Prepare Open Graph Tags
const prepareOpenGraphTags = (
  options: SeoModuleOptions,
  title: string,
  description: string
) => {
  const tags = [];
  // og:title
  tags.push({
    hid: "og:title",
    property: "og:title",
    content: options.titleTemplate,
  });
  // og:description
  tags.push({
    hid: "og:description",
    property: "og:description",
    content: description,
  });
  // og:image
  tags.push({
    hid: "og:image",
    property: "og:image",
    content: options?.webpage?.image || options?.general?.default_image,
  });
  // og:site_name
  tags.push({
    hid: "og:site_name",
    property: "og:site_name",
    content: options?.website?.name,
  });
  // og:locale
  tags.push({
    hid: "og:locale",
    property: "og:locale",
    content: options?.locale,
  });
  // og:type
  tags.push({
    hid: "og:type",
    property: "og:type",
    content: "website",
  });
  // name="twitter:card" content="summary"
  tags.push({
    hid: "twitter:card",
    name: "twitter:card",
    content: "summary",
  });
  // name="twitter:site" content="@thisismess"
  const twitter = Object.values(options?.general?.social).find(
    (social) => social.type === "twitter" || social.type === "x"
  );
  if (twitter) {
    tags.push({
      hid: "twitter:site",
      name: "twitter:site",
      content: twitter.link,
    });
  }
  // name="twitter:title" content="Mess Marketing"
  tags.push({
    hid: "twitter:title",
    name: "twitter:title",
    content: title,
  });
  // name="twitter:description" content="We help businesses grow."
  tags.push({
    hid: "twitter:description",
    name: "twitter:description",
    content: description,
  });
  // name="twitter:image" content="https://s3.amazonaws.com/thisismess-assets/mess/live/static/img/og-share-image.jpg"
  tags.push({
    hid: "twitter:image",
    name: "twitter:image",
    content: options.default_image,
  });
  // name="twitter:image:alt" content="Mess Marketing"
  tags.push({
    hid: "twitter:image:alt",
    name: "twitter:image:alt",
    content: title,
  });
  return tags;
};

// Prepare Favicons
const prepareFavicons = (options: SeoModuleOptions) => {
  const favicons = {
    link: [],
    meta: [],
  };

  Object.values(options?.favicon?.link).forEach((favicon) => {
    favicons.link.push({
      rel: favicon.rel,
      sizes: favicon.sizes,
      href: favicon.href,
    });
  });
  Object.values(options?.favicon?.meta).forEach((favicon) => {
    favicons.meta.push({
      name: favicon.name,
      content: favicon.content,
    });
  });

  return favicons;
};

// Get page title
const getPageTitle = (options: SeoModuleOptions, title: string = "") => {
  // If title is provided, use it
  title = options?.title;
  // Otherwise, get the title from the route path
  if (!title) {
    const route = useRoute();
    const path = route?.path;
    if (!path) return "";
    if (path === "/") return "Home";
    else title = pathToTitle(path);
  }
  return title;
};

// Get page description
const getPageDescription = (options: SeoModuleOptions) => {
  // If description is provided, use it
  let description = options?.description;
  // Otherwise, get the description from the tagline
  if (!description) {
    description = options?.general?.tagline;
  }
  return description;
};

// Function to convert path to title
const pathToTitle = (path: string) => {
  // Remove the leading slash and split the path into segments
  const segments = path.slice(1).split("/");

  // Capitalize the first letter of each segment and join them with spaces
  const title = segments
    .map((segment) =>
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .join(" - ")
    .split(" - ")
    .pop();

  return title;
};

// Get options from runtime config and merge with module options
const initOptions = (options: SeoModuleOptions | boolean = false) => {
  // Deep freeze the options object
  const seoOptions = JSON.parse(
    JSON.stringify(useRuntimeConfig().app?.seo)
  ) as SeoModuleOptions;

  // Setup webpage variables
  if (seoOptions?.webpage?.show) {
    seoOptions.webpage.url = useRoute().path;
  }

  if (!options) {
    options = seoOptions;
  }

  return deepMerge(seoOptions, options);
};

// Deep merge two objects
const deepMerge = (target: any, source: any) => {
  const output = Object.assign({}, target);
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object)
      output[key] = deepMerge(output[key], source[key]);
    else output[key] = source[key];
  }
  return output;
};
