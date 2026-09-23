var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");

// src/data/initialData.ts
var BMICH_STALLS = [
  {
    id: "sarasavi-a",
    name: "Sarasavi Bookshop",
    hall: "Hall A",
    stallNumber: "A12 - A18",
    specialDiscount: "20% off with Sampath Credit Cards",
    category: "General & International Fiction, Translations"
  },
  {
    id: "gunasena-b",
    name: "M.D. Gunasena",
    hall: "Hall B",
    stallNumber: "B01 - B10",
    specialDiscount: "15% off with Sampath Debit Cards",
    category: "Children, Sinhala Classics, Educational"
  },
  {
    id: "vijitha-yapa-a",
    name: "Vijitha Yapa Bookshop",
    hall: "Hall A",
    stallNumber: "A01 - A06",
    specialDiscount: "Up to 25% on selected imports",
    category: "Best-sellers, Non-fiction, History"
  },
  {
    id: "expographic-c",
    name: "Expographic Books",
    hall: "Hall C",
    stallNumber: "C15 - C20",
    specialDiscount: "Sampath 20% off on Academic & Self-help",
    category: "Academic, Self Development, Sci-Fi"
  },
  {
    id: "grantha-s",
    name: "Grantha.lk",
    hall: "Sirimavo Hall",
    stallNumber: "S05 - S08",
    specialDiscount: "Buy 2 Get 1 Free offers",
    category: "Sinhala Contemporary, Translations, Graphic Novels"
  },
  {
    id: "lakehouse-b",
    name: "Lake House Bookshop",
    hall: "Hall B",
    stallNumber: "B14 - B18",
    specialDiscount: "15% instant discount on all titles",
    category: "Sri Lankan Heritage, Dictionaries, Literature"
  },
  {
    id: "godage-d",
    name: "Godage International",
    hall: "Hall D",
    stallNumber: "D01 - D08",
    specialDiscount: "Special fair discounts + Sampath cashback",
    category: "Sinhala Literature, Drama, Poetry, History"
  },
  {
    id: "samayawardhana-c",
    name: "Samayawardhana Publishers",
    hall: "Hall C",
    stallNumber: "C04 - C08",
    specialDiscount: "Special school discounts",
    category: "Novels, Translations, Religious books"
  },
  {
    id: "makeen-a",
    name: "Makeen Books",
    hall: "Hall A",
    stallNumber: "A22 - A26",
    specialDiscount: "15% off on Young Adult & Manga",
    category: "Manga, Young Adult, Fantasy, Imports"
  },
  {
    id: "dayawansa-d",
    name: "Dayawansa Jayakody & Co",
    hall: "Hall D",
    stallNumber: "D12 - D15",
    specialDiscount: "10% flat discount on all publications",
    category: "Sinhala Fiction, Cultural studies"
  },
  {
    id: "sadeepa-b",
    name: "Sadeepa Bookshop",
    hall: "Hall B",
    stallNumber: "B22 - B25",
    specialDiscount: "Sampath 15% instant voucher",
    category: "Stationery, Academic & General"
  },
  {
    id: "jumpbooks-c",
    name: "Jumpbooks.lk",
    hall: "Hall C",
    stallNumber: "C30 - C32",
    specialDiscount: "Special discount bundles for Gen Z & youth",
    category: "Thrillers, Romance, English Paperbacks"
  },
  {
    id: "jeya-a",
    name: "Jeya Book Centre",
    hall: "Hall A",
    stallNumber: "A30 - A34",
    specialDiscount: "Sampath cardholders 20% discount",
    category: "Medical, Engineering, International paperbacks"
  },
  {
    id: "masterguide-e",
    name: "Masterguide Publications",
    hall: "Hall E",
    stallNumber: "E10 - E14",
    specialDiscount: "Examination guides special price",
    category: "O/L & A/L Exam Guides, Past Papers"
  },
  {
    id: "buddhist-cultural-e",
    name: "Buddhist Cultural Centre",
    hall: "Hall E",
    stallNumber: "E01 - E04",
    specialDiscount: "15% off on Dhamma publications",
    category: "Philosophy, Buddhism, Meditation"
  }
];
var INITIAL_SPOTTINGS = [
  {
    id: "req-2",
    postType: "request",
    bookName: "Madol Doova (English Translation)",
    author: "Martin Wickramasinghe",
    stallId: "seeking",
    stallName: "BMICH Fairgrounds",
    hall: "Seeking in All Halls",
    stallNumber: "Not located yet",
    images: [],
    finderName: "Nipuni Perera",
    finderHandle: "@nipuni_reads",
    timestamp: Date.now() - 5 * 60 * 1e3,
    notes: "Looking for the English translation for a foreign friend visiting BMICH! Has anyone seen it?",
    status: "Looking for Book",
    helpfulCount: 3,
    aiVerified: true,
    isResolved: false
  },
  {
    id: "spot-hp-reply",
    postType: "spot",
    bookName: "Harry Potter and the Order of the Phoenix",
    author: "J.K. Rowling",
    stallId: "vijitha-yapa-a",
    stallName: "Vijitha Yapa Bookshop",
    hall: "Hall A",
    stallNumber: "A18 - A24",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80"
    ],
    finderName: "Tanya Perera",
    finderHandle: "@tanya_pages",
    timestamp: Date.now() - 10 * 60 * 1e3,
    replyToRequestId: "req-1",
    taggedRequesterName: "Kavindu Senanayake",
    taggedRequesterHandle: "@kavindu_s",
    priceOrOffer: "Rs. 3,200 (15% off with Sampath Card)",
    shelfLocationNote: "Found on Aisle 3 fiction shelf! 4 copies left near cashier counter.",
    status: "Few Copies Left",
    helpfulCount: 28,
    ratingAverage: 4.9,
    ratingCount: 24,
    aiVerified: true,
    sampathCardDiscount: "15% instant discount with Sampath Card"
  },
  {
    id: "req-1",
    postType: "request",
    bookName: "Harry Potter - Order of the Phoenix",
    author: "J.K. Rowling",
    stallId: "seeking",
    stallName: "BMICH Fairgrounds",
    hall: "Hall A",
    stallNumber: "Found by @tanya_pages",
    images: [],
    finderName: "Kavindu Senanayake",
    finderHandle: "@kavindu_s",
    timestamp: Date.now() - 18 * 60 * 1e3,
    notes: "Looking for Bloomsbury paperback edition with the blue cover.",
    status: "Found",
    helpfulCount: 8,
    aiVerified: true,
    isResolved: true,
    resolvedBySpotId: "spot-hp-reply"
  },
  {
    id: "spot-1",
    postType: "spot",
    bookName: "Atomic Habits by James Clear",
    author: "James Clear",
    stallId: "expographic-c",
    stallName: "Expographic Books",
    hall: "Hall C",
    stallNumber: "C15 - C20",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
    ],
    finderName: "Nethmi & Dilshan",
    finderHandle: "@bookspotted_lk",
    timestamp: Date.now() - 25 * 60 * 1e3,
    priceOrOffer: "Rs. 2,400 (Rs. 1,920 with Sampath Card)",
    shelfLocationNote: "Front counter display on shelf 2, next to psychology aisle. Stacks available!",
    status: "In Stock",
    helpfulCount: 38,
    ratingAverage: 4.8,
    ratingCount: 31,
    aiVerified: true,
    sampathCardDiscount: "20% off with Sampath Card"
  },
  {
    id: "spot-2",
    postType: "spot",
    bookName: "Madol Doova (\u0DB8\u0DA9\u0DDC\u0DBD\u0DCA \u0DAF\u0DD6\u0DC0) by Martin Wickramasinghe",
    author: "Martin Wickramasinghe",
    stallId: "gunasena-b",
    stallName: "M.D. Gunasena",
    hall: "Hall B",
    stallNumber: "B01 - B10",
    images: [
      "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"
    ],
    finderName: "Kasun Bandara",
    finderHandle: "@kasun_reads",
    timestamp: Date.now() - 40 * 60 * 1e3,
    priceOrOffer: "Rs. 650 hardcover edition",
    shelfLocationNote: "Right side entrance, Sri Lankan classics wooden shelf row 3.",
    status: "In Stock",
    helpfulCount: 24,
    ratingAverage: 5,
    ratingCount: 19,
    aiVerified: true,
    sampathCardDiscount: "15% instant debit card discount"
  },
  {
    id: "spot-3",
    bookName: "The Midnight Library by Matt Haig",
    author: "Matt Haig",
    stallId: "vijitha-yapa-a",
    stallName: "Vijitha Yapa Bookshop",
    hall: "Hall A",
    stallNumber: "A01 - A06",
    images: [
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507842229451-9f232615e324?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80"
    ],
    finderName: "Tanya Perera",
    finderHandle: "@tanya_pages",
    timestamp: Date.now() - 50 * 60 * 1e3,
    priceOrOffer: "Rs. 2,150 (Special festival price)",
    shelfLocationNote: "Middle table bento showcase under International Fiction banner.",
    status: "Few Copies Left",
    helpfulCount: 19,
    aiVerified: true,
    sampathCardDiscount: "Up to 25% off on selected titles"
  },
  {
    id: "spot-4",
    bookName: "Gamperaliya (\u0D9C\u0DB8\u0DCA\u0DB4\u0DD9\u0DBB\u0DC5\u0DD2\u0DBA) by Martin Wickramasinghe",
    author: "Martin Wickramasinghe",
    stallId: "godage-d",
    stallName: "Godage International",
    hall: "Hall D",
    stallNumber: "D01 - D08",
    images: [
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80"
    ],
    finderName: "Akeel Mohamed",
    finderHandle: "@akeel_lit",
    timestamp: Date.now() - 95 * 60 * 1e3,
    priceOrOffer: "Rs. 850 with commemorative bookmark",
    shelfLocationNote: 'Hall D center aisle, shelf D4 marked "Sahithya Sooriyo".',
    status: "In Stock",
    helpfulCount: 15,
    aiVerified: true,
    sampathCardDiscount: "Sampath Bank reward points eligible"
  },
  {
    id: "spot-5",
    bookName: "Atomic Habits by James Clear",
    author: "James Clear",
    stallId: "sarasavi-a",
    stallName: "Sarasavi Bookshop",
    hall: "Hall A",
    stallNumber: "A12 - A18",
    images: [
      "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80"
    ],
    finderName: "Dinithi Senanayake",
    finderHandle: "@dini_reads",
    timestamp: Date.now() - 140 * 60 * 1e3,
    priceOrOffer: "Rs. 2,350 (20% off with Sampath Card)",
    shelfLocationNote: "Section A14 right next to the new arrivals revolving tower.",
    status: "In Stock",
    helpfulCount: 42,
    aiVerified: true,
    sampathCardDiscount: "20% off with Sampath Card"
  }
];

