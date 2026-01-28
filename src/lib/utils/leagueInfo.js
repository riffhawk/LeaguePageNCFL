/*   STEP 1   */
export const leagueID = "1201635512016699392"; // your league ID
export const leagueName = "National Chivos Fantasy Football League"; // your league name
export const dues = 100; // (optional) used in template constitution page
export const dynasty = true; // true for dynasty leagues, false for redraft and keeper
export const enableBlog = false; // requires VITE_CONTENTFUL_ACCESS_TOKEN and VITE_CONTENTFUL_SPACE environment variables

/*   STEP 2   */
export const homepageText = `
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

`;

/*   STEP 3   */
/*
3 managers as an example. Uncomment (remove the //) before each line to make it live code
If you're having trouble, reference the Training Wheels' Manager Section
https://github.com/nmelhado/league-page/blob/master/TRAINING_WHEELS.md#ii-adding-managers-and-changing-the-homepage-text
*/

// To omit an optional field, set it's value to null

export const managers = [
  // Riff 0
  {
    managerID: "825182685528989696", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Riff",
    location: "Brooklyn", // (optional)
    bio: "Lorem ipsum...",
    photo:
      "https://sleepercdn.com/uploads/c1884db783594353d451213f9d4b1b8c.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2023, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "cin", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Dynasty", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Fardin", // Can be anything (usually your rival's name)
      link: 1, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/uploads/7e672a816e7c215f9addf63f21b41225.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 6770, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "QB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Commish",
    tradingScale: 10, // 1 - 10
    preferredContact: "Sleeper", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Fardin 1
  {
    managerID: "865755203985641472", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Fardin",
    location: "Queens", // (optional)
    bio: "Lorem ipsum...",
    photo:
      "https://sleepercdn.com/uploads/7e672a816e7c215f9addf63f21b41225.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2023, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "ne", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Riff", // Can be anything (usually your rival's name)
      link: 0, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/uploads/c1884db783594353d451213f9d4b1b8c.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 11564, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "QB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Troll",
    tradingScale: 10, // 1 - 10
    preferredContact: "Carrier Pigeon", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Mike 2
  {
    managerID: "999577074555883520", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Mike",
    location: "Florida", // (optional)
    bio: "Lorem ipsum...",
    photo:
      "https://sleepercdn.com/uploads/c13b23131a8e47d65982499376f6c620.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2024, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyg", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Waldys", // Can be anything (usually your rival's name)
      link: 10, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/uploads/0e9783f2443b591fe7b10f2ee9e47aa9.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 188, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "RB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Co Champ",
    tradingScale: 4, // 1 - 10
    preferredContact: "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Edber 3
  {
    managerID: "1010266541588701184", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Edber",
    location: "NJ", // (optional)
    bio: "Ju Hearddd",
    photo:
      "https://sleepercdn.com/uploads/687e1f385c2cc06a621b8c35b9134071.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2023, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Mike", // Can be anything (usually your rival's name)
      link: 2, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/uploads/c13b23131a8e47d65982499376f6c620.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 254, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "CB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Fuck FardiN!",
    tradingScale: 6, // 1 - 10
    preferredContact: "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Migz 4
  {
    managerID: "1079092439694151680", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Migz",
    location: "Washington Heights, NY", // (optional)
    bio: "Long Live the King 🍻",
    photo:
      "https://sleepercdn.com/uploads/0d7b9fdc5cb9ccd068317b068cef9edf.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2023, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Joel", // Can be anything (usually your rival's name)
      link: 6, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/uploads/2e7f8ae2d5e629a2a7c76922a2fd9e3d.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 73, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "RB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "The Heineking!!",
    tradingScale: 6, // 1 - 10
    preferredContact: "Phone", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Wilson 5
  {
    managerID: "1083189032630296576", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Wilson",
    location: "NJ", // (optional)
    bio: "NYK",
    photo:
      "https://sleepercdn.com/avatars/thumbs/498db24cece1c50961d53d1692cbf934", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2023, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Jon", // Can be anything (usually your rival's name)
      link: 4, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/uploads/624b3646dc54502a931fe53902f11abd.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 8146, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "QB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)git merge
    philosophy: "Fuck FardiN!",
    tradingScale: 9, // 1 - 10
    preferredContact: "WhatsApp", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Joel 6
  {
    managerID: "1083191159280082944", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Joel",
    location: "Dominican Republic 🇩🇴", // (optional)
    bio: "NYK",
    photo:
      "https://sleepercdn.com/uploads/2e7f8ae2d5e629a2a7c76922a2fd9e3d.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2023, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyg", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Migz", // Can be anything (usually your rival's name)
      link: 4, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/uploads/0d7b9fdc5cb9ccd068317b068cef9edf.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 11604, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "TE", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Alofoke!",
    tradingScale: 7, // 1 - 10
    preferredContact: "WhatsApp", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Sajed 7
  {
    managerID: "1126211909117669376", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Sajed",
    location: "BX,NY", // (optional)
    bio: "GG's",
    photo:
      "https://sleepercdn.com/avatars/thumbs/8eb8f8bf999945d523f2c4033f70473e", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2022, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "min", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Riff", // Can be anything (usually your rival's name)
      link: 0, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/uploads/c1884db783594353d451213f9d4b1b8c.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 6794, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "GGs",
    tradingScale: 2, // 1 - 10
    preferredContact: "Email", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Eric 8
  {
    managerID: "1126215688974073856", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Eric",
    location: "P FK'n R", // (optional)
    bio: "puerto rico",
    photo:
      "https://sleepercdn.com/avatars/thumbs/8553f7fb95334a6a2de471358d8b1d16", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2022, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Dynasty", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Brayan", // Can be anything (usually your rival's name)
      link: 9, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/uploads/4e3475c86e279d7843526d92e286129c.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 4046, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "QB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Boricua",
    tradingScale: 7, // 1 - 10
    preferredContact: "Phone", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Brayan 9
  {
    managerID: "1126239942197223424", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Brayan",
    location: "DR", // (optional)
    bio: "puerto rico",
    photo:
      "https://sleepercdn.com/uploads/4e3475c86e279d7843526d92e286129c.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2022, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyg", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Dynasty", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Eric", // Can be anything (usually your rival's name)
      link: 8, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/avatars/thumbs/8553f7fb95334a6a2de471358d8b1d16", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 4866, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "RB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Salt",
    tradingScale: 9, // 1 - 10
    preferredContact: "Phone", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Waldys 10
  {
    managerID: "1133835872325554176", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Waldys",
    location: "NYC", // (optional)
    bio: "Co Champ",
    photo:
      "https://sleepercdn.com/uploads/0e9783f2443b591fe7b10f2ee9e47aa9.jpg ", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2022, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "phi", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Mike", // Can be anything (usually your rival's name)
      link: 2, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/uploads/c13b23131a8e47d65982499376f6c620.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 4046, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Back on my grind",
    tradingScale: 5, // 1 - 10
    preferredContact: "Phone", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Jon 11
  {
    managerID: "1247690754596290560", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Jon",
    location: "NJ", // (optional)
    bio: "puerto rico",
    photo:
      "https://sleepercdn.com/uploads/624b3646dc54502a931fe53902f11abd.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2022, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyg", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Wilson", // Can be anything (usually your rival's name)
      link: 5, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/avatars/thumbs/498db24cece1c50961d53d1692cbf934", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 9221, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "RB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "OH YEA",
    tradingScale: 1, // 1 - 10
    preferredContact: "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Rafa 12
  {
    managerID: "1119400729959108608", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Rafa",
    location: "Montana", // (optional)
    bio: "puerto rico",
    photo:
      "https://sleepercdn.com/avatars/thumbs/b319fdf8b7b5b0359d3c78622ba4d70c", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2023, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "phi", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Eric", // Can be anything (usually your rival's name)
      link: 5, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/avatars/thumbs/8553f7fb95334a6a2de471358d8b1d16", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 6904, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "OH YEA",
    tradingScale: 2, // 1 - 10
    preferredContact: "Carrier Pigeon", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },

  // Aris 13
  {
    managerID: "1126604697621643264", // ID of the roster that the manager manages (look at the order of the power rankings graph)
    name: "Aris",
    location: "Brooklyn", // (optional)
    bio: "Green Bay",
    photo:
      "https://sleepercdn.com/avatars/thumbs/e7af4deab0289b4f5505646424895246", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2023, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "gb", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    mode: "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Wilson", // Can be anything (usually your rival's name)
      link: 5, // manager array number within this array, or null to link back to all managers page
      image:
        "https://sleepercdn.com/avatars/thumbs/498db24cece1c50961d53d1692cbf934", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 96, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "TE", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "OH YEA",
    tradingScale: 1, // 1 - 10
    preferredContact: "WhatsApp", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },
];

/*   !!  !!  IMPORTANT  !!  !! */
/*
  Below is the most up to-date version of a manager. Please leave this commented out
  and don't delete it. This will be updated if any fields are added, removed or changed
  and will allow updates without causing merge conflicts
  */

// {
//   "roster": 3,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
//   "managerID": "12345678",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
//   "name": "Your Name",
//   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
//   "location": "Brooklyn", // (optional)
//   "bio": "Lorem ipsum...",
//   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
//   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
//   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
//   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
//   "rival": {
//     name: "Rival", // Can be anything (usually your rival's name)
//     link: 6, // manager array number within this array, or null to link back to all managers page
//     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
//   },
//   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
//   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
//   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
//   "philosophy": "Your fantasy team's philosophy", // (optional)
//   "tradingScale": 10, // 1 - 10 (optional)
//   "preferredContact": "Text",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
// },
