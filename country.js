/* ============================================================
   WalkWorld — countries.js
   Complete list of UN-recognised sovereign states + a few
   widely-visited territories, grouped by region to match the
   region keys used in app.js (asia | europe | americas |
   middleeast | africa | oceania).
   ============================================================ */

const ALL_COUNTRIES = [

  /* ── AFRICA ─────────────────────────────────────────────── */
  { name: "Algeria",                  region: "africa"     },
  { name: "Angola",                   region: "africa"     },
  { name: "Benin",                    region: "africa"     },
  { name: "Botswana",                 region: "africa"     },
  { name: "Burkina Faso",             region: "africa"     },
  { name: "Burundi",                  region: "africa"     },
  { name: "Cabo Verde",               region: "africa"     },
  { name: "Cameroon",                 region: "africa"     },
  { name: "Central African Republic", region: "africa"     },
  { name: "Chad",                     region: "africa"     },
  { name: "Comoros",                  region: "africa"     },
  { name: "Congo",                    region: "africa"     },
  { name: "DR Congo",                 region: "africa"     },
  { name: "Djibouti",                 region: "africa"     },
  { name: "Egypt",                    region: "africa"     },
  { name: "Equatorial Guinea",        region: "africa"     },
  { name: "Eritrea",                  region: "africa"     },
  { name: "Eswatini",                 region: "africa"     },
  { name: "Ethiopia",                 region: "africa"     },
  { name: "Gabon",                    region: "africa"     },
  { name: "Gambia",                   region: "africa"     },
  { name: "Ghana",                    region: "africa"     },
  { name: "Guinea",                   region: "africa"     },
  { name: "Guinea-Bissau",            region: "africa"     },
  { name: "Ivory Coast",              region: "africa"     },
  { name: "Kenya",                    region: "africa"     },
  { name: "Lesotho",                  region: "africa"     },
  { name: "Liberia",                  region: "africa"     },
  { name: "Libya",                    region: "africa"     },
  { name: "Madagascar",               region: "africa"     },
  { name: "Malawi",                   region: "africa"     },
  { name: "Mali",                     region: "africa"     },
  { name: "Mauritania",               region: "africa"     },
  { name: "Mauritius",                region: "africa"     },
  { name: "Morocco",                  region: "africa"     },
  { name: "Mozambique",               region: "africa"     },
  { name: "Namibia",                  region: "africa"     },
  { name: "Niger",                    region: "africa"     },
  { name: "Nigeria",                  region: "africa"     },
  { name: "Rwanda",                   region: "africa"     },
  { name: "São Tomé and Príncipe",    region: "africa"     },
  { name: "Senegal",                  region: "africa"     },
  { name: "Seychelles",               region: "africa"     },
  { name: "Sierra Leone",             region: "africa"     },
  { name: "Somalia",                  region: "africa"     },
  { name: "South Africa",             region: "africa"     },
  { name: "South Sudan",              region: "africa"     },
  { name: "Sudan",                    region: "africa"     },
  { name: "Tanzania",                 region: "africa"     },
  { name: "Togo",                     region: "africa"     },
  { name: "Tunisia",                  region: "africa"     },
  { name: "Uganda",                   region: "africa"     },
  { name: "Zambia",                   region: "africa"     },
  { name: "Zimbabwe",                 region: "africa"     },

  /* ── AMERICAS ───────────────────────────────────────────── */
  { name: "Antigua and Barbuda",      region: "americas"   },
  { name: "Argentina",                region: "americas"   },
  { name: "Bahamas",                  region: "americas"   },
  { name: "Barbados",                 region: "americas"   },
  { name: "Belize",                   region: "americas"   },
  { name: "Bolivia",                  region: "americas"   },
  { name: "Brazil",                   region: "americas"   },
  { name: "Canada",                   region: "americas"   },
  { name: "Chile",                    region: "americas"   },
  { name: "Colombia",                 region: "americas"   },
  { name: "Costa Rica",               region: "americas"   },
  { name: "Cuba",                     region: "americas"   },
  { name: "Dominica",                 region: "americas"   },
  { name: "Dominican Republic",       region: "americas"   },
  { name: "Ecuador",                  region: "americas"   },
  { name: "El Salvador",              region: "americas"   },
  { name: "Grenada",                  region: "americas"   },
  { name: "Guatemala",                region: "americas"   },
  { name: "Guyana",                   region: "americas"   },
  { name: "Haiti",                    region: "americas"   },
  { name: "Honduras",                 region: "americas"   },
  { name: "Jamaica",                  region: "americas"   },
  { name: "Mexico",                   region: "americas"   },
  { name: "Nicaragua",                region: "americas"   },
  { name: "Panama",                   region: "americas"   },
  { name: "Paraguay",                 region: "americas"   },
  { name: "Peru",                     region: "americas"   },
  { name: "Saint Kitts and Nevis",    region: "americas"   },
  { name: "Saint Lucia",              region: "americas"   },
  { name: "Saint Vincent and the Grenadines", region: "americas" },
  { name: "Suriname",                 region: "americas"   },
  { name: "Trinidad and Tobago",      region: "americas"   },
  { name: "USA",                      region: "americas"   },
  { name: "Uruguay",                  region: "americas"   },
  { name: "Venezuela",                region: "americas"   },

  /* ── ASIA ───────────────────────────────────────────────── */
  { name: "Afghanistan",              region: "asia"       },
  { name: "Armenia",                  region: "asia"       },
  { name: "Azerbaijan",               region: "asia"       },
  { name: "Bangladesh",               region: "asia"       },
  { name: "Bhutan",                   region: "asia"       },
  { name: "Brunei",                   region: "asia"       },
  { name: "Cambodia",                 region: "asia"       },
  { name: "China",                    region: "asia"       },
  { name: "East Timor",               region: "asia"       },
  { name: "Georgia",                  region: "asia"       },
  { name: "Hong Kong",                region: "asia"       },
  { name: "India",                    region: "asia"       },
  { name: "Indonesia",                region: "asia"       },
  { name: "Japan",                    region: "asia"       },
  { name: "Kazakhstan",               region: "asia"       },
  { name: "Kyrgyzstan",               region: "asia"       },
  { name: "Laos",                     region: "asia"       },
  { name: "Malaysia",                 region: "asia"       },
  { name: "Maldives",                 region: "asia"       },
  { name: "Mongolia",                 region: "asia"       },
  { name: "Myanmar",                  region: "asia"       },
  { name: "Nepal",                    region: "asia"       },
  { name: "North Korea",              region: "asia"       },
  { name: "Pakistan",                 region: "asia"       },
  { name: "Philippines",              region: "asia"       },
  { name: "Singapore",                region: "asia"       },
  { name: "South Korea",              region: "asia"       },
  { name: "Sri Lanka",                region: "asia"       },
  { name: "Taiwan",                   region: "asia"       },
  { name: "Tajikistan",               region: "asia"       },
  { name: "Thailand",                 region: "asia"       },
  { name: "Turkmenistan",             region: "asia"       },
  { name: "Uzbekistan",               region: "asia"       },
  { name: "Vietnam",                  region: "asia"       },

  /* ── EUROPE ─────────────────────────────────────────────── */
  { name: "Albania",                  region: "europe"     },
  { name: "Andorra",                  region: "europe"     },
  { name: "Austria",                  region: "europe"     },
  { name: "Belarus",                  region: "europe"     },
  { name: "Belgium",                  region: "europe"     },
  { name: "Bosnia and Herzegovina",   region: "europe"     },
  { name: "Bulgaria",                 region: "europe"     },
  { name: "Croatia",                  region: "europe"     },
  { name: "Cyprus",                   region: "europe"     },
  { name: "Czechia",                  region: "europe"     },
  { name: "Denmark",                  region: "europe"     },
  { name: "Estonia",                  region: "europe"     },
  { name: "Finland",                  region: "europe"     },
  { name: "France",                   region: "europe"     },
  { name: "Germany",                  region: "europe"     },
  { name: "Greece",                   region: "europe"     },
  { name: "Hungary",                  region: "europe"     },
  { name: "Iceland",                  region: "europe"     },
  { name: "Ireland",                  region: "europe"     },
  { name: "Italy",                    region: "europe"     },
  { name: "Kosovo",                   region: "europe"     },
  { name: "Latvia",                   region: "europe"     },
  { name: "Liechtenstein",            region: "europe"     },
  { name: "Lithuania",                region: "europe"     },
  { name: "Luxembourg",               region: "europe"     },
  { name: "Malta",                    region: "europe"     },
  { name: "Moldova",                  region: "europe"     },
  { name: "Monaco",                   region: "europe"     },
  { name: "Montenegro",               region: "europe"     },
  { name: "Netherlands",              region: "europe"     },
  { name: "North Macedonia",          region: "europe"     },
  { name: "Norway",                   region: "europe"     },
  { name: "Poland",                   region: "europe"     },
  { name: "Portugal",                 region: "europe"     },
  { name: "Romania",                  region: "europe"     },
  { name: "Russia",                   region: "europe"     },
  { name: "San Marino",               region: "europe"     },
  { name: "Serbia",                   region: "europe"     },
  { name: "Slovakia",                 region: "europe"     },
  { name: "Slovenia",                 region: "europe"     },
  { name: "Spain",                    region: "europe"     },
  { name: "Sweden",                   region: "europe"     },
  { name: "Switzerland",              region: "europe"     },
  { name: "UK",                       region: "europe"     },
  { name: "Ukraine",                  region: "europe"     },
  { name: "Vatican City",             region: "europe"     },

  /* ── MIDDLE EAST ────────────────────────────────────────── */
  { name: "Bahrain",                  region: "middleeast" },
  { name: "Iran",                     region: "middleeast" },
  { name: "Iraq",                     region: "middleeast" },
  { name: "Israel",                   region: "middleeast" },
  { name: "Jordan",                   region: "middleeast" },
  { name: "Kuwait",                   region: "middleeast" },
  { name: "Lebanon",                  region: "middleeast" },
  { name: "Oman",                     region: "middleeast" },
  { name: "Qatar",                    region: "middleeast" },
  { name: "Saudi Arabia",             region: "middleeast" },
  { name: "Syria",                    region: "middleeast" },
  { name: "Türkiye",                  region: "middleeast" },
  { name: "UAE",                      region: "middleeast" },
  { name: "Yemen",                    region: "middleeast" },

  /* ── OCEANIA ────────────────────────────────────────────── */
  { name: "Australia",                region: "oceania"    },
  { name: "Fiji",                     region: "oceania"    },
  { name: "Kiribati",                 region: "oceania"    },
  { name: "Marshall Islands",         region: "oceania"    },
  { name: "Micronesia",               region: "oceania"    },
  { name: "Nauru",                    region: "oceania"    },
  { name: "New Zealand",              region: "oceania"    },
  { name: "Palau",                    region: "oceania"    },
  { name: "Papua New Guinea",         region: "oceania"    },
  { name: "Samoa",                    region: "oceania"    },
  { name: "Solomon Islands",          region: "oceania"    },
  { name: "Tonga",                    region: "oceania"    },
  { name: "Tuvalu",                   region: "oceania"    },
  { name: "Vanuatu",                  region: "oceania"    },
];


const countryListEl = document.getElementById("countryList");

// Example: your tours data (adjust to match your real structure)
const tours = window.tours || [];

// Get all countries that have tours
const coveredCountries = new Set(
  tours.map(t => t.country)
);

// Render countries
countries.forEach(country => {
  const hasTour = coveredCountries.has(country.name);

  const div = document.createElement("div");
  div.className = "country-item";

  div.innerHTML = `
    <span class="country-name">${country.name}</span>
    <span class="country-status ${hasTour ? "covered" : ""}">
      ${hasTour ? "✓" : ""}
    </span>
  `;

  countryListEl.appendChild(div);
});


countries.sort((a, b) => {
  const aCovered = coveredCountries.has(a.name);
  const bCovered = coveredCountries.has(b.name);
  return bCovered - aCovered;
});