// src/utils/moderationPatterns.ts
var VALID_NO_VOWEL_TOKENS = /* @__PURE__ */ new Set([
  "bmich",
  "lkr",
  "plc",
  "isbn",
  "pdf",
  "mp3",
  "dvd",
  "cd",
  "tv",
  "vol",
  "ed",
  "pp",
  "rs",
  "mr",
  "mrs",
  "dr",
  "st",
  "rd",
  "sl",
  "txt",
  "sms",
  "cctv",
  "pvt",
  "ltd",
  "fm",
  "slbc",
  "itn",
  "rupavahini"
]);
var AUTHENTIC_SINHALA_SINGLISH_VOCAB = /* @__PURE__ */ new Set([
  "karumakkarayo",
  "muthu",
  "ahura",
  "vanitha",
  "wasana",
  "gamperaliya",
  "madol",
  "doova",
  "viragaya",
  "senasuma",
  "kavya",
  "shekharaya",
  "guttilaya",
  "guttila",
  "kusajathakaya",
  "sandeshaya",
  "salalihini",
  "selalihini",
  "paravi",
  "kokila",
  "gira",
  "hamsa",
  "mayura",
  "amba",
  "yahaluwo",
  "hathpana",
  "magul",
  "kama",
  "handapana",
  "kaluwara",
  "gedara",
  "baddegama",
  "yuganthaya",
  "kaliyugaya",
  "thunmanhandiya",
  "bambaru",
  "avith",
  "siri",
  "medura",
  "arunodhya",
  "chithra",
  "jeewithaya",
  "adaraya",
  "samagiya",
  "shanthiya",
  "sahithya",
  "ithihasaya",
  "bhashawa",
  "vidyava",
  "kalawa",
  "darshanaya",
  "shilpaya",
  "potha",
  "poth",
  "aluth",
  "parana",
  "mulu",
  "gata",
  "lanka",
  "lankadeepa",
  "silumina",
  "dinamina",
  "divaina",
  "lankawa",
  "colombo",
  "bmich",
  "sarasavi",
  "godage",
  "gunasena",
  "dayawansa",
  "jayakody",
  "samudra",
  "wijesooriya",
  "grantha",
  "granthaaloke",
  "rathna",
  "visidunu",
  "fast",
  "lakehouse",
  "amarasekera",
  "wickramasinghe",
  "munidasa",
  "kumaratunga",
  "sarachchandra",
  "ediriweera",
  "jayatillake",
  "ilangaratne",
  "wettasinghe",
  "sekera",
  "mahagama",
  "alwis",
  "perera",
  "silva",
  "fernando",
  "hoyanawa",
  "hoyanna",
  "thiyenawa",
  "thiyeda",
  "thiyenawada",
  "kiyawanna",
  "balanna",
  "ganna",
  "denna",
  "kiyanna",
  "ahanna",
  "danna",
  "hambawuna",
  "dakke",
  "dakka",
  "ona",
  "adui",
  "wedi",
  "godak",
  "tika",
  "monawada",
  "koheda",
  "kavadada",
  "kageda",
  "mokakda",
  "kawda",
  "onna",
  "menna",
  "machan",
  "nawa",
  "katha",
  "kathawa",
  "ketikatha",
  "kata",
  "katakatha",
  "katakathawa",
  "katandara",
  "kathandara",
  "janakatha",
  "gamakatha",
  "purawrutha",
  "upakatha",
  "folklore",
  "folk",
  "stories",
  "tales",
  "folktales",
  "folktale",
  "achchi",
  "aththa",
  "paththare",
  "natat",
  "natath",
  "nathath",
  "ayek",
  "suramathin",
  "suramatin",
  "sura",
  "mathin",
  "natha",
  "apegama",
  "senkottan",
  "guru",
  "geethaya",
  "hima",
  "piyali",
  "suddha",
  "yuddhaya",
  "chandrika",
  "rashtriya",
  "shasthra",
  "paddlers",
  "creek"
]);
function isNonsensicalText(text) {
  if (!text) return { isNonsense: false };
  const trimmed = text.trim();
  if (trimmed.length === 0) return { isNonsense: false };
  const hasLetters = /[a-zA-Z\u0D80-\u0DFF\u0B80-\u0BFF]/.test(trimmed);
  if (!hasLetters && trimmed.length >= 3) {
    return {
      isNonsense: true,
      detail: "Input contains only symbols or numbers with no words."
    };
  }
  if (/([a-zA-Z])\1{3,}/i.test(trimmed)) {
    return {
      isNonsense: true,
      detail: "Repeated character spam detected."
    };
  }
  const isSinhalaScript = /[\u0D80-\u0DFF]/.test(trimmed);
  const isTamilScript = /[\u0B80-\u0BFF]/.test(trimmed);
  if (isSinhalaScript) {
    if (/([\u0D80-\u0DFF])\1{4,}/.test(trimmed)) {
      return {
        isNonsense: true,
        detail: "Repeated Sinhala character spam detected."
      };
    }
    if (/[\u0DCA]{2,}/.test(trimmed)) {
      return {
        isNonsense: true,
        detail: "Invalid character cluster in Sinhala script detected."
      };
    }
    if (/^[\u0D80-\u0DFF\s\d\p{P}]+$/u.test(trimmed)) {
      return { isNonsense: false };
    }
  }
  if (isTamilScript) {
    if (/([\u0B80-\u0BFF])\1{4,}/.test(trimmed)) {
      return {
        isNonsense: true,
        detail: "Repeated Tamil character spam detected."
      };
    }
    if (/[\u0BCD]{2,}/.test(trimmed)) {
      return {
        isNonsense: true,
        detail: "Invalid character cluster in Tamil script detected."
      };
    }
    if (/^[\u0B80-\u0BFF\s\d\p{P}]+$/u.test(trimmed)) {
      return { isNonsense: false };
    }
  }
  const KEYBOARD_SMASH_PATTERNS = [
    "asdfgh",
    "asdfjkl",
    "dfghjkl",
    "fghjkl",
    "ghjkl",
    "qwerty",
    "wertyu",
    "ertyui",
    "rtyuio",
    "tyuiop",
    "zxcvbn",
    "xcvbnm",
    "lkjhgf",
    "kjhgfd",
    "jhgfds",
    "poiuyt",
    "mnbvcx",
    "qazwsx",
    "wsxedc",
    "edcrfv",
    "rfvtgb",
    "yhnujm",
    "sdfsdf",
    "fjskdf",
    "shkdfj",
    "kjsdhf",
    "weripou"
  ];
  const compact = trimmed.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const smash of KEYBOARD_SMASH_PATTERNS) {
    if (compact.includes(smash) && compact.length <= smash.length + 4) {
      return {
        isNonsense: true,
        detail: "Keyboard row mash detected."
      };
    }
  }
  if (/\b(?:bla|pla|kru|womp){2,}\b/i.test(trimmed)) {
    return {
      isNonsense: true,
      detail: "Nonsense syllable repetition detected."
    };
  }
  const words = trimmed.split(/\s+/);
  for (const word of words) {
    const cleanWord = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (!cleanWord) continue;
    if (AUTHENTIC_SINHALA_SINGLISH_VOCAB.has(cleanWord)) {
      continue;
    }
    if (cleanWord.length >= 6 && /(.{2,4})\1{2,}/i.test(cleanWord)) {
      return {
        isNonsense: true,
        detail: `Repetitive keyboard loop in "${word}" detected.`
      };
    }
    if (cleanWord.length >= 3 && !/[aeiouy]/.test(cleanWord) && !VALID_NO_VOWEL_TOKENS.has(cleanWord)) {
      return {
        isNonsense: true,
        detail: `Meaningless word "${word}" without vowels detected.`
      };
    }
    if (cleanWord.length >= 4) {
      if (/(?:q[^u]|xj|jx|qz|zq|qx|xq|vx|xv|dxz|fgh|ghj|hjk|jkl|lkj|kjh|jhg|hgf|gfd|fds|dsa|zxcv|xcvb|cvbn|vbnm|qwrt|wryt)/i.test(cleanWord)) {
        return {
          isNonsense: true,
          detail: `Meaningless or invalid Singlish token "${word}" with unnatural letter structure detected.`
        };
      }
      const normalizedClusters = cleanWord.replace(/(?:thth|chch|dhdh|shth|ndr|kkh|tth|nth|nch|ndh|mbh)/g, "c").replace(/(?:th|ch|dh|sh|kh|gh|bh|ph|ng|nd|mb|gn|ny)/g, "c").replace(/(?:str|spl|thr|rhythm|ngth|night|ght|sch|psych|twelfth|glimpse|craft|bestsell)/g, "c");
      if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(normalizedClusters)) {
        return {
          isNonsense: true,
          detail: `Unnatural consonant cluster in "${word}" detected.`
        };
      }
      const vowels = cleanWord.match(/[aeiouy]/g);
      if (cleanWord.length >= 8 && (!vowels || vowels.length <= 1)) {
        return {
          isNonsense: true,
          detail: `Unnatural letter distribution in "${word}" detected.`
        };
      }
    }
  }
  return { isNonsense: false };
}
var ENGLISH_PROFANITY = [
  "fuck",
  "fucker",
  "fucking",
  "fucked",
  "shit",
  "shitty",
  "bitch",
  "bitches",
  "asshole",
  "bastard",
  "cunt",
  "dick",
  "pussy",
  "pussies",
  "cock",
  "whore",
  "slut",
  "motherfucker",
  "jackass",
  "douchebag",
  "wanker",
  "twat",
  "prick"
];
var SINHALA_SCRIPT_PROFANITY = [
  "\u0DB4\u0D9A\u0DBA\u0DCF",
  "\u0DB4\u0D9A",
  "\u0DB4\u0D9A\u0DDD",
  "\u0DB4\u0D9A\u0DDD",
  "\u0D9A\u0DD0\u0DBB\u0DD2\u0DBA\u0DCF",
  "\u0D9A\u0DD0\u0DBB\u0DD2",
  "\u0D9A\u0DD0\u0DBB\u0DD2\u0DBA\u0DDD",
  "\u0D9A\u0DD0\u0DBB\u0DD2\u0DBA\u0DD9\u0D9A\u0DCA",
  "\u0DC4\u0DD4\u0DAD\u0DCA\u0DAD",
  "\u0DC4\u0DD4\u0DAD\u0DCA\u0DAD\u0DDD",
  "\u0DC4\u0DD4\u0DAD\u0DCA\u0DAD\u0DDA",
  "\u0DC4\u0DD4\u0D9A\u0DB4\u0DB1\u0DCA",
  "\u0DC4\u0DD4\u0D9A\u0DB1\u0DCA\u0DB1\u0DCF",
  "\u0DC4\u0DD4\u0D9A\u0DB1",
  "\u0DC0\u0DDA\u0DC3\u0DD2",
  "\u0DC0\u0DDA\u0DC3\u0DCF\u0DC0\u0DCF",
  "\u0DC0\u0DDA\u0DC3\u0DD2\u0D9C\u0DD9",
  "\u0DC0\u0DDA\u0DC3",
  "\u0DB4\u0DDC\u0DB1\u0DCA\u0DB1\u0DBA\u0DCF",
  "\u0DB4\u0DDC\u0DB1\u0DCA\u0DB1",
  "\u0DB4\u0DDC\u0DB1\u0DCA\u0DC3\u0DCA",
  "\u0DB6\u0DBD\u0DCA\u0DBD\u0DCF",
  "\u0DB6\u0DD0\u0DBD\u0DCA\u0DBD\u0DD2",
  "\u0DB4\u0DBB\u0DBA\u0DCF",
  "\u0DB4\u0DBB\u0DBA\u0DDD",
  "\u0D9A\u0DBD\u0DC0\u0DD0\u0DAF\u0DCA\u0DAF\u0DCF",
  "\u0DB4\u0DBA\u0DD2\u0DBA",
  "\u0DB6\u0DD2\u0DA2\u0DCA\u0DA2",
  "\u0DAD\u0DDC\u0DAD\u0DCA\u0DAD\u0DCF",
  "\u0D85\u0DB8\u0DCA\u0DB8\u0DA7\u0DC4\u0DD4\u0D9A\u0DB1",
  "\u0D85\u0DB4\u0DAD\u0DBA\u0DCF"
];
var SINGLISH_PROFANITY = [
  "pakaya",
  "pakayaa",
  "pakayo",
  "paka",
  "pako",
  "pakoo",
  "pake",
  "pakenda",
  "kariya",
  "kariyo",
  "kari",
  "kariyek",
  "kari balla",
  "kariweda",
  "hutta",
  "hutto",
  "hutte",
  "huththe",
  "huththa",
  "hukapan",
  "hukanna",
  "hukanawa",
  "wesa",
  "wesi",
  "wesige",
  "wesikema",
  "wesigeputha",
  "wesige putha",
  "wesikeli",
  "ponnaya",
  "ponna",
  "ponz",
  "ponnay",
  "ponnayo",
  "ponnayek",
  "balla",
  "balli",
  "ballo",
  "paraya",
  "parayo",
  "kalawadda",
  "payya",
  "bijja",
  "ammata hukanwa",
  "ammata hukanna",
  "thuk nodokin",
  "pala hutto",
  "pala pakaya"
];
var TAMIL_SCRIPT_PROFANITY = [
  "\u0BA4\u0BC7\u0BB5\u0BBF\u0B9F\u0BBF\u0BAF\u0BBE",
  "\u0BAA\u0BC2\u0BB2\u0BCD",
  "\u0B93\u0BA4\u0BCD\u0BA4\u0BBE",
  "\u0B9A\u0BC1\u0BA9\u0BCD\u0BA9\u0BBF",
  "\u0BAE\u0BAF\u0BBF\u0BB0\u0BCD",
  "\u0BAA\u0BCA\u0B9F\u0BCD\u0B9F\u0BC8",
  "\u0BAA\u0BC1\u0BA3\u0BCD\u0B9F\u0BC8",
  "\u0B95\u0BC2\u0BA4\u0BBF",
  "\u0BA8\u0BBE\u0BAF\u0BC7",
  "\u0BAA\u0BA9\u0BCD\u0BA9\u0BBF",
  "\u0BA4\u0BBE\u0BAF\u0BCB\u0BB3\u0BBF",
  "\u0B95\u0BA3\u0BCD\u0B9F\u0BBE\u0BB0\u0BCB\u0BB3\u0BBF"
];
var TANGLISH_PROFANITY = [
  "thevidiya",
  "thevdia",
  "thevdiya",
  "thevidiya paiya",
  "otha",
  "othale",
  "ommale",
  "poolu",
  "pool",
  "sunni",
  "sunniya",
  "mayiru",
  "mayir",
  "pottai",
  "punda",
  "pundai",
  "pundamavan",
  "koothi",
  "naaye",
  "thaayoli",
  "kandaaroli"
];
var RACIST_AND_COMMUNAL_HATE_WORDS = [
  // English
  "nigger",
  "nigga",
  "chink",
  "kike",
  "spic",
  "wetback",
  "faggot",
  "tranny",
  "ethnic cleansing",
  "subhuman",
  "terrorist dog",
  // Sinhala Script Racist / Ethnic Hate
  "\u0DC4\u0DB8\u0DCA\u0DB6\u0DBA\u0DCF",
  "\u0DC4\u0DB8\u0DCA\u0DB6\u0DBA\u0DDD",
  "\u0DB4\u0DBB \u0DAF\u0DD9\u0DB8\u0DC5\u0DCF",
  "\u0DB8\u0DBB\u0D9A\u0DCA\u0D9A\u0DBD\u0DBA\u0DCF",
  "\u0D9A\u0DBD\u0DCA\u0DBD \u0DAD\u0DDD\u0DB1\u0DD2",
  "\u0DA2\u0DCF\u0DAD\u0DD2\u0DC0\u0DCF\u0DAF\u0DD3",
  "\u0DB8\u0DBB\u0DB8\u0DD4",
  "\u0DC0\u0DBB\u0DCA\u0D9C\u0DC0\u0DCF\u0DAF\u0DBA",
  "\u0DB6\u0DDD\u0DB8\u0DCA\u0DB6 \u0D9C\u0DC4\u0DB4\u0DBD\u0DCA\u0DBD\u0DCF",
  // Singlish Racist / Communal Slurs & Incitement
  "hambaya",
  "hambayo",
  "para demala",
  "marakkalaya",
  "kalla thoni",
  "demallu",
  "thambiya",
  "hamba balla",
  "maranna ona",
  "gahapalla",
  "bomb gahanna",
  "maramu",
  "sinhalaya maramu",
  "demala maramu",
  // Tanglish / Tamil Hate
  "sinhalavan",
  "kallathoni",
  "kolluvom"
];
function normalizeForSafetyCheck(raw) {
  if (!raw) return "";
  let str = raw.toLowerCase();
  str = str.replace(/[@4]/g, "a").replace(/[1!|]/g, "i").replace(/[3]/g, "e").replace(/[0]/g, "o").replace(/[$5]/g, "s").replace(/[7]/g, "t").replace(/[\*\_\-\.\,\/\\]/g, " ").replace(/\s+/g, " ").trim();
  return str;
}
function checkLocalProfanity(text) {
  if (!text || text.trim().length === 0) {
    return { isClean: true };
  }
  const normalized = normalizeForSafetyCheck(text);
  const rawLower = text.toLowerCase();
  for (const word of RACIST_AND_COMMUNAL_HATE_WORDS) {
    const wordNorm = word.toLowerCase();
    const isLatin = /^[a-z0-9\s]+$/i.test(wordNorm);
    const isMultiWord = wordNorm.includes(" ");
    const regex = new RegExp(`\\b${wordNorm}\\b`, "i");
    const matched = isLatin ? regex.test(normalized) || regex.test(rawLower) || isMultiWord && normalized.includes(wordNorm) : rawLower.includes(wordNorm) || normalized.includes(wordNorm);
    if (matched) {
      return {
        isClean: false,
        reason: "Restricted: Racist language, ethnic slurs, or communal disharmony is strictly forbidden by Sampath Bank community standards.",
        detectedType: "racist_or_ethnic_slur",
        matchedWord: word
      };
    }
  }
  for (const word of SINHALA_SCRIPT_PROFANITY) {
    if (rawLower.includes(word.toLowerCase())) {
      return {
        isClean: false,
        reason: "\u0D85\u0DC0\u0DC0\u0DCF\u0DAF\u0DBA\u0DBA\u0DD2: \u0D85\u0DC3\u0DB7\u0DCA\u200D\u0DBA \u0DC4\u0DDD \u0D85\u0DC1\u0DDD\u0DB7\u0DB1 \u0DC0\u0DA0\u0DB1 \u0DB7\u0DCF\u0DC0\u0DD2\u0DAD\u0DBA \u0DC3\u0DB8\u0DCA\u0DB4\u0DAD\u0DCA \u0DB6\u0DD0\u0D82\u0D9A\u0DD4 \u0DB4\u0DCA\u200D\u0DBB\u0DA2\u0DCF \u0DBB\u0DD3\u0DAD\u0DD2 \u0DB8\u0D9C\u0DD2\u0DB1\u0DCA \u0DAD\u0DC4\u0DB1\u0DB8\u0DCA \u0D9A\u0DBB \u0D87\u0DAD (Sinhala profanity restricted).",
        detectedType: "profanity",
        matchedWord: word
      };
    }
  }
  for (const word of SINGLISH_PROFANITY) {
    const wordNorm = word.toLowerCase();
    const isMultiWord = wordNorm.includes(" ");
    const regex = new RegExp(`\\b${wordNorm}\\b`, "i");
    if (regex.test(normalized) || regex.test(rawLower) || isMultiWord && normalized.includes(wordNorm)) {
      return {
        isClean: false,
        reason: "Restricted: Singlish profanity / offensive slang detected. Please keep communications clean and respectful.",
        detectedType: "profanity",
        matchedWord: word
      };
    }
  }
  for (const word of TAMIL_SCRIPT_PROFANITY) {
    if (rawLower.includes(word.toLowerCase())) {
      return {
        isClean: false,
        reason: "\u0B8E\u0B9A\u0BCD\u0B9A\u0BB0\u0BBF\u0B95\u0BCD\u0B95\u0BC8: \u0B86\u0BAA\u0BBE\u0B9A\u0BAE\u0BBE\u0BA9 \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0BA4\u0B95\u0BBE\u0BA4 \u0BB5\u0BBE\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC8\u0B95\u0BB3\u0BCD \u0BA4\u0B9F\u0BC8\u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BC1\u0BB3\u0BCD\u0BB3\u0BA9 (Tamil profanity restricted).",
        detectedType: "profanity",
        matchedWord: word
      };
    }
  }
  for (const word of TANGLISH_PROFANITY) {
    const wordNorm = word.toLowerCase();
    const isMultiWord = wordNorm.includes(" ");
    const regex = new RegExp(`\\b${wordNorm}\\b`, "i");
    if (regex.test(normalized) || regex.test(rawLower) || isMultiWord && normalized.includes(wordNorm)) {
      return {
        isClean: false,
        reason: "Restricted: Tanglish profanity / abusive slang detected.",
        detectedType: "profanity",
        matchedWord: word
      };
    }
  }
  for (const word of ENGLISH_PROFANITY) {
    const wordNorm = word.toLowerCase();
    const regex = new RegExp(`\\b${wordNorm}\\b`, "i");
    if (regex.test(normalized) || regex.test(rawLower)) {
      return {
        isClean: false,
        reason: "Restricted: English profanity / vulgarity is not permitted.",
        detectedType: "profanity",
        matchedWord: word
      };
    }
  }
  const nonsenseCheck = isNonsensicalText(text);
  if (nonsenseCheck.isNonsense) {
    return {
      isClean: false,
      reason: `Flagged as profanity: Input contains words or Singlish terms with no valid meaning when converted to English, Sinhala, or Singlish (${nonsenseCheck.detail || "meaningless words are banned from entering"}).`,
      detectedType: "profanity",
      matchedWord: nonsenseCheck.detail || "nonsensical_input"
    };
  }
  return { isClean: true };
}

