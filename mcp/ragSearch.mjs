const VECTOR_DIM = 256;
const SEMANTIC_DIMS = 32;
const HASH_DIMS = VECTOR_DIM - SEMANTIC_DIMS;
const CONCEPT_ONTOLOGY = [
  {
    id: "water",
    labelTh: "\u0E2A\u0E32\u0E22\u0E19\u0E49\u0E33/\u0E17\u0E30\u0E40\u0E25\u0E2A\u0E32\u0E1A",
    labelEn: "Water & Lakes",
    keywords: [
      "\u0E2A\u0E32\u0E22\u0E19\u0E49\u0E33",
      "\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E19\u0E49\u0E33",
      "\u0E43\u0E15\u0E49\u0E19\u0E49\u0E33",
      "\u0E23\u0E34\u0E21\u0E19\u0E49\u0E33",
      "\u0E1C\u0E34\u0E27\u0E19\u0E49\u0E33",
      "\u0E2A\u0E31\u0E15\u0E27\u0E4C\u0E19\u0E49\u0E33",
      "\u0E17\u0E30\u0E40\u0E25\u0E2A\u0E32\u0E1A",
      "\u0E41\u0E21\u0E48\u0E19\u0E49\u0E33",
      "\u0E1A\u0E36\u0E07",
      "\u0E2B\u0E19\u0E2D\u0E07\u0E19\u0E49\u0E33",
      "\u0E21\u0E2B\u0E32\u0E2A\u0E21\u0E38\u0E17\u0E23",
      "\u0E04\u0E25\u0E2D\u0E07",
      "\u0E2D\u0E48\u0E32\u0E27",
      "\u0E1E\u0E23\u0E32\u0E22\u0E19\u0E49\u0E33",
      "\u0E40\u0E07\u0E37\u0E2D\u0E01",
      "\u0E08\u0E21\u0E19\u0E49\u0E33",
      "\u0E01\u0E31\u0E1B\u0E1B\u0E30",
      "\u0E40\u0E19\u0E2A\u0E0B\u0E35",
      "\u0E1A\u0E31\u0E19\u0E22\u0E34\u0E1B",
      "water",
      "lake",
      "river",
      "sea",
      "ocean",
      "swamp",
      "loch",
      "aquatic",
      "drown",
      "mermaid",
      "siren",
      "canal",
      "lagoon",
      "kappa"
    ]
  },
  {
    id: "forest",
    labelTh: "\u0E1B\u0E48\u0E32\u0E14\u0E07\u0E14\u0E34\u0E1A/\u0E20\u0E39\u0E40\u0E02\u0E32",
    labelEn: "Forest & Mountains",
    keywords: [
      "\u0E1B\u0E48\u0E32",
      "\u0E20\u0E39\u0E40\u0E02\u0E32",
      "\u0E15\u0E49\u0E19\u0E44\u0E21\u0E49",
      "\u0E1E\u0E23\u0E32\u0E19",
      "\u0E2B\u0E25\u0E07\u0E1B\u0E48\u0E32",
      "\u0E1E\u0E07\u0E44\u0E1E\u0E23",
      "\u0E2B\u0E38\u0E1A\u0E40\u0E02\u0E32",
      "\u0E16\u0E49\u0E33",
      "\u0E14\u0E07\u0E14\u0E34\u0E1A",
      "forest",
      "woods",
      "mountain",
      "tree",
      "jungle",
      "hunter",
      "valley",
      "cave",
      "wilderness",
      "timber"
    ]
  },
  {
    id: "winter",
    labelTh: "\u0E2B\u0E34\u0E21\u0E30/\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E19\u0E32\u0E27",
    labelEn: "Snow & Winter",
    keywords: [
      "\u0E2B\u0E34\u0E21\u0E30",
      "\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E19\u0E32\u0E27",
      "\u0E2B\u0E19\u0E32\u0E27\u0E40\u0E2B\u0E19\u0E47\u0E1A",
      "\u0E19\u0E49\u0E33\u0E41\u0E02\u0E47\u0E07",
      "\u0E24\u0E14\u0E39\u0E2B\u0E19\u0E32\u0E27",
      "\u0E1E\u0E32\u0E22\u0E38\u0E2B\u0E34\u0E21\u0E30",
      "\u0E02\u0E31\u0E49\u0E27\u0E42\u0E25\u0E01",
      "\u0E40\u0E22\u0E15\u0E34",
      "\u0E40\u0E27\u0E19\u0E14\u0E34\u0E42\u0E01",
      "snow",
      "winter",
      "ice",
      "frozen",
      "blizzard",
      "cold",
      "frost",
      "arctic",
      "yeti",
      "wendigo"
    ]
  },
  {
    id: "blood_vampire",
    labelTh: "\u0E2A\u0E39\u0E1A\u0E40\u0E25\u0E37\u0E2D\u0E14/\u0E41\u0E27\u0E21\u0E44\u0E1E\u0E23\u0E4C",
    labelEn: "Blood & Vampires",
    keywords: [
      "\u0E2A\u0E39\u0E1A\u0E40\u0E25\u0E37\u0E2D\u0E14",
      "\u0E14\u0E39\u0E14\u0E40\u0E25\u0E37\u0E2D\u0E14",
      "\u0E41\u0E27\u0E21\u0E44\u0E1E\u0E23\u0E4C",
      "\u0E41\u0E14\u0E23\u0E47\u0E01\u0E04\u0E39\u0E25\u0E32",
      "\u0E01\u0E23\u0E30\u0E2A\u0E37\u0E2D",
      "\u0E1B\u0E2D\u0E1A",
      "\u0E01\u0E34\u0E19\u0E04\u0E19",
      "\u0E01\u0E34\u0E19\u0E40\u0E19\u0E37\u0E49\u0E2D",
      "\u0E04\u0E27\u0E31\u0E01\u0E44\u0E2A\u0E49",
      "blood",
      "vampire",
      "dracula",
      "fangs",
      "cannibal",
      "flesh",
      "undead",
      "entrails",
      "ghoul",
      "chupacabra"
    ]
  },
  {
    id: "curse_magic",
    labelTh: "\u0E04\u0E33\u0E2A\u0E32\u0E1B/\u0E04\u0E38\u0E13\u0E44\u0E2A\u0E22",
    labelEn: "Curses & Black Magic",
    keywords: [
      "\u0E04\u0E33\u0E2A\u0E32\u0E1B",
      "\u0E04\u0E38\u0E13\u0E44\u0E2A\u0E22",
      "\u0E21\u0E19\u0E15\u0E4C\u0E14\u0E33",
      "\u0E2D\u0E32\u0E16\u0E23\u0E23\u0E1E\u0E4C",
      "\u0E2A\u0E32\u0E1B\u0E41\u0E0A\u0E48\u0E07",
      "\u0E41\u0E21\u0E48\u0E21\u0E14",
      "\u0E2B\u0E21\u0E2D\u0E1C\u0E35",
      "\u0E02\u0E2D\u0E07\u0E02\u0E25\u0E31\u0E07",
      "\u0E1E\u0E34\u0E18\u0E35\u0E01\u0E23\u0E23\u0E21",
      "curse",
      "cursed",
      "hex",
      "magic",
      "witch",
      "sorcery",
      "ritual",
      "spell",
      "occult",
      "taboo",
      "omen"
    ]
  },
  {
    id: "tomb_ancient",
    labelTh: "\u0E2A\u0E38\u0E2A\u0E32\u0E19/\u0E42\u0E1A\u0E23\u0E32\u0E13\u0E2A\u0E16\u0E32\u0E19",
    labelEn: "Tombs & Ancient Ruins",
    keywords: [
      "\u0E2A\u0E38\u0E2A\u0E32\u0E19",
      "\u0E1F\u0E32\u0E42\u0E23\u0E2B\u0E4C",
      "\u0E21\u0E31\u0E21\u0E21\u0E35\u0E48",
      "\u0E42\u0E25\u0E07\u0E28\u0E1E",
      "\u0E2B\u0E25\u0E38\u0E21\u0E28\u0E1E",
      "\u0E42\u0E1A\u0E23\u0E32\u0E13\u0E2A\u0E16\u0E32\u0E19",
      "\u0E1B\u0E23\u0E32\u0E2A\u0E32\u0E17",
      "\u0E23\u0E32\u0E0A\u0E27\u0E07\u0E28\u0E4C",
      "\u0E01\u0E29\u0E31\u0E15\u0E23\u0E34\u0E22\u0E4C",
      "\u0E27\u0E34\u0E2B\u0E32\u0E23",
      "tomb",
      "pharaoh",
      "mummy",
      "grave",
      "catacomb",
      "ancient",
      "castle",
      "fortress",
      "ruins",
      "burial",
      "crypt"
    ]
  },
  {
    id: "female_spirit",
    labelTh: "\u0E1C\u0E35\u0E1C\u0E39\u0E49\u0E2B\u0E0D\u0E34\u0E07/\u0E19\u0E32\u0E07\u0E44\u0E21\u0E49",
    labelEn: "Female Spirits",
    keywords: [
      "\u0E1C\u0E39\u0E49\u0E2B\u0E0D\u0E34\u0E07",
      "\u0E2B\u0E0D\u0E34\u0E07\u0E2A\u0E32\u0E27",
      "\u0E2A\u0E32\u0E27\u0E2A\u0E27\u0E22",
      "\u0E19\u0E32\u0E07\u0E44\u0E21\u0E49",
      "\u0E19\u0E32\u0E07\u0E15\u0E30\u0E40\u0E04\u0E35\u0E22\u0E19",
      "\u0E41\u0E21\u0E48\u0E19\u0E32\u0E04",
      "\u0E40\u0E08\u0E49\u0E32\u0E2A\u0E32\u0E27",
      "\u0E0A\u0E38\u0E14\u0E02\u0E32\u0E27",
      "\u0E1C\u0E21\u0E22\u0E32\u0E27",
      "woman",
      "female",
      "maiden",
      "lady",
      "bride",
      "girl",
      "banshee",
      "pontianak",
      "llorona"
    ]
  },
  {
    id: "love_tragedy",
    labelTh: "\u0E04\u0E27\u0E32\u0E21\u0E23\u0E31\u0E01/\u0E42\u0E28\u0E01\u0E19\u0E32\u0E0F\u0E01\u0E23\u0E23\u0E21",
    labelEn: "Love & Tragedy",
    keywords: [
      "\u0E04\u0E27\u0E32\u0E21\u0E23\u0E31\u0E01",
      "\u0E04\u0E19\u0E23\u0E31\u0E01",
      "\u0E23\u0E2D\u0E04\u0E2D\u0E22\u0E2A\u0E32\u0E21\u0E35",
      "\u0E2A\u0E32\u0E21\u0E35",
      "\u0E20\u0E23\u0E23\u0E22\u0E32",
      "\u0E04\u0E25\u0E2D\u0E14\u0E25\u0E39\u0E01",
      "\u0E42\u0E28\u0E01\u0E19\u0E32\u0E0F\u0E01\u0E23\u0E23\u0E21",
      "\u0E23\u0E49\u0E2D\u0E07\u0E44\u0E2B\u0E49",
      "\u0E42\u0E28\u0E01\u0E40\u0E28\u0E23\u0E49\u0E32",
      "\u0E15\u0E23\u0E2D\u0E21\u0E43\u0E08",
      "love",
      "lover",
      "husband",
      "wife",
      "childbirth",
      "weeping",
      "grief",
      "tragedy",
      "tragic",
      "heartbreak"
    ]
  },
  {
    id: "monster_cryptid",
    labelTh: "\u0E2A\u0E31\u0E15\u0E27\u0E4C\u0E1B\u0E23\u0E30\u0E2B\u0E25\u0E32\u0E14/\u0E2D\u0E2A\u0E39\u0E23",
    labelEn: "Monsters & Cryptids",
    keywords: [
      "\u0E2A\u0E31\u0E15\u0E27\u0E4C\u0E1B\u0E23\u0E30\u0E2B\u0E25\u0E32\u0E14",
      "\u0E2D\u0E2A\u0E39\u0E23",
      "\u0E2D\u0E2A\u0E38\u0E23\u0E01\u0E32\u0E22",
      "\u0E15\u0E31\u0E27\u0E1B\u0E23\u0E30\u0E2B\u0E25\u0E32\u0E14",
      "\u0E22\u0E31\u0E01\u0E29\u0E4C",
      "\u0E04\u0E23\u0E34\u0E1B\u0E15\u0E34\u0E14",
      "\u0E2A\u0E31\u0E15\u0E27\u0E4C\u0E25\u0E36\u0E01\u0E25\u0E31\u0E1A",
      "\u0E2B\u0E21\u0E32\u0E1B\u0E48\u0E32",
      "monster",
      "cryptid",
      "beast",
      "creature",
      "demon",
      "giant",
      "ogre",
      "wolf",
      "reptilian",
      "serpent"
    ]
  },
  {
    id: "sacred_deity",
    labelTh: "\u0E2A\u0E34\u0E48\u0E07\u0E28\u0E31\u0E01\u0E14\u0E34\u0E4C\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C/\u0E1E\u0E0D\u0E32\u0E19\u0E32\u0E04",
    labelEn: "Sacred & Deities",
    keywords: [
      "\u0E28\u0E31\u0E01\u0E14\u0E34\u0E4C\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C",
      "\u0E1E\u0E0D\u0E32\u0E19\u0E32\u0E04",
      "\u0E19\u0E32\u0E04\u0E32",
      "\u0E40\u0E17\u0E1E\u0E40\u0E08\u0E49\u0E32",
      "\u0E40\u0E17\u0E27\u0E14\u0E32",
      "\u0E27\u0E31\u0E14",
      "\u0E1A\u0E31\u0E49\u0E07\u0E44\u0E1F",
      "\u0E28\u0E23\u0E31\u0E17\u0E18\u0E32",
      "\u0E04\u0E38\u0E49\u0E21\u0E04\u0E23\u0E2D\u0E07",
      "\u0E28\u0E32\u0E25\u0E40\u0E08\u0E49\u0E32",
      "sacred",
      "naga",
      "deity",
      "god",
      "goddess",
      "temple",
      "shrine",
      "holy",
      "blessing",
      "guardian"
    ]
  },
  {
    id: "urban_modern",
    labelTh: "\u0E15\u0E33\u0E19\u0E32\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07/\u0E22\u0E38\u0E04\u0E43\u0E2B\u0E21\u0E48",
    labelEn: "Urban Legends",
    keywords: [
      "\u0E15\u0E33\u0E19\u0E32\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07",
      "\u0E2B\u0E19\u0E49\u0E32\u0E01\u0E32\u0E01\u0E2D\u0E19\u0E32\u0E21\u0E31\u0E22",
      "\u0E42\u0E23\u0E07\u0E40\u0E23\u0E35\u0E22\u0E19",
      "\u0E17\u0E49\u0E2D\u0E07\u0E16\u0E19\u0E19",
      "\u0E23\u0E16\u0E22\u0E19\u0E15\u0E4C",
      "\u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25",
      "\u0E01\u0E23\u0E23\u0E44\u0E01\u0E23",
      "\u0E1B\u0E32\u0E01\u0E09\u0E35\u0E01",
      "urban legend",
      "mask",
      "school",
      "highway",
      "scissors",
      "slit-mouthed",
      "kuchisake",
      "modern"
    ]
  },
  {
    id: "fire_light",
    labelTh: "\u0E14\u0E27\u0E07\u0E44\u0E1F/\u0E41\u0E2A\u0E07\u0E40\u0E23\u0E37\u0E2D\u0E07",
    labelEn: "Ghostly Lights & Fire",
    keywords: [
      "\u0E14\u0E27\u0E07\u0E44\u0E1F",
      "\u0E25\u0E39\u0E01\u0E44\u0E1F",
      "\u0E40\u0E23\u0E37\u0E2D\u0E07\u0E41\u0E2A\u0E07",
      "\u0E1A\u0E31\u0E49\u0E07\u0E44\u0E1F\u0E1E\u0E0D\u0E32\u0E19\u0E32\u0E04",
      "\u0E44\u0E1F\u0E1B\u0E23\u0E30\u0E2B\u0E25\u0E32\u0E14",
      "\u0E15\u0E32\u0E41\u0E14\u0E07\u0E09\u0E32\u0E19",
      "fireball",
      "glowing",
      "flame",
      "orb",
      "lantern",
      "wisp"
    ]
  },
  {
    id: "thailand",
    labelTh: "\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28\u0E44\u0E17\u0E22",
    labelEn: "Thailand",
    keywords: [
      "\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28\u0E44\u0E17\u0E22",
      "\u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E",
      "\u0E1E\u0E23\u0E30\u0E42\u0E02\u0E19\u0E07",
      "\u0E2B\u0E19\u0E2D\u0E07\u0E04\u0E32\u0E22",
      "\u0E1B\u0E23\u0E32\u0E08\u0E35\u0E19\u0E1A\u0E38\u0E23\u0E35",
      "\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48",
      "\u0E41\u0E21\u0E48\u0E19\u0E49\u0E33\u0E42\u0E02\u0E07",
      "\u0E2A\u0E22\u0E32\u0E21",
      "\u0E2D\u0E35\u0E2A\u0E32\u0E19",
      "\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32",
      "\u0E20\u0E32\u0E04\u0E43\u0E15\u0E49",
      "thailand",
      "thai",
      "bangkok",
      "mekong",
      "nong khai",
      "prachinburi",
      "chiang mai",
      "siam",
      "isan",
      "lanna"
    ]
  },
  {
    id: "east_asia",
    labelTh: "\u0E0D\u0E35\u0E48\u0E1B\u0E38\u0E48\u0E19/\u0E40\u0E2D\u0E40\u0E0A\u0E35\u0E22\u0E15\u0E30\u0E27\u0E31\u0E19\u0E2D\u0E2D\u0E01",
    labelEn: "Japan & East Asia",
    keywords: [
      "\u0E0D\u0E35\u0E48\u0E1B\u0E38\u0E48\u0E19",
      "\u0E42\u0E15\u0E40\u0E01\u0E35\u0E22\u0E27",
      "\u0E42\u0E0A\u0E27\u0E30",
      "\u0E42\u0E22\u0E44\u0E04",
      "\u0E08\u0E35\u0E19",
      "\u0E40\u0E01\u0E32\u0E2B\u0E25\u0E35",
      "japan",
      "japanese",
      "tokyo",
      "shinjuku",
      "yokai",
      "china",
      "chinese",
      "korea",
      "korean"
    ]
  },
  {
    id: "southeast_asia",
    labelTh: "\u0E2D\u0E32\u0E40\u0E0B\u0E35\u0E22\u0E19/\u0E40\u0E2D\u0E40\u0E0A\u0E35\u0E22\u0E15\u0E30\u0E27\u0E31\u0E19\u0E2D\u0E2D\u0E01\u0E40\u0E09\u0E35\u0E22\u0E07\u0E43\u0E15\u0E49",
    labelEn: "Southeast Asia",
    keywords: [
      "\u0E2D\u0E34\u0E19\u0E42\u0E14\u0E19\u0E35\u0E40\u0E0B\u0E35\u0E22",
      "\u0E21\u0E32\u0E40\u0E25\u0E40\u0E0B\u0E35\u0E22",
      "\u0E1F\u0E34\u0E25\u0E34\u0E1B\u0E1B\u0E34\u0E19\u0E2A\u0E4C",
      "\u0E0A\u0E27\u0E32",
      "\u0E1A\u0E32\u0E2B\u0E25\u0E35",
      "\u0E25\u0E32\u0E27",
      "\u0E01\u0E31\u0E21\u0E1E\u0E39\u0E0A\u0E32",
      "\u0E40\u0E27\u0E35\u0E22\u0E14\u0E19\u0E32\u0E21",
      "indonesia",
      "malaysia",
      "philippines",
      "java",
      "bali",
      "southeast asia",
      "borneo"
    ]
  },
  {
    id: "europe_uk",
    labelTh: "\u0E22\u0E38\u0E42\u0E23\u0E1B/\u0E2A\u0E2B\u0E23\u0E32\u0E0A\u0E2D\u0E32\u0E13\u0E32\u0E08\u0E31\u0E01\u0E23",
    labelEn: "Europe & UK",
    keywords: [
      "\u0E22\u0E38\u0E42\u0E23\u0E1B",
      "\u0E2A\u0E01\u0E2D\u0E15\u0E41\u0E25\u0E19\u0E14\u0E4C",
      "\u0E2D\u0E31\u0E07\u0E01\u0E24\u0E29",
      "\u0E42\u0E23\u0E21\u0E32\u0E40\u0E19\u0E35\u0E22",
      "\u0E17\u0E23\u0E32\u0E19\u0E0B\u0E34\u0E25\u0E40\u0E27\u0E40\u0E19\u0E35\u0E22",
      "\u0E1D\u0E23\u0E31\u0E48\u0E07\u0E40\u0E28\u0E2A",
      "\u0E2D\u0E34\u0E15\u0E32\u0E25\u0E35",
      "\u0E40\u0E22\u0E2D\u0E23\u0E21\u0E19\u0E35",
      "\u0E01\u0E23\u0E35\u0E0B",
      "\u0E2A\u0E40\u0E1B\u0E19",
      "\u0E40\u0E0A\u0E47\u0E01",
      "\u0E1B\u0E23\u0E32\u0E01",
      "\u0E44\u0E2D\u0E23\u0E4C\u0E41\u0E25\u0E19\u0E14\u0E4C",
      "europe",
      "european",
      "scotland",
      "scottish",
      "england",
      "britain",
      "romania",
      "transylvania",
      "france",
      "italy",
      "germany",
      "greece",
      "spain",
      "prague",
      "ireland"
    ]
  },
  {
    id: "nordic_scandinavia",
    labelTh: "\u0E2A\u0E41\u0E01\u0E19\u0E14\u0E34\u0E40\u0E19\u0E40\u0E27\u0E35\u0E22/\u0E22\u0E38\u0E42\u0E23\u0E1B\u0E40\u0E2B\u0E19\u0E37\u0E2D",
    labelEn: "Nordic & Scandinavia",
    keywords: [
      "\u0E19\u0E2D\u0E23\u0E4C\u0E40\u0E27\u0E22\u0E4C",
      "\u0E2A\u0E27\u0E35\u0E40\u0E14\u0E19",
      "\u0E1F\u0E34\u0E19\u0E41\u0E25\u0E19\u0E14\u0E4C",
      "\u0E44\u0E2D\u0E0B\u0E4C\u0E41\u0E25\u0E19\u0E14\u0E4C",
      "\u0E44\u0E27\u0E01\u0E34\u0E49\u0E07",
      "\u0E19\u0E2D\u0E23\u0E4C\u0E2A",
      "\u0E23\u0E31\u0E2A\u0E40\u0E0B\u0E35\u0E22",
      "\u0E2A\u0E25\u0E32\u0E1F",
      "norway",
      "norwegian",
      "sweden",
      "swedish",
      "nordic",
      "scandinavia",
      "viking",
      "slavic",
      "russia"
    ]
  },
  {
    id: "americas",
    labelTh: "\u0E2D\u0E40\u0E21\u0E23\u0E34\u0E01\u0E32/\u0E25\u0E30\u0E15\u0E34\u0E19\u0E2D\u0E40\u0E21\u0E23\u0E34\u0E01\u0E32",
    labelEn: "Americas & Latin America",
    keywords: [
      "\u0E2D\u0E40\u0E21\u0E23\u0E34\u0E01\u0E32",
      "\u0E2A\u0E2B\u0E23\u0E31\u0E10",
      "\u0E21\u0E34\u0E19\u0E19\u0E34\u0E42\u0E0B\u0E15\u0E32",
      "\u0E40\u0E21\u0E47\u0E01\u0E0B\u0E34\u0E42\u0E01",
      "\u0E25\u0E30\u0E15\u0E34\u0E19",
      "\u0E41\u0E04\u0E19\u0E32\u0E14\u0E32",
      "\u0E1A\u0E23\u0E32\u0E0B\u0E34\u0E25",
      "\u0E40\u0E1B\u0E23\u0E39",
      "\u0E40\u0E1B\u0E2D\u0E23\u0E4C\u0E42\u0E15\u0E23\u0E34\u0E42\u0E01",
      "america",
      "american",
      "usa",
      "minnesota",
      "mexico",
      "mexican",
      "latin america",
      "puerto rico",
      "canada",
      "brazil",
      "andes"
    ]
  },
  {
    id: "africa_middle_east",
    labelTh: "\u0E2D\u0E35\u0E22\u0E34\u0E1B\u0E15\u0E4C/\u0E41\u0E2D\u0E1F\u0E23\u0E34\u0E01\u0E32/\u0E15\u0E30\u0E27\u0E31\u0E19\u0E2D\u0E2D\u0E01\u0E01\u0E25\u0E32\u0E07",
    labelEn: "Egypt, Africa & Middle East",
    keywords: [
      "\u0E2D\u0E35\u0E22\u0E34\u0E1B\u0E15\u0E4C",
      "\u0E25\u0E31\u0E01\u0E0B\u0E2D\u0E23\u0E4C",
      "\u0E41\u0E2D\u0E1F\u0E23\u0E34\u0E01\u0E32",
      "\u0E2D\u0E32\u0E2B\u0E23\u0E31\u0E1A",
      "\u0E17\u0E30\u0E40\u0E25\u0E17\u0E23\u0E32\u0E22",
      "\u0E0B\u0E32\u0E2E\u0E32\u0E23\u0E32",
      "egypt",
      "egyptian",
      "luxor",
      "africa",
      "african",
      "arabia",
      "arabian",
      "desert",
      "middle east"
    ]
  },
  {
    id: "oceania",
    labelTh: "\u0E2D\u0E2D\u0E2A\u0E40\u0E15\u0E23\u0E40\u0E25\u0E35\u0E22/\u0E42\u0E2D\u0E40\u0E0A\u0E35\u0E22\u0E40\u0E19\u0E35\u0E22",
    labelEn: "Australia & Oceania",
    keywords: [
      "\u0E2D\u0E2D\u0E2A\u0E40\u0E15\u0E23\u0E40\u0E25\u0E35\u0E22",
      "\u0E27\u0E34\u0E01\u0E15\u0E2D\u0E40\u0E23\u0E35\u0E22",
      "\u0E2D\u0E30\u0E1A\u0E2D\u0E23\u0E34\u0E08\u0E34\u0E19",
      "\u0E19\u0E34\u0E27\u0E0B\u0E35\u0E41\u0E25\u0E19\u0E14\u0E4C",
      "australia",
      "australian",
      "victoria",
      "aboriginal",
      "oceania",
      "zealand"
    ]
  }
];
function matchesKeyword(lowerText, kw) {
  if (/^[a-z\s-]+$/i.test(kw)) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "i");
    return re.test(lowerText);
  }
  return lowerText.includes(kw);
}
function hashToken(token, seed = 0) {
  let h = 2166136261 ^ seed;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const unsigned = h >>> 0;
  return {
    index: SEMANTIC_DIMS + unsigned % HASH_DIMS,
    sign: (unsigned & 1) === 0 ? 1 : -1
  };
}
function extractFeatures(text) {
  const clean = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const features = [];
  const words = clean.split(" ");
  for (const w of words) {
    if (!w) continue;
    features.push(`w:${w}`);
    const compact = w;
    for (let i = 0; i <= compact.length - 3; i++) {
      features.push(`g3:${compact.slice(i, i + 3)}`);
    }
    for (let i = 0; i <= compact.length - 4; i++) {
      features.push(`g4:${compact.slice(i, i + 4)}`);
    }
  }
  return features;
}
function computeEmbedding(text) {
  const vec = new Float32Array(VECTOR_DIM);
  const lower = text.toLowerCase();
  CONCEPT_ONTOLOGY.forEach((axis, idx) => {
    if (idx >= SEMANTIC_DIMS) return;
    let hits = 0;
    for (const kw of axis.keywords) {
      if (matchesKeyword(lower, kw)) {
        hits += 1;
      }
    }
    if (hits > 0) {
      vec[idx] = Math.min(6, 2.8 + Math.log1p(hits) * 1.6);
    }
  });
  const features = extractFeatures(lower);
  for (const feat of features) {
    const weight = feat.startsWith("w:") ? 1.2 : feat.startsWith("g4:") ? 0.65 : 0.35;
    const { index, sign } = hashToken(feat, 42);
    vec[index] += sign * weight;
  }
  let normSq = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    normSq += vec[i] * vec[i];
  }
  if (normSq > 0) {
    const invNorm = 1 / Math.sqrt(normSq);
    for (let i = 0; i < VECTOR_DIM; i++) {
      vec[i] *= invNorm;
    }
  }
  return vec;
}
function computePinEmbedding(pin) {
  const docText = [
    pin.title_th,
    pin.title_th,
    pin.title_en,
    pin.title_en,
    pin.province_th,
    pin.province_en,
    pin.district_th || "",
    pin.district_en || "",
    pin.category,
    pin.story_th,
    pin.story_en,
    pin.folklore_history_th,
    pin.folklore_history_en
  ].join(" ");
  return computeEmbedding(docText);
}
function cosineSimilarity(a, b) {
  let dot = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}
