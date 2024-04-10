// controller for the about page, renders the about-view
export const aboutController = {
  index: {
    handler: function (request, h) {
      const viewData = {
        title: "About Placemark",
      };
      console.log(" about view...");
      return h.view("about-view", viewData);
    },
  },
};
