/* ============================================================
   WalkWorld — app.js
   ============================================================ */

/* ── TOUR DATA ──────────────────────────────────────────────
   Each tour object:
     id        – unique number used to look up the tour for the modal
     title     – display title shown on card and in modal
     city      – city label (shown in uppercase above title)
     region    – one of: asia | europe | americas | middleeast
     views     – formatted view count string e.g. "12.4M"
     duration  – formatted duration string e.g. "45 min"
     trending  – boolean, shows the "Trending" badge and appears in the 🔥 filter
     emoji     – decorative emoji used as the card thumbnail background
     color     – dark background colour for the thumbnail area
     videoId   – YouTube video ID for the embed (null = show placeholder)
     url       – fallback YouTube link (direct watch or search results)
   ──────────────────────────────────────────────────────────── */
const tours = [
  {
    id: 0,
    title: "4K Japan Walking Tour: Tokyo Nippori -",
    city: "Tokyo",
    country: "Japan",
    region: "asia",
    views: "113,077",
    duration: "3 hour and 41 min",
    trending: true,
    emoji: "🗾🌧️",
    color: "#1e2d4a",
    videoId: "1_D1TcASw48",
    url: "https://www.youtube.com/watch?v=1_D1TcASw48",
  },
  {
    id: 1,
    title: "24 January 2026 PARIS 🇫🇷 FRANCE 4K HDR WALK CITY WALK TOUR BEST STREET WALK TOUR FRIDAY WALK TOUR",
    city: "Paris",
    country: "France",
    region: "europe",
    views: "13,293",
    duration: "42 min",
    trending: false,
    emoji: "🗼✨",
    color: "#3d2b1f",
    videoId: "iEM7UMO2yt4",
    url: "https://www.youtube.com/watch?v=iEM7UMO2yt4",
  },
  {
    id: 2,
    title: "Dubai [4K] Amazing Dubai City, Downtown Dubai Walking Tour 🇦🇪",
    city: "Dubai",
    country: "UAE",
    region: "middleeast",
    views: "109,044",
    duration: "34 min",
    trending: true,
    emoji: "🌆🏙️",
    color: "#1f2e1f",
    videoId: "fKzvwvDA6BM",
    url: "https://www.youtube.com/watch?v=fKzvwvDA6BM",
  },
  {
    id: 3,
    title: "Windy But Wonderful “High Line” - New York, USA 4K",
    city: "New York",
    country: "USA",
    region: "americas",
    views: "2,752",
    duration: "30 min",
    trending: false,
    emoji: "🗽🌆",
    color: "#3d2b10",
    videoId: "Rsasw3uey3g",
    url: "https://www.youtube.com/watch?v=Rsasw3uey3g",
  },
  {
    id: 4,
    title: "[4K] Seoul Nightlife Walking Tour - BEST Street Food, Night Markets, and Party Districts.",
    city: "Seoul",
    country: "South Korea",
    region: "asia",
    views: "236,280",
    duration: "2 hours and 31 min",
    trending: true,
    emoji: "🇰🇷🍢",
    color: "#2a1f3d",
    videoId: "ca9uN3QyDmQ",
    url: "https://www.youtube.com/watch?v=ca9uN3QyDmQ",
  },
  {
    id: 5,
    title: "Rome, Italy Walking Tour 4K 60fps",
    city: "Rome",
    country: "Italy",
    region: "europe",
    views: "64,033",
    duration: "1 hour and 20 min",
    trending: false,
    emoji: "🏛️🌿",
    color: "#3d2b1f",
    videoId: "AG9fExxxCPE",
    url: "https://www.youtube.com/watch?v=AG9fExxxCPE",
  },
  {
    id: 6,
    title: "HONG KONG 🇭🇰 The City of Skyscrapers | 4K Walking Tour",
    city: "Hong Kong",
    country: "Hong Kong",
    region: "asia",
    views: "82,212",
    duration: "3 hours and 53 min",
    trending: true,
    emoji: "🌃🏮",
    color: "#1a1f3d",
    videoId: "wpoOHoxJcLU",
    url: "https://www.youtube.com/watch?v=wpoOHoxJcLU",
  },
  {
    id: 7,
    title: "Mexico City 4K Walking Tour - 190 min Tour with Captions & Immersive Sound [4K Ultra HD/60fps]",
    city: "Mexico City",
    country: "Mexico",
    region: "americas",
    views: "2,871,981",
    duration: "3 hours and 10 min",
    trending: true,
    emoji: "🌮🌳",
    color: "#1f3d2b",
    videoId: "fVh9YNTzhak",
    url: "https://www.youtube.com/watch?v=fVh9YNTzhak",
  },
  {
    id: 8,
    title: "🇹🇷 Istanbul, Türkiye - Walking Tour Through World's Most Popular City - 4K60fps",
    city: "Istanbul",
    country: "Türkiye",
    region: "middleeast",
    views: "54,065",
    duration: "6 hours",
    trending: false,
    emoji: "🕌🌊",
    color: "#3d1f1f",
    videoId: "09yi1wNAntw",
    url: "https://www.youtube.com/watch?v=09yi1wNAntw",
  },
  {
    id: 9,
    title: "🇯🇵 OSAKA, JAPAN 4K WALKING TOUR - Dotonbori District Sunset & Night Life City Walk | 4K HDR - 60 fps",
    city: "Osaka",
    country: "Japan",
    region: "asia",
    views: "1,760,801 ",
    duration: "36 min",
    trending: true,
    emoji: "🍜🎡",
    color: "#3d2010",
    videoId: "xP-wJbQcMOc",
    url: "https://www.youtube.com/watch?v=xP-wJbQcMOc",
  },
  {
    id: 10,
    title: "London Good Friday Holiday Walking Tour | Vibrant London's Shopping Districts Walk | True 4K",
    city: "London",
    country: "UK",
    region: "europe",
    views: "2,551",
    duration: "42 min",
    trending: false,
    emoji: "🇬🇧🍺",
    color: "#1f2a3d",
    videoId: "--YbyGthrX4",
    url: "https://www.youtube.com/watch?v=--YbyGthrX4",
  },
  {
    id: 11,
    title: "Walking Havana 2025 | 24-Minute Walking Tour on Paseo del Prado, Cuba (4K City Walk)",
    city: "Havana",
    country: "Cuba",
    region: "americas",
    views: "3,208",
    duration: "24 min",
    trending: false,
    emoji: "🎺🌴",
    color: "#3d2b10",
    videoId: "cLeNswzpcsQ",
    url: "https://www.youtube.com/watch?v=cLeNswzpcsQ",
  },
  {
    id: 12,
    title: "🇯🇵 TOKYO WALKING TOUR - WALK THE STREETS OF JAPAN DAY & NIGHT | 4K HDR - 60fps",
    city: "Tokyo",
    country: "Japan",
    region: "asia",
    views: "4,646,803 ",
    duration: "40 min",
    trending: true,
    emoji: "☂️🌧️",
    color: "#1e2d4a",
    videoId: "28ZjrtD_iL0",
    url: "https://www.youtube.com/watch?v=28ZjrtD_iL0",
  },
  {
    id: 13,
    title: "Marrakech city walking journey (4K UHD) Morocco",
    city: "Marrakech",
    country: "Morocco",
    region: "africa",
    views: "7,780",
    duration: "1 hour and 20 min",
    trending: false,
    emoji: "🕌🟠",
    color: "#3d1a0a",
    videoId: "kWR3cNoiUSY",
    url: "https://www.youtube.com/watch?v=kWR3cNoiUSY",
  },
  {
    id: 14,
    title: "Barcelona, Spain Walking Tour 4K",
    city: "Barcelona",
    country: "Spain",
    region: "europe",
    views: "293,246",
    duration: "40 min",
    trending: true,
    emoji: "🏖️🎨",
    color: "#1f3030",
    videoId: "3ZygN1uKRok",
    url: "https://www.youtube.com/watch?v=3ZygN1uKRok",
  },
  {
    id: 15,
    title: "【4K HDR】Chiang Mai Nimman Walking Tour — First-Person City Walk",
    city: "Chiang Mai",
    country: "Thailand",
    region: "asia",
    views: "476",
    duration: "42 min",
    trending: false,
    emoji: "🏯🌙",
    color: "#2a1f10",
    videoId: "NQmmYMRqU5E",
    url: "https://www.youtube.com/watch?v=NQmmYMRqU5E",
  },
  {
    id: 16,
    title: "Elegant Geneva, Switzerland Walking Tour 4K",
    city: "Geneva",
    country: "Switzerland",
    region: "europe",
    views: "13,437",
    duration: "1 hour",
    trending: false,
    emoji: "🇨🇭🗻",
    color: "#2a1f10",
    videoId: "-75nCcpU5u8",
    url: "https://www.youtube.com/watch?v=-75nCcpU5u8",
  },
   {
    id: 17,
    title: "California Dream: Santa Monica Walking Tour 4K 60fps",
    city: "Santa Monica",
    country: "USA",
    region: "americas",
    views: "2,044",
    duration: "33 min",
    trending: false,
    emoji: "💵💻",
    color: "#2a1f10",
    videoId: "6WsfeLcIcW8",
    url: "https://www.youtube.com/watch?v=6WsfeLcIcW8",
  },
  {
    id: 18,
    title: "Beach Walk in Cape Town, South Africa 4K 60fps",
    city: "Cape Town",
    country: "South Africa",
    region: "africa",
    views: "24,648",
    duration: "33 min",
    trending: false,
    emoji: "🏝️🌈",
    color: "#2a1f10",
    videoId: "dZGz9PFLYQo",
    url: "https://www.youtube.com/watch?v=dZGz9PFLYQo",
  },
  {
    id: 19,
    title: "Lyon, One of the best cities in France 🇫🇷 Walking Tour - 4K HDR",
    city: "Lyon",
    country: "France",
    region: "europe",
    views: "1,627,439",
    duration: "55 min",
    trending: false,
    emoji: "🍷🏰",
    color: "#2a1f10",
    videoId: "QhxzuHBdl38",
    url: "https://www.youtube.com/watch?v=QhxzuHBdl38",
  },
    {
    id: 20,
    title: "Bordeaux, France 🚴‍♂️ Relaxing Bike Tour | 4K HDR City Tour",
    city: "Bordeaux",
    country: "France",
    region: "europe",
    views: "1,029",
    duration: "33 min",
    trending: false,
    emoji: "🍷🚲",
    color: "#2a1f10",
    videoId: "e8O1VaYxRIM",
    url: "https://www.youtube.com/watch?v=e8O1VaYxRIM",
  },
   {
    id: 21,
    title: "Cozy Morning in Amsterdam, Walking Tour -4K 60FPS",
    city: "Amsterdam",
    country: "Netherlands",
    region: "europe",
    views: "101,293",
    duration: "34 min",
    trending: false,
    emoji: "🚲🌷",
    color: "#2a1f10",
    videoId: "b4X3OtQSWGc",
    url: "https://www.youtube.com/watch?v=b4X3OtQSWGc",
  },

  {
    id: 22,
    title: "Athens, Greece 🇬🇷 4K HDR Walking Tour - Septembre 2022",
    city: "Athens",
    country: "Greece",
    region: "europe",
    views: "546",
    duration: "27 min",
    trending: false,
    emoji: "🏛️☀️",
    color: "#2a1f10",
    videoId: "DoB5ro_z7Vk",
    url: "https://www.youtube.com/watch?v=DoB5ro_z7Vk",
  },

  {
    id: 23,
    title: "4k Walking Tour Adelaide City - Must Visit City of Australia",
    city: "Adelaide",
    country: "Australia",
    region: "oceania",
    views: "35,711",
    duration: "29 min",
    trending: false,
    emoji: "⛪️🎉",
    color: "#2a1f10",
    videoId: "cbiI0TpSvVE",
    url: "https://www.youtube.com/watch?v=cbiI0TpSvVE",
  },

  {
    id: 24,
    title: "SYDNEY Walking Tour 2025 with BONDI BEACH Walk and Captions [4K/60fps]",
    city: "SYDNEY",
    country: "Australia",
    region: "oceania",
    views: "123,554",
    duration: "3 hours and 6 min",
    trending: false,
    emoji: "🌊🏖️",
    color: "#2a1f10",
    videoId: "_9g4OLdUkvU",
    url: "https://www.youtube.com/watch?v=_9g4OLdUkvU",
  },

    {
    id: 25,
    title: "Prague, Czech Republic 🇨🇿 Magical Winter Walking Tour • 4K HDR",
    city: "Prague",
    country: "Czechia",
    region: "europe",
    views: "11,242",
    duration: "34 min",
    trending: false,
    emoji: "🌉🇨🇿",
    color: "#2a1f10",
    videoId: "rT1wmdEbhWM",
    url: "https://www.youtube.com/watch?v=rT1wmdEbhWM",
  },

    {
    id: 26,
    title: "Cozy Winter in Tromsø, Norway | Walking Tour 4K 60fps",
    city: "Tromsø",
    country: "Norway",
    region: "europe",
    views: "53,751",
    duration: "54 min",
    trending: false,
    emoji: "🇳🇴❄️",
    color: "#2a1f10",
    videoId: "3T0IIEUfDGA",
    url: "https://www.youtube.com/watch?v=3T0IIEUfDGA",
  },
   {
    id: 27,
    title: "Cozy Winter Walk in Bern, Switzerland 4K",
    city: "Bern",
    country: "Switzerland",
    region: "europe",
    views: "3,107",
    duration: "51 min",
    trending: false,
    emoji: "💰🛟",
    color: "#2a1f10",
    videoId: "gbWQWTwPRW0",
    url: "https://www.youtube.com/watch?v=gbWQWTwPRW0",
  },



   {
    id: 28,
    title: "Portofino, Italy 🇮🇹 | Italian Riviera Walking Tour | 4K 60fps",
    city: "Portofino",
    country: "Italy",
    region: "europe",
    views: "66,230",
    duration: "24 min",
    trending: false,
    emoji: "🇮🇹🌊",
    color: "#2a1f10",
    videoId: "lsKR5KAINmc",
    url: "https://www.youtube.com/watch?v=lsKR5KAINmc",
  },
   {
    id: 29,
    title: "[4K WALK]🇳🇿Newzealand Queenstown city centre walking tour 2024! 4K HDR 60fps",
    city: "Queenstown",
    country: "New Zealand",
    region: "oceania",
    views: "5,884 ",
    duration: "39 min",
    trending: false,
    emoji: "💰🛟",
    color: "#2a1f10",
    videoId: "Ke0cq7Uh_CQ",
    url: "https://www.youtube.com/watch?v=Ke0cq7Uh_CQ",
  },


   {
    id: 30,
    title: "Cape Town Jewel of South Africa Walking Tour - 4K",
    city: "Cape Town",
    country: "South Africa",
    region: "africa",
    views: "552,674 ",
    duration: "43 min",
    trending: false,
    emoji: "🇿🇦💎",
    color: "#2a1f10",
    videoId: "BSxV9nUfDAU",
    url: "https://www.youtube.com/watch?v=BSxV9nUfDAU",
  },
   {
    id: 31,
    title: "Walking in Lagos Nigeria - Africa's Most Populous City - 4K",
    city: "Lagos",
    country: "Nigeria",
    region: "africa",
    views: "74,819",
    duration: "48 min",
    trending: false,
    emoji: "🇳🇬🌆",
    color: "#2a1f10",
    videoId: "LZJ000F-CLc",
    url: "https://www.youtube.com/watch?v=LZJ000F-CLc",
  },

   {
    id: 32,
    title: "Fiji Streets Nadi Town Walking Tour 🇫🇯 2026",
    city: "Nadi",
    country: "Fiji",
    region: "oceania",
    views: "42,419",
    duration: "54 min",
    trending: false,
    emoji: "🇫🇯🌴",
    color: "#2a1f10",
    videoId: "nCW7FvKpXhE",
    url: "https://www.youtube.com/watch?v=nCW7FvKpXhE",
  },
   {
    id: 33,
    title: "Walk with me in Tuvalu - one of the least visited countries in the world",
    city: "Funafuti",
    country: "Tuvalu",
    region: "oceania",
    views: "60,179",
    duration: "19 min",
    trending: false,
    emoji: "🇹🇻🏝️",
    color: "#2a1f10",
    videoId: "B0C6KrumYg8",
    url: "https://www.youtube.com/watch?v=B0C6KrumYg8",
  },


   {
    id: 34,
    title: "[4K] Downtown Buenos Aires Walking Tour | 9 de Julio Avenue – Iconic City Views",
    city: "Buenos Aires",
    country: "Argentina",
    region: "americas",
    views: "14,698",
    duration: "50 min",
    trending: false,
    emoji: "🇦🇷🌆",
    color: "#2a1f10",
    videoId: "PRZxWOmxpmc",
    url: "https://www.youtube.com/watch?v=PRZxWOmxpmc",
  },
   {
    id: 35,
    title: "Walking Tour [4K] in Salvador, Bahia State, Brazil 🇧🇷",
    city: "Salvador",
    country: "Brazil",
    region: "americas",
    views: "640",
    duration: "45 min",
    trending: false,
    emoji: "🇧🇷🌆",
    color: "#2a1f10",
    videoId: "SiuJhtowLw8",
    url: "https://www.youtube.com/watch?v=SiuJhtowLw8",
  },

  {
    id: 37,
    title: "RIO DE JANEIRO Downtown — Walking Tour of The Marvelous City! 【 4 HRS 】 Brazil",
    city: "RIO DE JANEIRO",
    country: "Brazil",
    region: "americas",
    views: "2,664",
    duration: "3 hours and 45 min",
    trending: false,
    emoji: "🇧🇷🌆",
    color: "#2a1f10",
    videoId: "h1DTIkOBx2k",
    url: "https://www.youtube.com/watch?v=h1DTIkOBx2k",
  },

  {
    id: 38,
    title: "🇧🇷 FLORIANÓPOLIS 4K City Center Walk| Explore Downtown Floripa",
    city: "FLORIANÓPOLIS",
    country: "Brazil",
    region: "americas",
    views: "93,546",
    duration: "36 min",
    trending: false,
    emoji: "🇧🇷🌆",
    color: "#2a1f10",
    videoId: "31xWWQrjTGE",
    url: "https://www.youtube.com/watch?v=31xWWQrjTGE",
  },
  {
    id: 39,
    title: "Daily Life in The Slums on Mumbai India 4K Walking TOUR",
    city: "Mumbai",
    country: "India",
    region: "asia",
    views: "497,474",
    duration: "39 min",
    trending: false,
    emoji: "🇮🇳🏙️",
    color: "#2a1f10",
    videoId: "ZY5JdCitzoQ",
    url: "https://www.youtube.com/watch?v=ZY5JdCitzoQ",
  },
  {
    id: 40,
    title: "Casco Viejo Panama City Walking Tour 🇵🇦 2024 4K",
    city: "Panama City",
    country: "Panama",
    region: "americas",
    views: "34,606 ",
    duration: "32 min",
    trending: false,
    emoji: "🇵🇦🌆",
    color: "#2a1f10",
    videoId: "9MRzMN9enI0",
    url: "https://www.youtube.com/watch?v=9MRzMN9enI0",
  },
  {
    id: 41,
    title: "4K HDR】Chengdu, China | Walking Tour of the City Center - The Most Livable City in China!",
    city: "Chengdu",
    country: "China",
    region: "asia",
    views: "34,526",
    duration: "1 hour and 13 min",
    trending: false,
    emoji: "🇨🇳🌆",
    color: "#2a1f10",
    videoId: "UlsCe0sddXs",
    url: "https://www.youtube.com/watch?v=UlsCe0sddXs",
  },

  {
    id: 42,
    title: "Hanoi 4K Walking Tour (Vietnam) - Old Quarter Tour with Train Street and Night Walk | 4K HD/60fps",
    city: "Hanoi",
    country: "Vietnam",
    region: "asia",
    views: "922,793",
    duration: "3 hours and 34 min",
    trending: false,
    emoji: "🇻🇳🌆",
    color: "#2a1f10",
    videoId: "xId3cHWsta4",
    url: "https://www.youtube.com/watch?v=xId3cHWsta4",
  },
  {
    id: 43,
    title: "🇻🇳Ho Chi Minh 4k walk - Vietnam 4K Morning Walking Tour｜May 2025",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    region: "asia",
    views: "922,793",
    duration: "1 hours and 7 min",
    trending: false,
    emoji: "🇻🇳🌆",
    color: "#2a1f10",
    videoId: "_Rc-sSE29Vc",
    url: "https://www.youtube.com/watch?v=_Rc-sSE29Vc",
  },

  {
    id: 44,
    title: " Baghdad, Iraq: What It Looks Like Today | Walking Tour 4K",
    city: "Baghdad",
    country: "Iraq",
    region: "middleeast",
    views: "127,741",
    duration: "1 hours and 9 min",
    trending: false,
    emoji: "☀️🌆",
    color: "#2a1f10",
    videoId: "uWfLoL5AWFc",
    url: "https://www.youtube.com/watch?v=uWfLoL5AWFc",
  },{
    id: 45,
    title: "MELBOURNE Walking Tour | Australia Walk Tour @ 4K/60fps",
    city: "MELBOURNE",
    country: "Australia",
    region: "oceania",
    views: "655,824",
    duration: "3 hours and 24 min",
    trending: false,
    emoji: "🇦🇺🍕",
    color: "#2a1f10",
    videoId: "Prz2VJOdtEE",
    url: "https://www.youtube.com/watch?v=Prz2VJOdtEE",
  },

  {
    id: 46,
    title: "Ulaanbaatar – A Glimpse of Daily Life in the Vibrant Capital | Mongolia 🇲🇳 Aug 2025 [4K HDR]",
    city: "Ulaanbaatar",
    country: "Mongolia",
    region: "asia",
    views: "640",
    duration: "3 hours and 2 min",
    trending: false,
    emoji: "🇲🇳🐎",
    color: "#2a1f10",
    videoId: "bFg67gIWngM",
    url: "https://www.youtube.com/watch?v=bFg67gIWngM",
  },

  {
    id: 47,
    title: "Exploring The Lyon's Beauty | Breathtaking Walking Journey | 4K60 HDR | European Walking Tours",
    city: "Lyon",
    country: "France",
    region: "europe",
    views: "25,464",
    duration: "45 min",
    trending: false,
    emoji: "🇫🇷🥖",
    color: "#2a1f10",
    videoId: "uKQTo9RFUfg",
    url: "https://www.youtube.com/watch?v=uKQTo9RFUfg",
  },

  {
    id: 48,
    title: "Tübingen, Germany 4K Walking Tour | A Magical Old Town Few Tourists Know",
    city: "Tübingen",
    country: "Germany",
    region: "europe",
    views: "11,007",
    duration: "45 min",
    trending: false,
    emoji: "🇩🇪🏰",
    color: "#2a1f10",
    videoId: "U_SL2Q_5abw",
    url: "https://www.youtube.com/watch?v=U_SL2Q_5abw",
  },

  {
    id: 49,
    title: "A Wonderful Day in Sydney, Walking Tour 4K 60fps",
    city: "Sydney",
    country: "Australia",
    region: "oceania",
    views: "9,139",
    duration: "1 hour and 28 min",
    trending: false,
    emoji: "🇦🇺🍕",
    color: "#2a1f10",
    videoId: "g87CX6rro3o",
    url: "https://www.youtube.com/watch?v=g87CX6rro3o",
  },
  {
    id: 50,
    title: "Gardens of Lake Como, Italy / Walking Tour - 4K",
    city: "Lake Como",
    country: "Italy",
    region: "europe",
    views: "832,218",
    duration: "18 min",
    trending: false,
    emoji: "🇮🇹🏞",
    color: "#2a1f10",
    videoId: "GqOJSzIjXTU",
    url: "https://www.youtube.com/watch?v=GqOJSzIjXTU",
  },
  {
    id: 51,
    title: "Beautiful Brooklyn in Fall, New York Walking Tour 4K 60 fps",
    city: "New York",
    country: "USA",
    region: "americas",
    views: "1,820",
    duration: "36 min",
    trending: false,
    emoji: "🇺🇸🍁",
    color: "#2a1f10",
    videoId: "YQeRm6GJpHg",
    url: "https://www.youtube.com/watch?v=YQeRm6GJpHg",
  },
  {
    id: 52,
    title: "Fairytale Town You’ve Never Heard Of: Annecy, France, Walking Tour 4K 60FPS",
    city: "Annecy",
    country: "France",
    region: "europe",
    views: "5,450",
    duration: "54 min",
    trending: false,
    emoji: "🇫🇷🥖",
    color: "#2a1f10",
    videoId: "xO6iX_JyBIA",
    url: "https://www.youtube.com/watch?v=xO6iX_JyBIA",
  },
  {
    id: 53,
    title: "London is Beautiful in Autumn, Walking Tour 4K",
    city: "London",
    country: "UK",
    region: "europe",
    views: "31,132",
    duration: "40 min",
    trending: false,
    emoji: "🇬🇧🌆",
    color: "#2a1f10",
    videoId: "SiuJhtowLw8",
    url: "https://www.youtube.com/watch?v=SiuJhtowLw8",
  },
  
  {
    id: 54,
    title: "Reykjavik is Rarely This Sunny, Iceland Walking Tour 4K",
    city: "Reykjavik",
    country: "Iceland",
    region: "europe",
    views: "257,874 ",
    duration: "55 min",
    trending: false,
    emoji: "🤘🌋",
    color: "#2a1f10",
    videoId: "i3zIUltTNu0",
    url: "https://www.youtube.com/watch?v=i3zIUltTNu0",
  },
  {
    id: 55,
    title: "Bike Tour of Copenhagen, Denmark - 4K",
    city: "Copenhagen",
    country: "Denmark",
    region: "europe",
    views: "16,407",
    duration: "44 min",
    trending: false,
    emoji: "🇩🇰🚲",
    color: "#2a1f10",
    videoId: "h8JhwiXVqhY",
    url: "https://www.youtube.com/watch?v=h8JhwiXVqhY",
  },
  {
    id: 56,
    title: "Hippest Neighbourhood of Oslo, Aker Brygge Walking Tour - 4K",
    city: "Oslo",
    country: "Norway",
    region: "europe",
    views: "2,297",
    duration: "29 min",
    trending: false,
    emoji: "😄🏙",
    color: "#2a1f10",
    videoId: "AXGYanF6q8M",
    url: "https://www.youtube.com/watch?v=AXGYanF6q8M",
  },

  {
    id: 57,
    title: "【4K】Toronto Canada 4k Walking tour, Vibes Near Rogers Centre, CN Tower #toronto #canada #calgary #4k",
    city: "Toronto",
    country: "Canada",
    region: "americas",
    views: "196,859",
    duration: "39 min",
    trending: false,
    emoji: "🇨🇦🌆",
    color: "#2a1f10",
    videoId: "fjzpMP2L4EY",
    url: "https://www.youtube.com/watch?v=fjzpMP2L4EY",
  },


  {
    id: 58,
    title: "Virtual Walking Tour - Georgetown, Guyana",
    city: "Georgetown",
    country: "Guyana",
    region: "americas",
    views: "864",
    duration: "17 min",
    trending: false,
    emoji: "🇫🇷⬇️",
    color: "#2a1f10",
    videoId: "zHOT6a19bpE",
    url: "https://www.youtube.com/watch?v=zHOT6a19bpE",
  },

  {
    id: 59,
    title: "Port of Spain, Trinidad and Tobago walking tour (Downtown - Frederick Street to Uptown - NAPA)",
    city: "Port of Spain",
    country: "Trinidad and Tobago",
    region: "americas",
    views: "23,602",
    duration: "43 min",
    trending: false,
    emoji: "🇹🇹🌆",
    color: "#2a1f10",
    videoId: "mVeuedbET6I",
    url: "https://www.youtube.com/watch?v=mVeuedbET6I",
  },


   {
    id: 60,
    title: "Riga. Old Town Walking Tour. Rain. 4K. ASMR.",
    city: "Riga",
    country: "Latvia",
    region: "europe",
    views: "1,001 ",
    duration: "1 hour and 2 min",
    trending: false,
    emoji: "🍫🖌️",
    color: "#2a1f10",
    videoId: "BHUrSyXWnFw",
    url: "https://www.youtube.com/watch?v=BHUrSyXWnFw",
  },

   {
    id: 61,
    title: "SANTORINI Walking Tour 🇬🇷☀️ | Fira, Greece Immersive Video with Captions [4K/60fps]",
    city: "SANTORINI",
    country: "Greece",
    region: "europe",
    views: "133,169",
    duration: "1 hour and 4 min",
    trending: false,
    emoji: "🇬🇷☀️",
    color: "#2a1f10",
    videoId: "TKNK0c1zfVo",
    url: "https://www.youtube.com/watch?v=TKNK0c1zfVo",
  },
  {
    id: 62,
    title: "Gold Coast, AUSTRALIA - Surfers Paradise Bustling Beachside Suburb 4K Walking Tour",
    city: "Gold Coast",
    country: "Australia",
    region: "oceania",
    views: "119,234",
    duration: "1 hour and 16 min",
    trending: false,
    emoji: "🏖️🌆",
    color: "#2a1f10",
    videoId: "EVaxBZh99dc",
    url: "https://www.youtube.com/watch?v=EVaxBZh99dc",
  },

  {
    id: 63,
    title: "Brisbane City, Queen Street Mall Raining day walk 4k",
    city: "Brisbane",
    country: "Australia",
    region: "oceania",
    views: "461",
    duration: " 31 min",
    trending: false,
    emoji: "🌧️🏙️",
    color: "#2a1f10",
    videoId: "S2W4AP8TT48",
    url: "https://www.youtube.com/watch?v=S2W4AP8TT48",
  },

  {
    id: 64,
    title: "🇨🇴 (4K) BOTERO PLAZA AND EL CENTRO MEDELLIN DOWNTOWN COLOMBIA Best of 2022",
    city: "Medellin",
    country: "Colombia",
    region: "americas",
    views: "577,341",
    duration: " 26 min",
    trending: false,
    emoji: "🇨🇴🌆",
    color: "#2a1f10",
    videoId: "bFfhGBwPApc",
    url: "https://www.youtube.com/watch?v=bFfhGBwPApc",
  },

  {
    id: 65,
    title: "Stop! No Go Zone - El Centro , Medellin",
    city: "Medellin",
    country: "Colombia",
    region: "americas",
    views: "1,144,586",
    duration: " 11 min",
    trending: false,
    emoji: "🇨🇴🌆",
    color: "#2a1f10",
    videoId: "Fy_DuchIxVo",
    url: "https://www.youtube.com/watch?v=Fy_DuchIxVo",
  },
  {
    id: 66,
    title: "Maldives relaxing tour at Waldorf Astoria with soothing Jazz Music in 4K",
    city: "Waldorf Astoria Maldives Ithaafushi",
    country: "maldives",
    region: "asia",
    views: "154,719",
    duration: " 44 min",
    trending: false,
    emoji: "🇲🇻🌴",
    color: "#2a1f10",
    videoId: "fgPZ9GpRctU",
    url: "https://www.youtube.com/watch?v=fgPZ9GpRctU",
  },
  {
    id: 67,
    title: "Popular Maldives Local Island | Maafushi Walking Tour",
    city: "Waldorf Astoria Maldives Ithaafushi",
    country: "maldives",
    region: "asia",
    views: "6,455",
    duration: " 56 min",
    trending: false,
    emoji: "🇲🇻🌴",
    color: "#2a1f10",
    videoId: "5KJ3ITO-GT8",
    url: "https://www.youtube.com/watch?v=5KJ3ITO-GT8",
  },
  {
    id: 68,
    title: "Chicago Spring Walk 🌷 Beautiful Easter Weekend Vibes On Saturday | April 4, 2026 | 4K City Sounds",
    city: "Chicago",
    country: "United States",
    region: "americas",
    views: "1,448 ",
    duration: " 1 hour and 5 min",
    trending: false,
    emoji: "🇺🇸🏙️",
    color: "#2a1f10",
    videoId: "FyqoVVFpOJs",
    url: "https://www.youtube.com/watch?v=FyqoVVFpOJs",
  },
  {
    id: 69,
    title: "MALTA WALKING TOUR — Valletta Tour with Captions [4K/60fps]",
    city: "Valletta",
    country: "Malta",
    region: "europe",
    views: "456,009",
    duration: "2 hours and 13 min",
    trending: false,
    emoji: "🇲🇹🏛️",
    color: "#2a1f10",
    videoId: "MTkX0_htW-I",
    url: "https://www.youtube.com/watch?v=MTkX0_htW-I",
  },
  {
    id: 70,
    title: "Stockholm Today 🇸🇪 April 2 | City Life | 4K Walking Tour",
    city: "Stockholm",
    country: "Sweden",
    region: "europe",
    views: "4,579",
    duration: " 25 min",
    trending: false,
    emoji: "🇸🇪🏙️",
    color: "#2a1f10",
    videoId: "Q1kmi5wCC34",
    url: "https://www.youtube.com/watch?v=Q1kmi5wCC34",
  },
  {
    id: 71,
    title: "Milan 2026, Walking Tour 4K 60fps",
    city: "Milan",
    country: "Italy",
    region: "europe",
    views: "2,326",
    duration: "45 min",
    trending: false,
    emoji: "🇮🇹🏙️",
    color: "#2a1f10",
    videoId: "o2P53vr-Cps",
    url: "https://www.youtube.com/watch?v=o2P53vr-Cps",
  },
  {
    id: 72,
    title: "Riga, Latvia – Sunny Day Walking Tour 4K 60FPS",
    city: "Riga",
    country: "Latvia",
    region: "europe",
    views: "4,325",
    duration: " 40 min",
    trending: false,
    emoji: "🇱🇻🏙️",
    color: "#2a1f10",
    videoId: "P0xu40vffks",
    url: "https://www.youtube.com/watch?v=P0xu40vffks",
  },
  {
    id: 73,
    title: "Heart of Bali - Ubud, Indonesia, Walking Tour 4K 60FPS",
    city: "Ubud",
    country: "Indonesia",
    region: "asia",
    views: "24,461",
    duration: " 1 hour and 25 min",
    trending: false,
    emoji: "🇮🇩🌴",
    color: "#2a1f10",
    videoId: "rkw_JffDflg",
    url: "https://www.youtube.com/watch?v=rkw_JffDflg",
  },
  {
    id: 74,
    title: "Nordic Summer in Helsinki, Finland Walking Tour 4K 60fps",
    city: "Helsinki",
    country: "Finland",
    region: "europe",
    views: "42,833",
    duration: " 59 min",
    trending: false,
    emoji: "🇫🇮🏙️",
    color: "#2a1f10",
    videoId: "J8W_LB6YqcI",
    url: "https://www.youtube.com/watch?v=bFfhGBwPApc",
  },
  {
    id: 75,
    title: "A Day in Doha, Qatar Walking Tour 4K 60fps",
    city: "Doha",
    country: "Qatar",
    region: "asia",
    views: "262,555",
    duration: " 1 hour and 11 min",
    trending: false,
    emoji: "🇶🇦🌆",
    color: "#2a1f10",
    videoId: "MWvrDzIzfhQ",
    url: "https://www.youtube.com/watch?v=MWvrDzIzfhQ",
  },
  {
    id: 76,
    title: "Cortina d’Ampezzo Summer Before 2026 Winter Olympics, Walking Tour 4K 60FPS",
    city: "Cortina d’Ampezzo",
    country: "Italy",
    region: "europe",
    views: "5,789",
    duration: " 26 min",
    trending: false,
    emoji: "🇮🇹🌆",
    color: "#2a1f10",
    videoId: "w1EBDFltfTw",
    url: "https://www.youtube.com/watch?v=w1EBDFltfTw",
  },
  {
    id: 77,
    title: "Summer in Croatia, Split Walking Tour 4K",
    city: "Split",
    country: "Croatia",
    region: "europe",
    views: "6,563",
    duration: " 28 min",
    trending: false,
    emoji: "🇭🇷🌆",
    color: "#2a1f10",
    videoId: "yuGlwzC3Dms",
    url: "https://www.youtube.com/watch?v=yuGlwzC3Dms",
  },
  {
    id: 78,
    title: "Perfect Summer Day in Dubrovnik, Croatia, Walking Tour 4K 60FPS",
    city: "Dubrovnik",
    country: "Croatia",
    region: "europe",
    views: "21,602",
    duration: " 28 min",
    trending: false,
    emoji: "🇭🇷🌆",
    color: "#2a1f10",
    videoId: "kCmNLkDmODA",
    url: "https://www.youtube.com/watch?v=kCmNLkDmODA",
  },
  {
    id: 79,
    title: "Vibrant Streets of Warsaw, Poland / 4K Walking Tour",
    city: "Warsaw",
    country: "Poland",
    region: "europe",
    views: "2,636 ",
    duration: " 26 min",
    trending: false,
    emoji: "🇵🇱🌆",
    color: "#2a1f10",
    videoId: "RInBAatA11Q",
    url: "https://www.youtube.com/watch?v=RInBAatA11Q",
  },
  {
    id: 80,
    title: "Rainy Day in Copenhagen, Denmark Walking Tour - 4K",
    city: "Copenhagen",
    country: "Denmark",
    region: "europe",
    views: "11,288",
    duration: " 40 min",
    trending: false,
    emoji: "🇩🇰🌆",
    color: "#2a1f10",
    videoId: "n5L1N4Dvx2o",
    url: "https://www.youtube.com/watch?v=n5L1N4Dvx2o",
  },
  {
    id: 81,
    title: "Galata Bridge in Istanbul Walking Tour - 4K",
    city: "Istanbul",
    country: "Turkey",
    region: "europe",
    views: "1,111 ",
    duration: " 9 min",
    trending: false,
    emoji: "🇹🇷🌆",
    color: "#634646",
    videoId: "oUQsUMYWvhU",
    url: "https://www.youtube.com/watch?v=oUQsUMYWvhU",
  },
  {
    id: 82,
    title: "Sunshine in Budapest, Hungary Walking Tour - 4K",
    city: "Budapest",
    country: "Hungary",
    region: "europe",
    views: "1,926",
    duration: " 20 min",
    trending: false,
    emoji: "🇭🇺🌆",
    color: "#2a1f10",
    videoId: "DV7E0hk_W3o",
    url: "https://www.youtube.com/watch?v=DV7E0hk_W3o",
  },
  {
    id: 83,
    title: "Unmissable Streets of Brussels, Belgium Walking Tour - 4K 60fps",
    city: "Brussels",
    country: "Belgium",
    region: "europe",
    views: "110,631",
    duration: " 27 min",
    trending: false,
    emoji: "🇪🇺🇺🇳",
    color: "#2a1f10",
    videoId: "41Swm3AtU48",
    url: "https://www.youtube.com/watch?v=bFfhGBwPApc",
  },
  {
    id: 84,
    title: "🇪🇸[4K] LAS PALMAS DE GRAN CANARIA Walking Tour | Canary Islands #spain #españa #4kvideo #virtualtour",
    city: "Las Palmas de Gran Canaria",
    country: "Spain",
    region: "europe",
    views: "6,446",
    duration: " 37 min",
    trending: false,
    emoji: "🏝️🌋",
    color: "#2a1f10",
    videoId: "TZWwjpNj42k",
    url: "https://www.youtube.com/watch?v=TZWwjpNj42k",
  },
  {
    id: 85,
    title: "Tunis Centre Walking Tour - Tunisia【4K HD - 60fps】🇹🇳",
    city: "Tunis",
    country: "Tunisia",
    region: "africa",
    views: "127,321",
    duration: " 29 min",
    trending: false,
    emoji: "🇹🇳🌆",
    color: "#2a1f10",
    videoId: "OpiRUgXkX_s",
    url: "https://www.youtube.com/watch?v=OpiRUgXkX_s",
  },
  {
    id: 86,
    title: "How live in Russia? Moscow City Walk Tour: New Arbat to Red Square 4K HDR",
    city: "Moscow",
    country: "Russia",
    region: "europe",
    views: "1,078,787",
    duration: " 51 min",
    trending: false,
    emoji: "🇷🇺🪆",
    color: "#2a1f10",
    videoId: "1xr02iennNo",
    url: "https://www.youtube.com/watch?v=1xr02iennNo",
  },
  {
    id: 87,
    title: "Walking in St Petersburg City Center, Russia | 4K City Walk | Russian Walking Tour",
    city: "St Petersburg",
    country: "Russia",
    region: "europe",
    views: "7,397",
    duration: " 52 min",
    trending: false,
    emoji: "🪆🏢",
    color: "#2a1f10",
    videoId: "_NtXiJF4e0I",
    url: "https://www.youtube.com/watch?v=_NtXiJF4e0I",
  },
  {
    id: 88,
    title: "Virtual Tour Of Vladivostok 2021 Part 4",
    city: "Vladivostok",
    country: "Russia",
    region: "asia",
    views: "2,155",
    duration: " 15 min",
    trending: false,
    emoji: "🇷🇺🌆",
    color: "#2a1f10",
    videoId: "vvDQkNzFYCE",
    url: "https://www.youtube.com/watch?v=vvDQkNzFYCE",
  },
  {
    id: 89,
    title: "Morning Walk In The Center Of Vladivostok Part 2",
    city: "Vladivostok",
    country: "Russia",
    region: "asia",
    views: "2,319 ",
    duration: " 16 min",
    trending: false,
    emoji: "🇷🇺🌆",
    color: "#2a1f10",
    videoId: "gG31OwtScPA",
    url: "https://www.youtube.com/watch?v=gG31OwtScPA",
  },
  {
    id: 90,
    title: "Strasbourg — The Most Unique City in France 🇫🇷 Between Two Cultures",
    city: "Strasbourg",
    country: "France",
    region: "europe",
    views: "205",
    duration: " 56 min",
    trending: false,
    emoji: "🇫🇷🌆",
    color: "#2a1f10",
    videoId: "w4yutt1Esis",
    url: "https://www.youtube.com/watch?v=w4yutt1Esis",
  },
  {
    id: 91,
    title: "A Luxurious Coastal Paradise and the Secret Beach Town of France’s Elite • Biarritz, France • 4K HDR",
    city: "Biarritz",
    country: "France",
    region: "europe",
    views: "559",
    duration: " 26 min",
    trending: false,
    emoji: "☀️🌊",
    color: "#2a1f10",
    videoId: "-76PW5TLlWw",
    url: "https://www.youtube.com/watch?v=-76PW5TLlWw",
  },
  {
    id: 92,
    title: "Nairobi City 🇰🇪 – Real Streets of Kenya | 4K Morning Walking Tour",
    city: "Nairobi",
    country: "Kenya",
    region: "africa",
    views: "8,482",
    duration: " 24 min",
    trending: false,
    emoji: "🇰🇪🌆",
    color: "#2a1f10",
    videoId: "q7mlldIOZ68",
    url: "https://www.youtube.com/watch?v=q7mlldIOZ68",
  },
  {
    id: 93,
    title: "Murcia, Spain Walking Tour (4k Ultra HD 60fps) – With Captions",
    city: "Murcia",
    country: "Spain",
    region: "europe",
    views: "19,455 ",
    duration: "1 hour and 12 min",
    trending: false,
    emoji: "🇪🇸🌆",
    color: "#2a1f10",
    videoId: "wikZCLuu_Xw",
    url: "https://www.youtube.com/watch?v=wikZCLuu_Xw",
  },
  {
    id: 94,
    title: "Exploring Downtown San Jose California USA Walking Tour #sanjose #downtownsanjose #sanjosecalifornia",
    city: "San Jose",
    country: "USA",
    region: "americas",
    views: "8,428",
    duration: " 24 min",
    trending: false,
    emoji: "🇺🇸🌆",
    color: "#2a1f10",
    videoId: "2u0xdNszYFU",
    url: "https://www.youtube.com/watch?v=2u0xdNszYFU",
  },
  {
    id: 95,
    title: "Slovakia 4K Walking Tour | Bratislava Old Town, Castle & Beautiful Streets",
    city: "Bratislava",
    country: "Slovakia",
    region: "europe",
    views: "4,545 ",
    duration: " 54 min",
    trending: false,
    emoji: "🇸🇰🌆",
    color: "#2a1f10",
    videoId: "FJCJUR0FCWs",
    url: "https://www.youtube.com/watch?v=FJCJUR0FCWs",
  },
  {
    id: 96,
    title: "Oxford England Walking Tour 4K - Radcliffe Camera, Bodleian Library & More",
    city: "Oxford",
    country: "England",
    region: "europe",
    views: "45,621 ",
    duration: " 24 min",
    trending: false,
    emoji: "🎓⛪️",
    color: "#2a1f10",
    videoId: "uZEnkpFXd9I",
    url: "https://www.youtube.com/watch?v=uZEnkpFXd9I",
  },
  {
    id: 97,
    title: "Blyth, Northumberland【4K】| Town Centre Walk 2021",
    city: "Blyth",
    country: "England",
    region: "europe",
    views: "23,798 ",
    duration: " 21 min",
    trending: false,
    emoji: "🇬🇧🌆",
    color: "#2a1f10",
    videoId: "bvOEmYg9xqo",
    url: "https://www.youtube.com/watch?v=bvOEmYg9xqo",
  },
  {
    id: 98,
    title: "Hangzhou: the Most Graceful and Splendid City in China | 4K HDR Walking Tour",
    city: "Hangzhou",
    country: "China",
    region: "asia",
    views: "528,898",
    duration: " 2 hours and 41 min",
    trending: false,
    emoji: "👥📱",
    color: "#2a1f10",
    videoId: "GjVuQ7pYJ-I",
    url: "https://www.youtube.com/watch?v=GjVuQ7pYJ-I",
  },
{
    id: 99,
    title: "ANTWERP Walking Tour 🇧🇪 | Stroll Old Town, Medieval & Flemish Charm!",
    city: "Antwerp",
    country: "Belgium",
    region: "europe",
    views: "8,482",
    duration: "1 hour and 18 min",
    trending: false,
    emoji: "🇧🇪🌆",
    color: "#2a1f10",
    videoId: "yTqGAey-sp8",
    url: "https://www.youtube.com/watch?v=yTqGAey-sp8",
  },
  {
    id: 100,
    title: "🇧🇴 | Plaza Principal | Walking Tour | Sucre - Bolivia | 4K",
    city: "Sucre",
    country: "Bolivia",
    region: "americas",
    views: "676",
    duration: "11 min",
    trending: false,
    emoji: "🇧🇴🌆",
    color: "#2a1f10",
    videoId: "VDDuGuRISGg",
    url: "https://www.youtube.com/watch?v=VDDuGuRISGg",
  },

];