const pinEmbeddingCache = /* @__PURE__ */ new Map();
function getPinEmbedding(pin) {
  const key = `${pin.id}:${pin.title_th}:${pin.updated_at || ""}`;
  let vec = pinEmbeddingCache.get(key);
  if (!vec) {
    vec = computePinEmbedding(pin);
    pinEmbeddingCache.set(key, vec);
  }
  return vec;
}
function getMatchedConcepts(queryLower, pin, lang) {
  const pinText = [
    pin.title_th,
    pin.title_en,
    pin.province_th,
    pin.province_en,
    pin.story_th,
    pin.story_en,
    pin.folklore_history_th,
    pin.folklore_history_en
  ].join(" ").toLowerCase();
  const tags = [];
  for (const axis of CONCEPT_ONTOLOGY) {
    const queryHas = axis.keywords.some((kw) => matchesKeyword(queryLower, kw));
    const pinHas = axis.keywords.some((kw) => matchesKeyword(pinText, kw));
    if (queryHas && pinHas) {
      tags.push(lang === "th" ? axis.labelTh : axis.labelEn);
    }
  }
  return tags.slice(0, 3);
}
function performVectorRagSearch(query, pins, language = "th", limit = 8) {
  const q = query.trim();
  if (!q) {
    return {
      query: "",
      ragSummary: "",
      results: []
    };
  }
  const qLower = q.toLowerCase();
  const qVec = computeEmbedding(qLower);
  const scored = [];
  for (const pin of pins) {
    const pVec = getPinEmbedding(pin);
    const cosSim = Math.max(0, cosineSimilarity(qVec, pVec));
    const titleMatch = pin.title_th.toLowerCase().includes(qLower) || pin.title_en.toLowerCase().includes(qLower);
    const locMatch = pin.province_th.toLowerCase().includes(qLower) || pin.province_en.toLowerCase().includes(qLower) || Boolean(pin.district_th && pin.district_th.toLowerCase().includes(qLower)) || Boolean(pin.district_en && pin.district_en.toLowerCase().includes(qLower));
    const storyMatch = pin.story_th.toLowerCase().includes(qLower) || pin.story_en.toLowerCase().includes(qLower) || pin.folklore_history_th.toLowerCase().includes(qLower) || pin.folklore_history_en.toLowerCase().includes(qLower);
    const matchedConceptTags = getMatchedConcepts(qLower, pin, language);
    let hybridScore = cosSim;
    if (titleMatch) hybridScore += 0.55;
    if (locMatch) hybridScore += 0.45;
    if (storyMatch) hybridScore += 0.3;
    if (matchedConceptTags.length > 0) {
      hybridScore += matchedConceptTags.length * 0.24;
    }
    const isRelevant = titleMatch || locMatch || storyMatch || matchedConceptTags.length > 0 || cosSim >= 0.25;
    if (isRelevant && hybridScore >= 0.25) {
      const normalizedScore = Math.min(0.99, Math.max(0.52, 0.5 + Math.min(0.49, hybridScore * 0.42)));
      const storyText = language === "th" ? pin.story_th : pin.story_en;
      const historyText = language === "th" ? pin.folklore_history_th : pin.folklore_history_en;
      const matchedSnippet = storyText || historyText;
      scored.push({
        pin,
        score: normalizedScore,
        rawScore: hybridScore,
        cosineSimilarity: cosSim,
        matchedSnippet,
        matchedConceptTags
      });
    }
  }
  scored.sort((a, b) => b.rawScore - a.rawScore);
  const topResults = scored.slice(0, limit);
  let ragSummary = "";
  if (topResults.length > 0) {
    const top1 = topResults[0].pin;
    const topNames = topResults.slice(0, 3).map((r) => language === "th" ? r.pin.title_th : r.pin.title_en).join(", ");
    if (language === "th") {
      const snippet = top1.story_th.slice(0, 110);
      ragSummary = `\u0E1E\u0E1A ${scored.length} \u0E15\u0E33\u0E19\u0E32\u0E19\u0E17\u0E35\u0E48\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E42\u0E22\u0E07\u0E01\u0E31\u0E1A "${q}" \u2014 \u0E42\u0E14\u0E14\u0E40\u0E14\u0E48\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E04\u0E37\u0E2D ${topNames} (${top1.province_th}): ${snippet}...`;
    } else {
      const snippet = top1.story_en.slice(0, 110);
      ragSummary = `Found ${scored.length} legends semantically linked to "${q}" \u2014 led by ${topNames} (${top1.province_en}): ${snippet}...`;
    }
  } else {
    ragSummary = language === "th" ? `\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E15\u0E33\u0E19\u0E32\u0E19\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A "${q}" \u0E42\u0E14\u0E22\u0E15\u0E23\u0E07 \u0E25\u0E2D\u0E07\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E14\u0E49\u0E27\u0E22\u0E04\u0E33\u0E41\u0E19\u0E27\u0E04\u0E34\u0E14 \u0E40\u0E0A\u0E48\u0E19 "\u0E2A\u0E31\u0E15\u0E27\u0E4C\u0E43\u0E19\u0E19\u0E49\u0E33", "\u0E1B\u0E48\u0E32\u0E2B\u0E34\u0E21\u0E30", "\u0E04\u0E33\u0E2A\u0E32\u0E1B", "\u0E04\u0E27\u0E32\u0E21\u0E23\u0E31\u0E01", \u0E2B\u0E23\u0E37\u0E2D\u0E0A\u0E37\u0E48\u0E2D\u0E17\u0E27\u0E35\u0E1B/\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28` : `No direct match for "${q}". Try semantic concepts like "water creature", "snow forest", "ancient curse", "tragic love", or region names.`;
  }
  return {
    query: q,
    ragSummary,
    results: topResults
  };
}
const SUGGESTED_RAG_QUERIES = {
  th: [
    "\u{1F30A} \u0E2A\u0E31\u0E15\u0E27\u0E4C\u0E1B\u0E23\u0E30\u0E2B\u0E25\u0E32\u0E14\u0E41\u0E25\u0E30\u0E1E\u0E23\u0E32\u0E22\u0E19\u0E49\u0E33",
    "\u2744\uFE0F \u0E2D\u0E2A\u0E39\u0E23\u0E41\u0E25\u0E30\u0E20\u0E39\u0E15\u0E1C\u0E35\u0E43\u0E19\u0E1B\u0E48\u0E32\u0E2B\u0E34\u0E21\u0E30",
    "\u{1F9DB} \u0E41\u0E27\u0E21\u0E44\u0E1E\u0E23\u0E4C\u0E41\u0E25\u0E30\u0E04\u0E33\u0E2A\u0E32\u0E1B\u0E42\u0E1A\u0E23\u0E32\u0E13",
    "\u{1F494} \u0E27\u0E34\u0E0D\u0E0D\u0E32\u0E13\u0E41\u0E25\u0E30\u0E15\u0E33\u0E19\u0E32\u0E19\u0E23\u0E31\u0E01\u0E40\u0E28\u0E23\u0E49\u0E32",
    "\u{1F409} \u0E1E\u0E0D\u0E32\u0E19\u0E32\u0E04\u0E41\u0E25\u0E30\u0E2A\u0E34\u0E48\u0E07\u0E28\u0E31\u0E01\u0E14\u0E34\u0E4C\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C",
    "\u{1F3F0} \u0E1B\u0E23\u0E32\u0E2A\u0E32\u0E17\u0E41\u0E25\u0E30\u0E2D\u0E32\u0E16\u0E23\u0E23\u0E1E\u0E4C\u0E22\u0E38\u0E42\u0E23\u0E1B"
  ],
  en: [
    "\u{1F30A} Water beasts & lake spirits",
    "\u2744\uFE0F Snow forest beasts & spirits",
    "\u{1F9DB} Vampires & ancient curses",
    "\u{1F494} Spirits & tragic love lore",
    "\u{1F409} Sacred Naga & deities",
    "\u{1F3F0} Haunted castles in Europe"
  ]
};
export {
  SUGGESTED_RAG_QUERIES,
  computeEmbedding,
  cosineSimilarity,
  performVectorRagSearch
};