// server.ts
process.on("uncaughtException", (err) => {
  if (err?.code === "EBUSY" && err?.syscall === "watch") {
    console.warn("[Watch Warning] Windows transient file lock ignored:", err.path || err.message);
    return;
  }
  console.error("Fatal Uncaught Exception:", err);
  process.exit(1);
});
var communitySpots = [...INITIAL_SPOTTINGS];
var aiClient = null;
function getAIClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
async function moderateContent(bookName, notes, shelfLocationNote, priceOrOffer, finderName, stallName) {
  const combinedText = [bookName, notes, shelfLocationNote, priceOrOffer, finderName, stallName].filter(Boolean).join(" ");
  const localCheck = checkLocalProfanity(combinedText);
  if (!localCheck.isClean) {
    return localCheck;
  }
  const ai = getAIClient();
  if (!ai) {
    return { isClean: true };
  }
  try {
    const prompt = `You are the Sampath Bank AI Community Peace & Safety Guardian for the BMICH Colombo Book Fair 2026.
Sampath Bank PLC is hosting this safe, inclusive community book-finding platform with ZERO-TOLERANCE for:
1. Profanity, vulgarity, obscenity, or foul language in ANY of these languages:
   - English (e.g. fuck, shit, bitch, cunt, dick, asshole, bastard, whore, etc.)
   - Sinhala script (\u0DC3\u0DD2\u0D82\u0DC4\u0DBD \u0D85\u0DC3\u0DB7\u0DCA\u200D\u0DBA \u0DC0\u0DA0\u0DB1 - e.g. \u0DB4\u0D9A\u0DBA\u0DCF, \u0DC4\u0DD4\u0DAD\u0DCA\u0DAD, \u0D9A\u0DD0\u0DBB\u0DD2\u0DBA\u0DCF, \u0DC0\u0DDA\u0DC3\u0DD2, \u0DB4\u0DDC\u0DB1\u0DCA\u0DB1, \u0DB6\u0DBD\u0DCA\u0DBD\u0DCF, etc.)
   - Singlish (Colloquial romanized Sinhala curse words/slurs - e.g. pakaya, hutto, hutte, kariya, wesi, wesige, ponnaya, hukapan, etc.)
   - Tamil script (\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD \u0B85\u0BB5\u0BA4\u0BC2\u0BB1\u0BC1 \u0BB5\u0BBE\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC8\u0B95\u0BB3\u0BCD - e.g. \u0BA4\u0BC7\u0BB5\u0BBF\u0B9F\u0BBF\u0BAF\u0BBE, \u0B93\u0BA4\u0BCD\u0BA4\u0BBE, \u0B9A\u0BC1\u0BA9\u0BCD\u0BA9\u0BBF, \u0BAE\u0BAF\u0BBF\u0BB0\u0BCD, \u0BAA\u0BCA\u0B9F\u0BCD\u0B9F\u0BC8, etc.)
   - Tanglish (Colloquial romanized Tamil slang - e.g. thevidiya, otha, poolu, sunni, punda, etc.)
2. Racist slurs, ethnic hatred, casteist abuse, or derogatory stereotyping targeting ANY community (Sinhalese, Tamils, Muslims, Burghers, Veddas, foreign tourists).
3. Any message that can harm the peace of a community (incitement to violence, rioting, boycotts, threats, religious conflict, political extremism, harassment, or disruption of social harmony).
4. NONSENSICAL GIBBERISH & KEYBOARD MASHING BAN:
   - Only flag inputs that are genuine gibberish, random keyboard mashing (e.g. "sdsd", "asdfgh", "qwerty", "zxcvbn", "dfghjkl", "fjskdfgh", "blablabla", "zzzxxxccc", "sdfsdfsdf"), random consonant noise without vowels, or obvious spam loops.
   - If an input is genuine keyboard mash or senseless noise:
     * Set "isClean": false, "violationType": "profanity", and "reason": "Flagged as profanity: Input is nonsensical gibberish or keyboard mashing."

5. AUTHENTIC WORDS & LINGUISTIC BALANCE (CRITICAL: DO NOT FLAG REAL WORDS):
   - You MUST identify and ALLOW all actual words in Sinhala script, Singlish (Romanized Sinhala), English, and Tamil:
     * ACTUAL SINHALA WORDS & NOVELS (in Sinhala script or Romanized Singlish):
       Examples: "Kata Katha" / "Katakatha" (\u0D9A\u0DA7\u0D9A\u0DAD\u0DCF - meaning folk stories, oral tales, folklore, traditional folklore storybooks), "Natat ayek suramathin" / "Natath Ayek Sura Mathin" (\u0DB1\u0DD0\u0DAD\u0DAD\u0DCA \u0D85\u0DBA\u0DD9\u0D9A\u0DCA \u0DC3\u0DD4\u0DBB\u0DB8\u0DAD\u0DD2\u0DB1\u0DCA - famous poetic Sinhala novel and Swarnavahini teledrama, literally meaning "Even if someone is not intoxicated by liquor/pride"), "karumakkarayo" (\u0D9A\u0DBB\u0DD4\u0DB8\u0D9A\u0DCA\u0D9A\u0DCF\u0DBB\u0DBA\u0DDD), "Muthu ahura" (\u0DB8\u0DD4\u0DAD\u0DD4 \u0D85\u0DC4\u0DD4\u0DBB), "Vanitha Wasana" (\u0DC0\u0DB1\u0DD2\u0DAD\u0DCF \u0DC0\u0DCF\u0DC3\u0DB1\u0DCF), "Gamperaliya" (\u0D9C\u0DB8\u0DCA\u0DB4\u0DD9\u0DBB\u0DC5\u0DD2\u0DBA), "Madol Doova" (\u0DB8\u0DA9\u0DDC\u0DBD\u0DCA \u0DAF\u0DD6\u0DC0), "Viragaya" (\u0DC0\u0DD2\u0DBB\u0DCF\u0D9C\u0DBA), "Amba Yahaluwo" (\u0D85\u0DB9 \u0DBA\u0DC4\u0DC5\u0DD4\u0DC0\u0DDD), "Kaluwara Gedara" (\u0D9A\u0DBD\u0DD4\u0DC0\u0DBB \u0D9C\u0DD9\u0DAF\u0DBB), "Baddegama" (\u0DB6\u0DD0\u0DAF\u0DCA\u0DAF\u0DDA\u0D9C\u0DB8), "Hathpana", "Magul Kama", "Senasuma", "Sandeshaya", "Guttilaya", "Kavya Shekharaya", "Kusajathakaya", "Potha", "Poth", "Lanka", "Colombo", etc. ARE 100% VALID AND MUST BE APPROVED (isClean: true).
       IMPORTANT NOTE ON "Kata Katha": In Sri Lankan literature and culture, "Kata Katha" (\u0D9A\u0DA7\u0D9A\u0DAD\u0DCF) literally means "folk stories" / oral tales / folklore (stories passed down orally). NEVER reject or flag "Kata Katha" or "Katakatha" as rumours, gossip, or profanity. It is completely safe and valid.
       IMPORTANT NOTE ON "Natat ayek suramathin": In Sri Lankan literature and television, "Natat ayek suramathin" (\u0DB1\u0DD0\u0DAD\u0DAD\u0DCA \u0D85\u0DBA\u0DD9\u0D9A\u0DCA \u0DC3\u0DD4\u0DBB\u0DB8\u0DAD\u0DD2\u0DB1\u0DCA) is a well-known novel and teledrama title. The phrase "suramathin" (\u0DC3\u0DD4\u0DBB\u0DB8\u0DAD\u0DD2\u0DB1\u0DCA / intoxicated) is used metaphorically in poetry. NEVER flag this title or "suramathin" as substance/alcohol abuse or profanity. It is 100% safe and must be approved.
     * ACTUAL ENGLISH BOOKS & TITLES:
       Examples: "Paddlers Creek", "Atomic Habits", "Harry Potter", "The Great Gatsby", "To Kill a Mockingbird", "Rich Dad Poor Dad", "The Alchemist", textbooks, poetry, fiction, non-fiction, folk stories, fairy tales ARE 100% VALID AND MUST BE APPROVED (isClean: true).
     * AUTHENTIC AUTHORS & PUBLISHERS:
       Examples: "Gunadasa Amarasekera", "Martin Wickramasinghe", "Kumaratunga Munidasa", "Ediriweera Sarachchandra", "K. Jayatillake", "T.B. Ilangaratne", "Sybill Wettasinghe", "Mahagama Sekera", "Dayawansa Jayakody", "Sarasavi", "Godage", "M.D. Gunasena", "Lake House" ARE 100% VALID.
     * CONVERSATIONAL READING REQUESTS:
       Sinhala/Singlish words like "hoyanawa" (searching), "thiyenawa" (available), "thiyeda" (is it there?), "potha" (book), "poth" (books), "kiyawanna" (to read), "ganna" (to buy/take), "aluth" (new), "parana" (old), "machan" (friend), "katandara" / "kathandara" (stories) ARE NATURAL AND MUST BE APPROVED.
   - DO NOT be confused between authentic Sinhala/Singlish vocabulary and fake words.
   - ONLY reject inputs if they are clearly fake pseudo-words, keyboard smashing with no linguistic validity, or contain profane/abusive slurs.

LITERARY CONTEXT:
- Authentic book titles, author queries, stall questions, folklore/folk stories, and reading requests make sense and MUST be APPROVED as clean (isClean: true) if free of vulgarity, slurs, or communal provocation.

Analyze this book spot submission:
Book Title: "${bookName || ""}"
Notes / Edition: "${notes || ""}"
Shelf Location: "${shelfLocationNote || ""}"
Price / Offer: "${priceOrOffer || ""}"
Finder Name: "${finderName || ""}"
Stall Name: "${stallName || ""}"

Respond ONLY with valid JSON in this exact structure:
{
  "isClean": boolean,
  "reason": "Brief polite explanation in English stating what was violated if rejected, or empty string if approved",
  "violationType": "clean" | "profanity" | "racist_or_ethnic_slur" | "communal_peace_harm" | "harassment"
}`;
    let responseText = "";
    for (const modelName of ["gemini-3.6-flash", "gemini-3.8-flash"]) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.1
          }
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err) {
        console.warn(`Model ${modelName} call failed, attempting fallback:`, err?.message || err);
      }
    }
    if (responseText) {
      const parsed = JSON.parse(responseText.trim() || "{}");
      if (typeof parsed.isClean === "boolean") {
        const lowerCombined = combinedText.toLowerCase();
        const hasFolkStoryOrClassicTerm = lowerCombined.includes("kata katha") || lowerCombined.includes("katakatha") || lowerCombined.includes("\u0D9A\u0DA7\u0D9A\u0DAD\u0DCF") || lowerCombined.includes("\u0D9A\u0DA7 \u0D9A\u0DAD\u0DCF") || lowerCombined.includes("folk stories") || lowerCombined.includes("folk tales") || lowerCombined.includes("folklore") || lowerCombined.includes("natat ayek suramathin") || lowerCombined.includes("natath ayek suramathin") || lowerCombined.includes("natat ayek") || lowerCombined.includes("natath ayek") || lowerCombined.includes("suramathin") || lowerCombined.includes("suramatin") || lowerCombined.includes("sura mathin") || lowerCombined.includes("\u0DB1\u0DD0\u0DAD\u0DAD\u0DCA \u0D85\u0DBA\u0DD9\u0D9A\u0DCA \u0DC3\u0DD4\u0DBB\u0DB8\u0DAD\u0DD2\u0DB1\u0DCA") || lowerCombined.includes("\u0DB1\u0DD0\u0DAD\u0DAD\u0DCA \u0D85\u0DBA\u0DD9\u0D9A\u0DCA") || lowerCombined.includes("\u0DC3\u0DD4\u0DBB\u0DB8\u0DAD\u0DD2\u0DB1\u0DCA") || lowerCombined.includes("\u0DC3\u0DD4\u0DBB \u0DB8\u0DAD\u0DD2\u0DB1\u0DCA");
        if (!parsed.isClean && hasFolkStoryOrClassicTerm) {
          const strictCheck = checkLocalProfanity(combinedText);
          if (strictCheck.isClean) {
            console.log("Approved legitimate literary or folk story term:", combinedText);
            return { isClean: true };
          }
        }
        return {
          isClean: parsed.isClean,
          reason: parsed.reason || (parsed.isClean ? void 0 : "Flagged by Sampath AI Safety Moderation: Inappropriate language detected."),
          detectedType: parsed.violationType
        };
      }
    }
  } catch (err) {
    console.warn("Gemini text moderation call warning (falling back to safety heuristics):", err);
  }
  return { isClean: true };
}
async function moderateImage(imageDataUrlOrUrl) {
  if (!imageDataUrlOrUrl || typeof imageDataUrlOrUrl !== "string") {
    return { isClean: true };
  }
  if (imageDataUrlOrUrl.startsWith("https://images.unsplash.com/")) {
    return { isClean: true };
  }
  const ai = getAIClient();
  if (!ai) {
    return { isClean: true };
  }
  const match = imageDataUrlOrUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) {
    if (imageDataUrlOrUrl.startsWith("http://") || imageDataUrlOrUrl.startsWith("https://")) {
      return { isClean: true };
    }
    return { isClean: false, reason: "Unsupported image format." };
  }
  const rawMime = match[1].toLowerCase();
  const mimeType = rawMime === "image/jpg" ? "image/jpeg" : rawMime;
  const base64Data = match[2];
  try {
    const prompt = `You are the Sampath Bank AI Image Safety Guardian for the official BMICH Colombo Book Fair 2026.
Analyze this uploaded photo to ensure it complies strictly with safe community standards for a family-friendly literary festival.

STRICT REJECTION CRITERIA (Reject if ANY are present):
1. Adult, NSFW, nudity, sexually suggestive, or vulgar poses.
2. Violence, weapons, firearms, knives, blood, gore, drugs, or alcohol.
3. Racist symbols, hate group flags (swastikas, hate emblems), offensive hand gestures (such as raising the middle finger, obscene hand signs), or graphics inciting ethnic/communal disharmony.
4. Trolling or malicious vandalism: completely irrelevant vulgar memes, obscene graffiti, or disturbing graphics.

ACCEPTABLE CONTENT (Approve):
Legitimate photos related to the book fair and reading:
- Books, book covers, open pages, magazines, comics, manga.
- Bookshelves, book stacks, stall aisles, BMICH exhibition halls.
- Bookshop signs, publisher stall banners, price tags, cash receipts.
- Readers legitimately browsing books without obscenity.

Respond ONLY with valid JSON in this exact structure:
{
  "isClean": boolean,
  "reason": "Polite explanation if rejected (e.g. 'Image contains offensive hand gesture' or 'Image contains inappropriate non-book content'), or empty string if approved",
  "category": "safe" | "profanity_or_gesture" | "hate_speech_or_racism" | "adult_content" | "violence" | "irrelevant_troll"
}`;
    let responseText = "";
    for (const modelName of ["gemini-3.6-flash", "gemini-3.8-flash"]) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: base64Data,
                  mimeType
                }
              }
            ]
          },
          config: {
            responseMimeType: "application/json",
            temperature: 0.1
          }
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err) {
        console.warn(`Image moderation model ${modelName} call failed, attempting fallback:`, err?.message || err);
      }
    }
    if (responseText) {
      const parsed = JSON.parse(responseText.trim() || "{}");
      if (typeof parsed.isClean === "boolean") {
        return {
          isClean: parsed.isClean,
          reason: parsed.reason || (parsed.isClean ? void 0 : "Flagged by Sampath AI Image Shield: Inappropriate image content."),
          violationType: parsed.category
        };
      }
    }
  } catch (err) {
    console.warn("Gemini image moderation warning (falling back):", err);
  }
  return { isClean: true };
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = Number(process.env.PORT) || 3001;
  app.use(import_express.default.json({ limit: "20mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "20mb" }));
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      event: "BMICH Book Fair 2026",
      sponsor: "Sampath Bank PLC",
      dates: "25th Sep - 4th Oct 2026"
    });
  });
  app.get("/api/stalls", (req, res) => {
    res.json({ stalls: BMICH_STALLS });
  });
  app.get("/api/spots", (req, res) => {
    const sorted = [...communitySpots].sort((a, b) => b.timestamp - a.timestamp);
    res.json({ spots: sorted });
  });
  app.post("/api/check-book", (req, res) => {
    const { bookName } = req.body;
    if (!bookName || typeof bookName !== "string") {
      return res.json({ matches: [] });
    }
    const query = bookName.trim().toLowerCase();
    if (query.length < 2) {
      return res.json({ matches: [] });
    }
    const matchingSpots = communitySpots.filter((spot) => {
      const target = spot.bookName.toLowerCase();
      return target.includes(query) || query.includes(target);
    });
    const stallMap = /* @__PURE__ */ new Map();
    for (const spot of matchingSpots) {
      const key = `${spot.stallName} (${spot.hall})`;
      if (!stallMap.has(key)) {
        stallMap.set(key, []);
      }
      stallMap.get(key).push(spot);
    }
    const results = matchingSpots.map((s) => ({
      id: s.id,
      bookName: s.bookName,
      stallName: s.stallName,
      hall: s.hall,
      stallNumber: s.stallNumber,
      priceOrOffer: s.priceOrOffer,
      images: s.images,
      shelfLocationNote: s.shelfLocationNote,
      timestamp: s.timestamp,
      status: s.status,
      finderHandle: s.finderHandle
    }));
    res.json({
      query,
      found: results.length > 0,
      count: results.length,
      stallsCount: stallMap.size,
      sightings: results
    });
  });
  app.post("/api/moderate-image", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.json({ isClean: true });
      }
      const result = await moderateImage(image);
      res.json(result);
    } catch (err) {
      res.status(500).json({ isClean: false, reason: "Image moderation check failed." });
    }
  });
  app.post("/api/moderate-text", async (req, res) => {
    try {
      const { text, context } = req.body;
      if (!text) {
        return res.json({ isClean: true });
      }
      const result = await moderateContent(text, context);
      res.json(result);
    } catch (err) {
      res.status(500).json({ isClean: false, reason: "Text moderation check failed." });
    }
  });
  app.post("/api/spots", async (req, res) => {
    try {
      const {
        postType = "spot",
        bookName,
        stallId,
        stallName,
        hall,
        stallNumber,
        images,
        finderName,
        priceOrOffer,
        shelfLocationNote,
        notes,
        replyToRequestId,
        taggedRequesterName,
        taggedRequesterHandle
      } = req.body;
      if (!bookName || typeof bookName !== "string" || bookName.trim().length < 2) {
        return res.status(400).json({ error: "Book name is required." });
      }
      const modResult = await moderateContent(
        bookName,
        notes,
        shelfLocationNote,
        priceOrOffer,
        finderName,
        stallName
      );
      if (!modResult.isClean) {
        return res.status(400).json({
          error: `AI Moderation: Message rejected. ${modResult.reason || "Contains inappropriate, racist, or prohibited language."} Sampath Bank community standards strictly prohibit profanity, racism, and communal discord.`,
          moderationBlocked: true,
          reason: modResult.reason,
          violationType: modResult.detectedType || "profanity"
        });
      }
      const photoList = Array.isArray(images) ? images : [];
      if (photoList.length > 3) {
        return res.status(400).json({ error: "A maximum of 3 pictures can be uploaded." });
      }
      for (let i = 0; i < photoList.length; i++) {
        const imgCheck = await moderateImage(photoList[i]);
        if (!imgCheck.isClean) {
          return res.status(400).json({
            error: `AI Image Moderation: Uploaded photo ${i + 1} was rejected. ${imgCheck.reason || "Image content violates community guidelines."} Only safe, appropriate photos of books and BMICH stalls are permitted.`,
            moderationBlocked: true,
            reason: imgCheck.reason,
            violationType: "image_safety",
            imageIndex: i
          });
        }
      }
      if (postType === "request") {
        const newRequest = {
          id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          postType: "request",
          bookName: bookName.trim(),
          stallId: "seeking",
          stallName: "BMICH Fairgrounds",
          hall: "Seeking in All Halls",
          stallNumber: "Looking for Stall",
          images: photoList,
          finderName: finderName?.trim() || "Book Fair Visitor",
          finderHandle: finderName?.trim() ? finderName.startsWith("@") ? finderName : `@${finderName.replace(/\s+/g, "_").toLowerCase()}` : "@booklover",
          timestamp: Date.now(),
          notes: notes?.trim() || void 0,
          status: "Looking for Book",
          helpfulCount: 0,
          aiVerified: true,
          isResolved: false
        };
        communitySpots.unshift(newRequest);
        return res.status(201).json({
          success: true,
          spot: newRequest,
          message: "Looking for book request posted to group chat!"
        });
      }
      if (!stallName || typeof stallName !== "string") {
        return res.status(400).json({ error: "Stall name must be selected from the participating stalls dropdown." });
      }
      let linkedRequesterName = taggedRequesterName;
      let linkedRequesterHandle = taggedRequesterHandle;
      if (replyToRequestId) {
        const targetRequest = communitySpots.find((s) => s.id === replyToRequestId);
        if (targetRequest) {
          targetRequest.isResolved = true;
          targetRequest.status = "Found";
          linkedRequesterName = targetRequest.finderName;
          linkedRequesterHandle = targetRequest.finderHandle;
        }
      }
      const matchedStall = BMICH_STALLS.find((s) => s.name.toLowerCase() === stallName.toLowerCase() || s.id === stallId);
      const newSpot = {
        id: `spot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        postType: "spot",
        bookName: bookName.trim(),
        stallId: stallId || matchedStall?.id || "other",
        stallName: stallName.trim(),
        hall: hall || matchedStall?.hall || "BMICH Main Fairgrounds",
        stallNumber: stallNumber || matchedStall?.stallNumber || "Fairground Stall",
        images: photoList,
        finderName: finderName?.trim() || "Anonymous Fair Visitor",
        finderHandle: finderName?.trim() ? finderName.startsWith("@") ? finderName : `@${finderName.replace(/\s+/g, "_").toLowerCase()}` : "@bookspotter",
        timestamp: Date.now(),
        priceOrOffer: priceOrOffer?.trim() || void 0,
        shelfLocationNote: shelfLocationNote?.trim() || void 0,
        notes: notes?.trim() || void 0,
        status: "In Stock",
        helpfulCount: 1,
        ratingAverage: 5,
        ratingCount: 1,
        aiVerified: true,
        sampathCardDiscount: matchedStall?.specialDiscount || "Eligible for Sampath Cardholder fair offers",
        replyToRequestId: replyToRequestId || void 0,
        taggedRequesterName: linkedRequesterName || void 0,
        taggedRequesterHandle: linkedRequesterHandle || void 0
      };
      if (replyToRequestId) {
        const targetReq = communitySpots.find((s) => s.id === replyToRequestId);
        if (targetReq) {
          targetReq.resolvedBySpotId = newSpot.id;
        }
      }
      communitySpots.unshift(newSpot);
      res.status(201).json({
        success: true,
        spot: newSpot,
        message: replyToRequestId ? `Tagged ${linkedRequesterName || "user"} with your found book location!` : "Book spot published to community feed successfully!"
      });
    } catch (err) {
      console.error("Error posting spot:", err);
      res.status(500).json({ error: "Failed to post book sighting. Please try again." });
    }
  });
  app.post("/api/spots/:id/rate", (req, res) => {
    const { id } = req.params;
    const { score } = req.body;
    const spot = communitySpots.find((s) => s.id === id);
    if (!spot) {
      return res.status(404).json({ error: "Spotting not found" });
    }
    const numScore = Math.max(1, Math.min(5, Number(score) || 5));
    const currentCount = spot.ratingCount || (spot.helpfulCount > 0 ? 1 : 0);
    const currentAvg = spot.ratingAverage || 5;
    const newCount = currentCount + 1;
    const newAverage = Number(((currentAvg * currentCount + numScore) / newCount).toFixed(1));
    spot.ratingCount = newCount;
    spot.ratingAverage = newAverage;
    spot.helpfulCount += 1;
    res.json({
      success: true,
      ratingAverage: spot.ratingAverage,
      ratingCount: spot.ratingCount,
      helpfulCount: spot.helpfulCount
    });
  });
  app.post("/api/spots/:id/upvote", (req, res) => {
    const { id } = req.params;
    const spot = communitySpots.find((s) => s.id === id);
    if (!spot) {
      return res.status(404).json({ error: "Spotting not found" });
    }
    spot.helpfulCount += 1;
    res.json({ success: true, helpfulCount: spot.helpfulCount });
  });
  app.post("/api/spots/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const spot = communitySpots.find((s) => s.id === id);
    if (!spot) {
      return res.status(404).json({ error: "Spotting not found" });
    }
    if (["In Stock", "Few Copies Left", "Sold Out", "Looking for Book", "Found"].includes(status)) {
      spot.status = status;
      return res.json({ success: true, status: spot.status });
    }
    res.status(400).json({ error: "Invalid status" });
  });
  const publicPath = import_path.default.join(process.cwd(), "public");
  app.use(import_express.default.static(publicPath));
  app.use("/sambook", import_express.default.static(publicPath));
  app.use("/bookfair", import_express.default.static(publicPath));
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.use("/sambook", import_express.default.static(distPath));
    app.use("/bookfair", import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BMICH Book Fair Community App Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
