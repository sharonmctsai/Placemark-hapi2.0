export const seedData = {
  users: {
    _model: "User",
    homer: {
      firstName: "Homer",
      lastName: "Simpson",
      email: "homer@simpson.com",
      password: "secret"
    },
    marge: {
      firstName: "Marge",
      lastName: "Simpson",
      email: "marge@simpson.com",
      password: "secret"
    },
    bart: {
      firstName: "Bart",
      lastName: "Simpson",
      email: "bart@simpson.com",
      password: "secret"
    }
  },
  
  placemarks: {
    _model: "Placemark",
    spire: {
      "title": "The Spire",
      "description": "Shining niddle in the city.",
      "location": "Dublin, Ireland",
      "latitude": "53.3498",
      "longitude": "-6.2603",
      "category": "Landmark",
      "userId": "->users.homer",
      "img": "/images/spire.jpg"
    },
    eiffeltower: {
      "title" : "Eiffel Tower",
      "description" : "Wrought-iron lattice tower.",
      "location" : "Paris, France",
      "latitude" : "48.8584",
      "longitude" : "2.2945",
      "category" : "Landmark",
      "userId": "->users.homer",
      "img" : "/images/eiffeltower.jpg"
    },
    crosshavenbeach: {
      "title" : "Crosshaven Beach",
      "description" : "A major sailing and angling centre",
      "location" : "Cork,Ireland",
      "latitude" : " 51.4807",
      "longitude" : "-0.8174",
      "category" : "Beach",
      "userId": "->users.homer",
      "img" : "/images/crosshavenbeach.jpg"
    },
    riverNile:{
      "title" : "River Nile",
      "description" : " North-flowing river in northeastern Africa",
      "location" : "Sudan,Egypt",
      "latitude" : "29.533438",
      "longitude" : "31.270695",
      "category" : "River",
      "userId" : "->users.homer",
      "img" : "/images/nileriver.jpg"
    },
    
    lakeLouise: {
      "title" : "Lake Louise",
      "description" : " is a hamlet in Banff National Park in the Canadian Rockies, known for its turquoise.",
      "location" : "Alberta, Canada",
      "latitude" : "51.4254",
      "longitude" : "-116.1773",
      "category" : "Lake",
      "userId" : "->users.bart",
      "img" : "/images/LakeLouise.jpg"
    }

  }
}



