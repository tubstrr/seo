export default defineNuxtConfig({
  seo: {
    auto: false,
    locale: "en_US",
    general: {
      tagline: "We are a fiercely independent design and development studio.",
      default_image:
        "https://s3.amazonaws.com/thisismess-assets/mess/live/static/img/og-share-image.jpg",
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
      logo: "https://s3.amazonaws.com/thisismess-assets/mess/live/static/img/favicons/apple-touch-icon.png",
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
          href: "https://s3.amazonaws.com/thisismess-assets/mess/live/static/img/favicons/apple-touch-icon.png",
        },
        {
          rel: "icon",
          sizes: "32x32",
          href: "https://s3.amazonaws.com/thisismess-assets/mess/live/static/img/favicons/favicon-32x32.png",
        },
        {
          rel: "icon",
          sizes: "16x16",
          href: "https://s3.amazonaws.com/thisismess-assets/mess/live/static/img/favicons/favicon-16x16.png",
        },
        {
          rel: "manifest",
          href: "https://s3.amazonaws.com/thisismess-assets/mess/live/static/img/favicons/site.webmanifest",
        },
        {
          rel: "mask-icon",
          color: "#37dbff",
          href: "https://s3.amazonaws.com/thisismess-assets/mess/live/static/img/favicons/safari-pinned-tab.svg",
        },
        {
          rel: "shortcut icon",
          href: "https://s3.amazonaws.com/thisismess-assets/mess/live/static/img/favicons/favicon.ico",
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
  modules: ["../src/module"],
  devtools: { enabled: true },
});