/* ── STATE ────────────────────────────────────────────────── */
let currentFilter = 'all';
let searchTerm    = '';

/* ── HELPERS ──────────────────────────────────────────────── */
function regionLabel(r) {
  const labels = {
    asia:       'Asia',
    europe:     'Europe',
    americas:   'Americas',
    middleeast: 'Middle East',
  };
  return labels[r] || r;
}

/* ── FILTER CONTROLS ──────────────────────────────────────── */
function setFilter(region, btn) {
  currentFilter = region;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function filterTours() {
  searchTerm = document.getElementById('searchInput').value.toLowerCase();
  render();
}

/* ── RENDER GRID ──────────────────────────────────────────── */
function render() {
  const filtered = tours.filter(t => {
    const regionMatch =
      currentFilter === 'all'      ? true :
      currentFilter === 'trending' ? t.trending :
      t.region === currentFilter;

    const searchMatch =
      !searchTerm ||
      t.city.toLowerCase().includes(searchTerm) ||
      t.title.toLowerCase().includes(searchTerm);

    return regionMatch && searchMatch;
  });

  const tourCountEl = document.getElementById('tourCount');

if (tourCountEl) {
  tourCountEl.textContent = filtered.length + ' tours';
}
const grid = document.getElementById('grid');
if (!grid) return;

if (!filtered.length) {
  grid.innerHTML = `
    <div class="empty">
      <div class="empty-icon">🗺️</div>
      <p>No tours found. Try a different search or filter.</p>
    </div>`;
  return;
}

grid.innerHTML = filtered.map((t, i) => `
  <div class="card" style="animation-delay: ${i * 0.04}s">
    <div class="card-thumb" style="background: ${t.color};" onclick="openModal(${t.id})">
      <div class="card-thumb-bg">${t.emoji}</div>
      <div class="card-thumb-overlay"></div>
      <div class="thumb-play"><div class="thumb-play-tri"></div></div>

      <div class="card-badge-wrap">
        ${t.trending ? '<span class="badge badge-trending">Trending</span>' : ''}
        <span class="badge badge-region">${regionLabel(t.region)}</span>
      </div>

      <span class="card-duration">${t.duration}</span>
    </div>

    <div class="card-body">
      <p class="card-city">City: ${t.city}</p>
      <p class="card-country">Country: ${t.country}</p>
      <p class="card-title">${t.title}</p>

      <div class="card-footer">
        <span class="card-views"><strong>${t.views}</strong> views</span>
        <button class="card-watch" onclick="openModal(${t.id})">▶ Watch</button>
      </div>
    </div>
  </div>
`).join('');
}

/* ── MODAL ────────────────────────────────────────────────── */
function openModal(id) {
  const t = tours.find(x => x.id === id);
  if (!t) return;

  // Populate modal metadata
  document.getElementById('modalCity').textContent  = t.city;
  document.getElementById('modalTitle').textContent = t.title;
  document.getElementById('modalViews').textContent = `${t.views} views · ${t.duration}`;
  document.getElementById('modalYTLink').href        = t.url;

  const videoEl = document.getElementById('modalVideo');

  if (t.videoId) {
    // Embed the YouTube player directly
    videoEl.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${t.videoId}?autoplay=1&rel=0&modestbranding=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>`;
  } else {
    // Fallback placeholder for tours without a confirmed video ID
    videoEl.innerHTML = `
      <div class="modal-placeholder">
        <div class="big-emoji">${t.emoji}</div>
        <p class="placeholder-title">${t.title}</p>
        <p>No direct embed available for this tour yet.</p>
        <a href="${t.url}" target="_blank" rel="noopener">Search for it on YouTube ↗</a>
      </div>`;
  }

  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent background scrolling
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
  // Clear the iframe so the video actually stops playing
  document.getElementById('modalVideo').innerHTML = '';
}

function handleBackdropClick(e) {
  // Close only when clicking the dark backdrop itself, not the modal box
  if (e.target === document.getElementById('modal')) closeModal();
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ── STATS CALCULATION ────────────────────────────────────── */
function updateStats() {
  const totalTours = tours.length;
  const uniqueCities = new Set(tours.map(t => t.city.trim().toLowerCase())).size;
  const uniqueCountries = new Set(tours.map(t => t.country.trim().toLowerCase())).size;

  const totalViews = tours.reduce((sum, t) => {
    // Trim whitespace, then strip everything except digits and dots
    const cleaned = t.views.trim().replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const formattedViews = totalViews >= 1_000_000
    ? (totalViews / 1_000_000).toFixed(0) + 'M+'
    : totalViews.toLocaleString();

const statNums = document.querySelectorAll('.hero-stat-num');
  statNums[0].textContent = totalTours;
  statNums[1].textContent = uniqueCities;
  statNums[2].textContent = uniqueCountries;
  statNums[3].textContent = formattedViews;
}

/* ── FEATURED CARD ────────────────────────────────────────── */
function updateFeaturedCard() {
  const titleEl = document.querySelector('.featured-title');
  const viewsEl = document.querySelector('.featured-views');
  const btnEl = document.querySelector('.watch-pill');

  if (!titleEl || !viewsEl || !btnEl) return;

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const tour = tours[dayOfYear % tours.length];

  titleEl.textContent = tour.title;
  viewsEl.innerHTML = `<strong>${tour.views}</strong> · ${tour.duration}`;
  btnEl.setAttribute('onclick', `openModal(${tour.id})`);
}

/* ── INIT ─────────────────────────────────────────────────── */
render();
updateStats();
updateFeaturedCard();
