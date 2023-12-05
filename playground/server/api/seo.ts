export default defineEventHandler((event) => {
  const { url } = event.node.req;
  const searchParams = new URLSearchParams(url?.split("?")?.[1]);
  const path = searchParams.get("path");

  if (!path) {
    return {
      error: "No path provided",
    };
  }

  const dataByRoute = {
    "/": {
      title: "Home",
      description: "The home page",
      webpage: {
        image: "https://jonknoll.dev/wp-content/uploads/2021/03/use-2.jpg",
        datePublished: "2022-01-01",
        dateModified: "2022-01-02",
      },
    },
    "/about": {
      title: "About Us Page",
      description: "The about page",
      schemas: [
        {
          hid: "justinBieber",
          schema: {
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Name",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vestibulum nulla ut nibh vulputate egestas.",
            image: "https://jonknoll.dev/wp-content/uploads/2021/03/use-2.jpg",
            startDate: "2023-12-08T08:00",
            endDate: "2023-12-08T12:00",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: "Mess",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1824 W Grand Ave #200",
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
              url: "https://thisismess.com/",
              availability: "https://schema.org/InStock",
            },
          },
        },
      ],
    },
    "/about/our-history": {
      title: "Our Great History",
      description: "The contact page",
      webpage: {
        datePublished: "2022-03-01",
        dateModified: "2022-03-02",
      },
    },
  };

  return dataByRoute[path];
});
