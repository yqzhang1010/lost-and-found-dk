import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import type { User } from "@supabase/supabase-js";
import {
  Bookmark,
  CheckCircle2,
  Filter,
  Flag,
  Globe2,
  ImagePlus,
  Mail,
  MapPin,
  Maximize2,
  Pencil,
  Phone,
  PlusCircle,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type Language = "en" | "da";
type PostType = "Lost" | "Found";
type SortOption = "newest" | "oldest" | "lost" | "found";
type FooterModal = "about" | "privacy" | "contact" | null;

type Post = {
  id: number | string;
  user_id?: string;
  status?: "open" | "resolved" | "archived" | "deleted";
  saved?: boolean;
  type: PostType;
  title: string;
  city: string;
  category: string;
  date: string;
  description: string;
  contact: string;
  location?: string;
  resolved: boolean;
  image?: string;
  images?: string[];
  manageCode?: string;
};

type Message = {
  id: string;
  post_id: string;
  sender_name?: string | null;
  sender_email: string;
  message: string;
  created_at: string;
  posts?: {
    title: string;
  };
};

type FormState = {
  type: PostType;
  title: string;
  city: string;
  customCity: string;
  category: string;
  date: string;
  description: string;
  contact: string;
  location: string;
  image: string;
  images: string[];
  manageCode: string;
};

const translations = {
  en: {
    tagline: "A simple community lost & found board for Denmark",
    postItem: "Create post",
    languageBadge: "English · Danish friendly",
    heroTitle: "Lost something in Denmark? Let the community help.",
    heroText: "Post or find lost items across Denmark by city, category, date, and location.",
    cityBoards: "City boards",
    cityBoardsText: "Copenhagen, Aarhus, Odense and more",
    safetyFirst: "Safety first",
    safetyFirstText: "No public phone numbers required",
    easyPosting: "Easy posting",
    easyPostingText: "Submit in under one minute",
    examplePost: "Example post",
    exampleTitle: "Found: Student card near Aalborg University",
    exampleText: "A student ID card was found near campus. Owner should describe the card before pickup.",
    browsePosts: "Browse posts",
    results: "result(s)",
    searchPlaceholder: "Search item, place, keyword...",
    contactPoster: "Contact owner/poster",
    contactInfo: "Contact poster",
    postDetails: "Post details",
    contactFormName: "Your name",
    contactFormEmail: "Your email",
    contactFormMessage: "Message to poster",
    sendMessage: "Send message",
    messageSent: "Message sent!",
    messageSentHelp: "Your message has been delivered. The poster can reply to you by email.",
    contactPrivacy: "The poster's email is hidden. Messages are sent through the website.",
    close: "Close",
    formTitle: "Post a lost or found item",
    formHelp: "Create a post with details, location and photos. Your post will be stored securely in the cloud.",
    missingFields: "Please fill in title and description.",
    contactMissingFields: "Please fill in your email and message.",
    postedSuccessfully: "Posted successfully!",
    postedHelp: "Your post is now visible at the top of the list.",
    titlePlaceholder: "Title",
    locationPlaceholder: "Exact location",
    emailPlaceholder: "Email contact",
    descPlaceholder: "Description: where, when, what it looks like...",
    imageUploadTitle: "Upload images",
    imageUploadHelp: "Upload up to 3 clear photos to help others identify the item.",
    imageUrlPlaceholder: "Paste image URL",
    officialReminder: "Important items like passports, ID cards and bank cards should also be reported to Danish police (114).",
    privacyReminder: "Privacy reminder: do not post CPR numbers, passport numbers, bank card numbers or other sensitive personal information.",
    submit: "Submit post",
    submitting: "Submitting...",
    sending: "Sending...",
    saving: "Saving...",
    copyEmail: "Copy email",
    emailCopied: "Email copied",
    footerOfficial: "For official police matters in Denmark, call 114.",
    allCities: "All cities",
    allCategories: "All categories",
    lost: "Lost",
    found: "Found",
    resolved: "Resolved",
    showResolved: "Show resolved",
    hideResolved: "Hide resolved",
    showArchived: "Show archived",
    hideArchived: "Hide archived",
    archived: "Archived",
    archivedAfter: "Posts older than 90 days are archived automatically.",
    writeCityName: "Write city name",
    cityLabel: "City",
    locationLabel: "Location",
    dateLabel: "Date",
    categoryLabel: "Category",
    managePost: "Manage post",
    markResolved: "Mark as resolved",
    reopenPost: "Reopen post",
    manageCodePlaceholder: "Manage code, for example 1234",
    manageCodeHelp: "Use this code later to mark the post as resolved or reopen it.",
    wrongManageCode: "Wrong manage code.",
    savedLocally: "Posts are securely stored in the cloud and synced across devices.",
    chooseImage: "Choose images",
    imageCount: "Up to 3 images",
    nextImage: "Next",
    previousImage: "Previous",
    managePostTitle: "Manage post",
    managePostHelp: "Enter the manage code you created when posting.",
    manageOwnerHelp: "You are signed in as the owner of this post. You can edit, resolve or delete it.",
    ownerOnlyAction: "Only the owner of this post can manage it.",
    confirm: "Confirm",
    editPost: "Edit post",
    saveChanges: "Save changes",
    editedSuccessfully: "Post updated",
    editedHelp: "Your changes have been saved securely in the cloud.",
    deletePost: "Delete post",
    confirmDeleteTitle: "Delete this post?",
    confirmDeleteButton: "Yes, delete permanently",
    confirmDeleteHelp: "This cannot be undone in this prototype.",
    cancel: "Cancel",
    deletedSuccessfully: "Post deleted",
    deletedHelp: "The post has been removed from the public board.",
    reportPost: "Report post",
    reportTitle: "Report this post",
    reportReason: "Reason for report",
    reportHelp: "Thank you. Reports can be reviewed by moderators to keep the community safe.",
    reportSent: "Report sent",
    reportMissingReason: "Please enter a reason for the report.",
    savePost: "Save post",
    savedPost: "Saved",
    showSavedOnly: "Show saved only",
    showAllPosts: "Show all posts",
    myPosts: "My posts",
    noResults: "No matching posts found",
    noResultsHelp: "Try another city, category or keyword.",
    clearFilters: "Clear filters",
    totalPosts: "Total posts",
    resolvedPosts: "Resolved posts",
    activeCities: "Cities",
    recentlyPosted: "Recently posted",
    today: "today",
    yesterday: "yesterday",
    daysAgo: "days ago",
    openImage: "Open image",
    popularCategories: "Popular categories",
    sortNewest: "Newest first",
    sortOldest: "Oldest first",
    sortLost: "Lost first",
    sortFound: "Found first",
    relatedPosts: "Related posts",
    fallbackRelated: "Similar posts are limited, so here are some recent posts you may want to check.",
    posts: "posts",
    about: "About",
    privacyPolicy: "Privacy Policy",
    contact: "Contact",
    aboutTitle: "About LostFoundDK",
    aboutText: "LostFoundDK is a community lost and found board for Denmark. It helps people post and find lost items by city, category, date and location.",
    privacyTitle: "Privacy Policy",
    privacyText: "Posters\' email addresses are not shown publicly. Messages are sent through the website. Please do not post CPR numbers, passport numbers, bank card numbers or other sensitive personal information.",
    contactTitle: "Contact",
    contactText: "For questions or feedback, contact us at:",
    contactEmail: "contact@lostfounddk.com",
  },
  da: {
    tagline: "En simpel fælles opslagstavle for hittegods i Danmark",
    postItem: "Opret opslag",
    languageBadge: "Engelsk · Dansk venlig",
    heroTitle: "Har du mistet noget i Danmark? Lad fællesskabet hjælpe.",
    heroText: "Opret eller find mistede genstande i hele Danmark efter by, kategori, dato og sted.",
    cityBoards: "Byopslag",
    cityBoardsText: "København, Aarhus, Odense og flere",
    safetyFirst: "Sikkerhed først",
    safetyFirstText: "Offentlige telefonnumre er ikke nødvendige",
    easyPosting: "Nemt opslag",
    easyPostingText: "Opret et opslag på under ét minut",
    examplePost: "Eksempel på opslag",
    exampleTitle: "Fundet: Studiekort nær Aalborg Universitet",
    exampleText: "Et studiekort blev fundet nær campus. Ejeren bør kunne beskrive kortet før afhentning.",
    browsePosts: "Se opslag",
    results: "resultat(er)",
    searchPlaceholder: "Søg efter ting, sted, nøgleord...",
    contactPoster: "Kontakt ejer/opretter",
    contactInfo: "Kontakt opretter",
    postDetails: "Opslagsdetaljer",
    contactFormName: "Dit navn",
    contactFormEmail: "Din e-mail",
    contactFormMessage: "Besked til opretteren",
    sendMessage: "Send besked",
    messageSent: "Beskeden er sendt!",
    messageSentHelp: "Din besked er sendt. Opretteren kan svare dig via e-mail.",
    contactPrivacy: "Opretterens e-mail er skjult. Beskeder sendes gennem hjemmesiden.",
    close: "Luk",
    formTitle: "Opret et opslag om mistet eller fundet ting",
    formHelp: "Opret et opslag med detaljer, placering og billeder. Dit opslag gemmes sikkert i skyen.",
    missingFields: "Udfyld venligst titel og beskrivelse.",
    contactMissingFields: "Udfyld venligst din e-mail og besked.",
    postedSuccessfully: "Opslaget er oprettet!",
    postedHelp: "Dit opslag er nu synligt øverst på listen.",
    titlePlaceholder: "Titel",
    locationPlaceholder: "Præcis placering",
    emailPlaceholder: "E-mail kontakt",
    descPlaceholder: "Beskrivelse: hvor, hvornår, hvordan det ser ud...",
    imageUploadTitle: "Upload billeder",
    imageUploadHelp: "Upload op til 3 tydelige billeder, så andre lettere kan genkende genstanden.",
    imageUrlPlaceholder: "Indsæt billede-link",
    officialReminder: "Vigtige genstande som pas, ID-kort og bankkort bør også anmeldes til dansk politi (114).",
    privacyReminder: "Privatlivspåmindelse: skriv ikke CPR-numre, pasnumre, kortnumre eller andre følsomme personoplysninger.",
    submit: "Opret opslag",
    submitting: "Opretter...",
    sending: "Sender...",
    saving: "Gemmer...",
    copyEmail: "Kopiér e-mail",
    emailCopied: "E-mail kopieret",
    footerOfficial: "For officielle politisager i Danmark, ring 114.",
    allCities: "Alle byer",
    allCategories: "Alle kategorier",
    lost: "Mistet",
    found: "Fundet",
    resolved: "Løst",
    showResolved: "Vis løste",
    hideResolved: "Skjul løste",
    showArchived: "Vis arkiverede",
    hideArchived: "Skjul arkiverede",
    archived: "Arkiveret",
    archivedAfter: "Opslag ældre end 90 dage arkiveres automatisk.",
    writeCityName: "Skriv bynavn",
    cityLabel: "By",
    locationLabel: "Placering",
    dateLabel: "Dato",
    categoryLabel: "Kategori",
    managePost: "Administrer opslag",
    markResolved: "Markér som løst",
    reopenPost: "Genåbn opslag",
    manageCodePlaceholder: "Administrationskode, fx 1234",
    manageCodeHelp: "Brug denne kode senere til at markere opslaget som løst eller genåbne det.",
    wrongManageCode: "Forkert administrationskode.",
    savedLocally: "Opslag gemmes sikkert i skyen og synkroniseres på tværs af enheder.",
    chooseImage: "Vælg billeder",
    imageCount: "Op til 3 billeder",
    nextImage: "Næste",
    previousImage: "Forrige",
    managePostTitle: "Administrer opslag",
    managePostHelp: "Indtast administrationskoden, du oprettede ved opslaget.",
    manageOwnerHelp: "Du er logget ind som ejeren af dette opslag. Du kan redigere, løse eller slette det.",
    ownerOnlyAction: "Kun ejeren af dette opslag kan administrere det.",
    confirm: "Bekræft",
    editPost: "Rediger opslag",
    saveChanges: "Gem ændringer",
    editedSuccessfully: "Opslaget er opdateret",
    editedHelp: "Dine ændringer er gemt sikkert i skyen.",
    deletePost: "Slet opslag",
    confirmDeleteTitle: "Slet dette opslag?",
    confirmDeleteButton: "Ja, slet permanent",
    confirmDeleteHelp: "Dette kan ikke fortrydes i denne prototype.",
    cancel: "Annuller",
    deletedSuccessfully: "Opslaget er slettet",
    deletedHelp: "Opslaget er fjernet fra den offentlige opslagstavle.",
    reportPost: "Anmeld opslag",
    reportTitle: "Anmeld dette opslag",
    reportReason: "Årsag til anmeldelse",
    reportHelp: "Tak. Anmeldelser kan gennemgås af moderatorer for at holde fællesskabet sikkert.",
    reportSent: "Anmeldelse sendt",
    reportMissingReason: "Indtast venligst en årsag til anmeldelsen.",
    savePost: "Gem opslag",
    savedPost: "Gemt",
    showSavedOnly: "Vis kun gemte",
    showAllPosts: "Vis alle opslag",
    myPosts: "Mine opslag",
    noResults: "Ingen matchende opslag fundet",
    noResultsHelp: "Prøv en anden by, kategori eller søgning.",
    clearFilters: "Nulstil filtre",
    totalPosts: "Opslag i alt",
    resolvedPosts: "Løste opslag",
    activeCities: "Byer",
    recentlyPosted: "Senest oprettet",
    today: "i dag",
    yesterday: "i går",
    daysAgo: "dage siden",
    openImage: "Åbn billede",
    popularCategories: "Populære kategorier",
    sortNewest: "Nyeste først",
    sortOldest: "Ældste først",
    sortLost: "Mistede først",
    sortFound: "Fundne først",
    relatedPosts: "Relaterede opslag",
    fallbackRelated: "Der er få lignende opslag, så her er nogle nyere opslag, du måske vil tjekke.",
    posts: "opslag",
    about: "Om",
    privacyPolicy: "Privatlivspolitik",
    contact: "Kontakt",
    aboutTitle: "Om LostFoundDK",
    aboutText: "LostFoundDK er en fælles opslagstavle for mistede og fundne genstande i Danmark. Den hjælper folk med at oprette og finde opslag efter by, kategori, dato og sted.",
    privacyTitle: "Privatlivspolitik",
    privacyText: "Opretternes e-mailadresser vises ikke offentligt. Beskeder sendes gennem hjemmesiden. Skriv ikke CPR-numre, pasnumre, kortnumre eller andre følsomme personoplysninger.",
    contactTitle: "Kontakt",
    contactText: "Har du spørgsmål eller feedback, kan du kontakte os på:",
    contactEmail: "contact@lostfounddk.com",
  },
} as const;

const categories = [
  "Wallet",
  "Keys",
  "Phone",
  "Bag",
  "Passport",
  "ID card",
  "Student card",
  "Bank card",
  "Documents",
  "Bike",
  "Electronics",
  "Clothing",
  "Jewelry",
  "Other",
];

const cities = [
  "Aabenraa",
  "Aalborg",
  "Aarhus",
  "Copenhagen",
  "Esbjerg",
  "Fredericia",
  "Frederiksberg",
  "Frederikshavn",
  "Haderslev",
  "Helsingør",
  "Herning",
  "Hillerød",
  "Hjørring",
  "Holstebro",
  "Horsens",
  "Kolding",
  "Køge",
  "Middelfart",
  "Næstved",
  "Nyborg",
  "Odense",
  "Randers",
  "Ringsted",
  "Roskilde",
  "Silkeborg",
  "Skive",
  "Slagelse",
  "Sønderborg",
  "Svendborg",
  "Taastrup",
  "Vejle",
  "Viborg",
  "Other / Anden by",
];

const STORAGE_KEY = "lost-and-found-dk-posts-v1";
const ARCHIVE_AFTER_DAYS = 90;

const samplePosts: Post[] = [
  {
    id: 1,
    type: "Lost",
    title: "Black wallet lost near Nørreport Station",
    city: "Copenhagen",
    category: "Wallet",
    date: "2026-05-20",
    description: "Small black leather wallet with cards inside. Lost around the metro entrance.",
    contact: "dao@example.com",
    location: "Nørreport Metro",
    resolved: false,
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
    ],
    manageCode: "1234",
  },
  {
    id: 2,
    type: "Found",
    title: "Keys found in Aarhus C",
    city: "Aarhus",
    category: "Keys",
    date: "2026-05-21",
    description: "A set of keys with a blue keychain found near the bus stop.",
    contact: "founder@example.com",
    location: "Aarhus Central Station",
    resolved: false,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop"],
    manageCode: "1234",
  },
  {
    id: 3,
    type: "Lost",
    title: "Backpack lost on train to Aalborg",
    city: "Aalborg",
    category: "Bag",
    date: "2026-01-10",
    description: "Dark green backpack with laptop charger and notebooks inside.",
    contact: "student@example.com",
    location: "Train IC 414",
    resolved: true,
    image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=1200&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=1200&auto=format&fit=crop"],
    manageCode: "1234",
  },
];

const emptyForm: FormState = {
  type: "Lost",
  title: "",
  city: "Copenhagen",
  customCity: "",
  category: "Other",
  date: "",
  description: "",
  contact: "",
  location: "",
  image: "",
  images: [],
  manageCode: "",
};

function normalizePost(post: Post): Post {
  const images = post.images?.length ? post.images : post.image ? [post.image] : [];
  return {
    ...post,
    image: post.image || images[0],
    images,
    manageCode: post.manageCode || "1234",
    resolved: Boolean(post.resolved),
    saved: Boolean(post.saved),
  };
}

function mapSupabasePost(row: any): Post {
  const imageRows = Array.isArray(row.post_images) ? row.post_images : [];
  const images = imageRows
    .map((imageRow: any) => imageRow.image_url)
    .filter(Boolean);

  const primaryImage = images[0];

  return {
    id: row.id,
    user_id: row.user_id || undefined,
    status: row.status || "open",
    type: row.type,
    title: row.title,
    city: row.city,
    category: row.category,
    date: row.created_at ? String(row.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10),
    description: row.description,
    contact: row.contact_email || "",
    location: row.location || "",
    resolved: row.status === "resolved",
    image: primaryImage,
    images,
    manageCode: row.manage_token_hash || "auth-owner",
  };
}

function daysBetween(dateString: string, now = new Date()) {
  const postDate = new Date(`${dateString}T00:00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
}

function isArchived(post: Post, now = new Date()) {
  return daysBetween(post.date, now) > ARCHIVE_AFTER_DAYS;
}

function sortPosts(postsToSort: Post[], sortBy: SortOption) {
  const sortedPosts = [...postsToSort];
  switch (sortBy) {
    case "oldest":
      return sortedPosts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case "lost":
      return sortedPosts.sort((a, b) => (a.type === b.type ? new Date(b.date).getTime() - new Date(a.date).getTime() : a.type === "Lost" ? -1 : 1));
    case "found":
      return sortedPosts.sort((a, b) => (a.type === b.type ? new Date(b.date).getTime() - new Date(a.date).getTime() : a.type === "Found" ? -1 : 1));
    case "newest":
    default:
      return sortedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

function filterPosts(
  postsToFilter: Post[],
  filters: { city: string; category: string; query: string; showResolved: boolean; showArchived: boolean; showSavedOnly: boolean }
) {
  const { city, category, query, showResolved, showArchived, showSavedOnly } = filters;
  return postsToFilter.filter((post) => {
    if (post.status === "deleted") return false;
    const searchText = `${post.title} ${post.description} ${post.city} ${post.category} ${post.location || ""}`.toLowerCase();
    return (
      (city === "All cities" || post.city === city) &&
      (category === "All categories" || post.category === category) &&
      searchText.includes(query.toLowerCase()) &&
      (showResolved || !post.resolved) &&
      (showArchived || !isArchived(post)) &&
      (!showSavedOnly || Boolean(post.saved))
    );
  });
}

function formatRelativeDate(dateString: string, t: (typeof translations)[Language]) {
  const days = daysBetween(dateString);
  if (days <= 0) return t.today;
  if (days === 1) return t.yesterday;
  return `${days} ${t.daysAgo}`;
}

function getRelatedPosts(posts: Post[], selectedPost: Post | null) {
  if (!selectedPost) return { strict: [] as Post[], fallback: [] as Post[], related: [] as Post[] };

  const strict = posts
    .filter((post) => {
      if (post.id === selectedPost.id) return false;
      if (post.status === "deleted") return false;
      const sameCity = post.city === selectedPost.city;
      const sameCategory = post.category === selectedPost.category;
      const selectedWords = `${selectedPost.title} ${selectedPost.description}`
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 3);
      const postText = `${post.title} ${post.description}`.toLowerCase();
      const hasSimilarKeyword = selectedWords.some((word) => postText.includes(word));
      return sameCity || sameCategory || hasSimilarKeyword;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const fallback = posts
    .filter((post) => post.id !== selectedPost.id && post.status !== "deleted")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return { strict, fallback, related: strict.length > 0 ? strict : fallback };
}

function runSelfTests() {
  const englishKeys = Object.keys(translations.en);
  const danishKeys = Object.keys(translations.da);
  const missingDaKeys = englishKeys.filter((key) => !danishKeys.includes(key));

console.assert(
  missingDaKeys.length === 0,
  "Danish translations missing keys:",
  missingDaKeys
);
  console.assert(cities[cities.length - 1] === "Other / Anden by", "Other city option should stay last.");
  console.assert(filterPosts(samplePosts, { city: "All cities", category: "All categories", query: "", showResolved: false, showArchived: true, showSavedOnly: false }).every((post) => !post.resolved), "Resolved posts should hide correctly.");
  console.assert(filterPosts([{ ...samplePosts[0], date: "2025-01-01" }], { city: "All cities", category: "All categories", query: "", showResolved: true, showArchived: false, showSavedOnly: false }).length === 0, "Archived posts should hide correctly.");
  console.assert(sortPosts(samplePosts, "newest")[0].date >= sortPosts(samplePosts, "newest")[1].date, "Newest sorting should work.");
  console.assert(getRelatedPosts(samplePosts, samplePosts[0]).related.length > 0, "Related posts should fall back to recent posts.");
}

try {
  runSelfTests();
} catch (error) {
  console.warn("Self tests skipped:", error);
}

export default function LostAndFoundDK() {
  const [lang, setLang] = useState<Language>("en");
  const t = translations[lang];
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const savedPosts = window.localStorage.getItem(STORAGE_KEY);
      return savedPosts ? JSON.parse(savedPosts).map(normalizePost) : samplePosts.map(normalizePost);
    } catch {
      return samplePosts.map(normalizePost);
    }
  });
  const [city, setCity] = useState("All cities");
  const [category, setCategory] = useState("All categories");
  const [query, setQuery] = useState("");
  const [showResolved, setShowResolved] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showMyPostsOnly, setShowMyPostsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactError, setContactError] = useState("");
  const [showMessageSent, setShowMessageSent] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMessages, setShowMessages] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successHelp, setSuccessHelp] = useState("");
  const [manageTarget, setManageTarget] = useState<Post | null>(null);
  const [manageCodeInput, setManageCodeInput] = useState("");
  const [manageError, setManageError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(false);
  const [reportTarget, setReportTarget] = useState<Post | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportError, setReportError] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [editError, setEditError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [sendingLogin, setSendingLogin] = useState(false);
  const [loginCooldown, setLoginCooldown] = useState(0);
  const [showPostForm, setShowPostForm] = useState(false);
  const [footerModal, setFooterModal] = useState<FooterModal>(null);
  const [submittingPost, setSubmittingPost] = useState(false);
  const [sendingContactMessage, setSendingContactMessage] = useState(false);
  const [savingEditedPost, setSavingEditedPost] = useState(false);

  const cityOptions = ["All cities", ...cities];
  const categoryOptions = ["All categories", ...categories];
  const filteredPosts = useMemo(() => {
    const basePosts = showMyPostsOnly && user
      ? posts.filter((post) => post.user_id === user.id)
      : posts;

    return sortPosts(
      filterPosts(basePosts, { city, category, query, showResolved, showArchived, showSavedOnly }),
      sortBy
    );
  }, [posts, city, category, query, showResolved, showArchived, showSavedOnly, sortBy, showMyPostsOnly, user]);
  const totalPosts = posts.length;
  const resolvedPosts = posts.filter((post) => post.resolved).length;
  const activeCities = new Set(posts.map((post) => post.city)).size;
  const categoryCounts = categories
    .map((categoryName) => ({ name: categoryName, count: posts.filter((post) => post.category === categoryName).length }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const { strict: strictRelatedPosts, related: relatedPosts } = getRelatedPosts(posts, selectedPost);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // LocalStorage can fail in restricted preview environments.
    }
  }, [posts]);

  useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);

  useEffect(() => {
  async function loadPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*, post_images(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load posts:", error);
      return;
    }

    setPosts((data || []).map(mapSupabasePost));
  }

  loadPosts();
}, []);

  useEffect(() => {
  async function loadMessages() {
    if (!user) {
      setMessages([]);
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*, posts(title)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load messages:", error);
      return;
    }

    setMessages(data || []);
  }

  loadMessages();
}, [user]);

  function labelType(type: PostType) {
    return type === "Lost" ? t.lost : t.found;
  }

  async function sendMagicLink() {
  if (sendingLogin || loginCooldown > 0) return;

  console.log("Login clicked", loginEmail);

  if (!loginEmail.trim()) {
    setLoginMessage("Please enter your email.");
    return;
  }

  setSendingLogin(true);

  const { error } = await supabase.auth.signInWithOtp({
    email: loginEmail.trim(),
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  setSendingLogin(false);

  if (error) {
    console.error("Magic link error:", error);
    setLoginMessage("Could not send login link. Check console.");
    return;
  }

  setLoginMessage("Login link sent. Please check your email.");
  setLoginCooldown(60);

  const interval = window.setInterval(() => {
    setLoginCooldown((prev) => {
      if (prev <= 1) {
        window.clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
}

async function logout() {
  await supabase.auth.signOut();
  setLoginMessage("");
}

  function labelOption(option: string) {
    if (option === "All cities") return t.allCities;
    if (option === "All categories") return t.allCategories;
    return option;
  }

  function isOwner(post: Post | null) {
    return Boolean(user && post?.user_id && post.user_id === user.id);
  }

  function showOwnerOnlyMessage() {
    setSuccessTitle(t.ownerOnlyAction);
    setSuccessHelp("Please login with the email that created this post.");
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 3000);
  }

  function openPost(post: Post) {
    setSelectedPost(post);
    setSelectedImageIndex(0);
    setContactError("");
    setShowMessageSent(false);
  }

  function resetFilters() {
    setCity("All cities");
    setCategory("All categories");
    setQuery("");
    setShowResolved(true);
    setShowArchived(false);
    setShowSavedOnly(false);
    setShowMyPostsOnly(false);
    setSortBy("newest");
  }

  function toggleSaved(postId: number | string) {
    setPosts((currentPosts) => currentPosts.map((post) => (post.id === postId ? { ...post, saved: !post.saved } : post)));
    setSelectedPost((currentPost) => (currentPost && currentPost.id === postId ? { ...currentPost, saved: !currentPost.saved } : currentPost));
  }

  async function handleSendContactMessage() {
  if (!selectedPost || sendingContactMessage) return;

  if (!contactForm.email.trim() || !contactForm.message.trim()) {
    setContactError(t.contactMissingFields);
    return;
  }

  setSendingContactMessage(true);

  const { error } = await supabase.from("messages").insert({
    post_id: selectedPost.id,
    sender_name: contactForm.name.trim() || null,
    sender_email: contactForm.email.trim(),
    message: contactForm.message.trim(),
  });

  setSendingContactMessage(false);

  if (error) {
    console.error("Failed to send message:", error);
    setContactError("Failed to send message. Please try again.");
    return;
  }

  setContactError("");
  setShowMessageSent(true);
  setContactForm({ name: "", email: "", message: "" });
  window.setTimeout(() => setShowMessageSent(false), 3000);
}

  function openReportDialog(post: Post) {
    setReportTarget(post);
    setReportReason("");
    setReportError("");
  }

  function submitReport() {
    if (!reportTarget) return;
    if (!reportReason.trim()) {
      setReportError(t.reportMissingReason);
      return;
    }
    setReportTarget(null);
    setReportReason("");
    setReportError("");
    setSuccessTitle(t.reportSent);
    setSuccessHelp(t.reportHelp);
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 3000);
  }

  function openManageDialog(post: Post) {
    if (!isOwner(post)) {
      showOwnerOnlyMessage();
      return;
    }

    setManageTarget(post);
    setManageCodeInput("");
    setManageError("");
    setPendingDelete(false);
  }

  async function confirmToggleResolved() {
    if (!manageTarget) return;
    if (!isOwner(manageTarget)) {
      showOwnerOnlyMessage();
      return;
    }

    const nextResolved = !manageTarget.resolved;
    const nextStatus = nextResolved ? "resolved" : "open";

    const { error } = await supabase
      .from("posts")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", manageTarget.id)
      .eq("user_id", user!.id);

    if (error) {
      console.error("Failed to update post status:", error);
      alert("Failed to update post. Check console.");
      return;
    }

    setPosts((currentPosts) => currentPosts.map((post) => (post.id === manageTarget.id ? { ...post, resolved: nextResolved, status: nextStatus } : post)));
    setSelectedPost((currentPost) => (currentPost && currentPost.id === manageTarget.id ? { ...currentPost, resolved: nextResolved, status: nextStatus } : currentPost));
    setManageTarget(null);
  }

  function openEditPost() {
    if (!manageTarget) return;
    if (!isOwner(manageTarget)) {
      showOwnerOnlyMessage();
      return;
    }

    setEditingPost(manageTarget);
    setEditForm({
      type: manageTarget.type,
      title: manageTarget.title,
      city: cities.includes(manageTarget.city) ? manageTarget.city : "Other / Anden by",
      customCity: cities.includes(manageTarget.city) ? "" : manageTarget.city,
      category: manageTarget.category,
      date: manageTarget.date,
      description: manageTarget.description,
      contact: manageTarget.contact,
      location: manageTarget.location || "",
      image: manageTarget.image || "",
      images: manageTarget.images || (manageTarget.image ? [manageTarget.image] : []),
      manageCode: manageTarget.manageCode || "auth-owner",
    });
    setEditError("");
    setManageTarget(null);
    setPendingDelete(false);
  }

  function handleFiles(files: File[], setter: React.Dispatch<React.SetStateAction<FormState>>) {
    const selectedFiles = files.slice(0, 3);
    if (!selectedFiles.length) return;
    Promise.all(
      selectedFiles.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
            reader.readAsDataURL(file);
          })
      )
    ).then((images) => {
      setter((currentForm) => ({ ...currentForm, images, image: images[0] || currentForm.image }));
    });
  }

  async function saveEditedPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingPost || savingEditedPost) return;
    if (!editForm.title.trim() || !editForm.description.trim() || !editForm.contact.trim()) {
      setEditError(t.missingFields);
      return;
    }

    if (!isOwner(editingPost)) {
      showOwnerOnlyMessage();
      return;
    }

    setSavingEditedPost(true);

    const finalCity = editForm.city === "Other / Anden by" && editForm.customCity.trim() ? editForm.customCity.trim() : editForm.city;
    const images = editForm.images.length ? editForm.images : editForm.image ? [editForm.image] : [];
    const uploadedImageUrls: string[] = [];

    for (const image of images.slice(0, 3)) {
      if (image.startsWith("data:")) {
        const response = await fetch(image);
        const blob = await response.blob();
        const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(filePath, blob, {
            contentType: blob.type || "image/jpeg",
            upsert: false,
          });

        if (uploadError) {
          console.error("Failed to upload edited image:", uploadError);
          alert("Failed to upload image. Check console.");
          setSavingEditedPost(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(filePath);

        uploadedImageUrls.push(publicUrlData.publicUrl);
      } else if (image) {
        uploadedImageUrls.push(image);
      }
    }

    const updatedPost: Post = {
      ...editingPost,
      title: editForm.title.trim(),
      city: finalCity,
      category: editForm.category,
      description: editForm.description.trim(),
      contact: editForm.contact.trim(),
      location: editForm.location.trim(),
      image: uploadedImageUrls[0],
      images: uploadedImageUrls,
    };

    const { error } = await supabase
      .from("posts")
      .update({
        title: updatedPost.title,
        city: updatedPost.city,
        category: updatedPost.category,
        description: updatedPost.description,
        contact_email: updatedPost.contact,
        location: updatedPost.location,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingPost.id)
      .eq("user_id", user!.id);

    if (error) {
      console.error("Failed to edit post:", error);
      alert("Failed to edit post. Check console.");
      setSavingEditedPost(false);
      return;
    }

    const { error: deleteImagesError } = await supabase
      .from("post_images")
      .delete()
      .eq("post_id", editingPost.id);

    if (deleteImagesError) {
      console.error("Failed to remove old post images:", deleteImagesError);
      alert("Post was updated, but old images could not be replaced. Check console.");
      setSavingEditedPost(false);
      return;
    }

    if (uploadedImageUrls.length > 0) {
      const { error: imageInsertError } = await supabase.from("post_images").insert(
        uploadedImageUrls.map((imageUrl, index) => ({
          post_id: editingPost.id,
          image_url: imageUrl,
          sort_order: index,
        }))
      );

      if (imageInsertError) {
        console.error("Failed to save edited post images:", imageInsertError);
        alert("Post was updated, but images failed. Check console.");
        setSavingEditedPost(false);
        return;
      }
    }

    setSavingEditedPost(false);
    setPosts((currentPosts) => currentPosts.map((post) => (post.id === editingPost.id ? updatedPost : post)));
    setSelectedPost((currentPost) => (currentPost && currentPost.id === editingPost.id ? updatedPost : currentPost));
    setEditingPost(null);
    setSuccessTitle(t.editedSuccessfully);
    setSuccessHelp(t.editedHelp);
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 3000);
  }

  async function confirmDeletePost() {
    if (!manageTarget) return;
    if (!isOwner(manageTarget)) {
      showOwnerOnlyMessage();
      return;
    }

    if (!pendingDelete) {
      setPendingDelete(true);
      setManageError("");
      return;
    }

    const { error } = await supabase
      .from("posts")
      .update({ status: "deleted", updated_at: new Date().toISOString() })
      .eq("id", manageTarget.id)
      .eq("user_id", user!.id);

    if (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post. Check console.");
      return;
    }

    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== manageTarget.id));
    setSelectedPost((currentPost) => (currentPost && currentPost.id === manageTarget.id ? null : currentPost));
    setManageTarget(null);
    setPendingDelete(false);
    setSuccessTitle(t.deletedSuccessfully);
    setSuccessHelp(t.deletedHelp);
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 3000);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingPost) return;
    if (!form.title.trim() || !form.description.trim()) {
      setFormError(t.missingFields);
      return;
    }
    if (!user) {
  setFormError("Please login with your email before posting.");
  return;
}
    setSubmittingPost(true);
    const finalCity = form.city === "Other / Anden by" && form.customCity.trim() ? form.customCity.trim() : form.city;
    const images = form.images.length ? form.images : form.image ? [form.image] : [];
    const uploadedImageUrls: string[] = [];

for (const image of images.slice(0, 3)) {
  if (image.startsWith("data:")) {
    const response = await fetch(image);
    const blob = await response.blob();

    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, blob, {
        contentType: blob.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Failed to upload image:", uploadError);
      alert("Failed to upload image. Check console.");
      setSubmittingPost(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);

    uploadedImageUrls.push(publicUrlData.publicUrl);
  } else {
    uploadedImageUrls.push(image);
  }
}
    const newPost: Post = {
      id: Date.now(),
      user_id: user.id,
      type: form.type,
      title: form.title.trim(),
      city: finalCity,
      category: form.category,
      date: form.date || new Date().toISOString().slice(0, 10),
      description: form.description.trim(),
      contact: user.email || "",
      location: form.location.trim(),
      resolved: false,
      image: uploadedImageUrls[0],
      images: uploadedImageUrls,
      manageCode: form.manageCode.trim() || "auth-owner",
    };
    
    const { data: insertedPost, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        type: newPost.type,
        title: newPost.title,
        description: newPost.description,
        city: newPost.city,
        location: newPost.location,
        category: newPost.category,
        contact_email: user.email || newPost.contact,
        status: "open",
        manage_token_hash: newPost.manageCode,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save post:", error);
      alert("Failed to save post. Check console.");
      setSubmittingPost(false);
      return;
    }

    const savedPost: Post = { ...newPost, id: insertedPost.id, user_id: user.id, status: "open" };

    if (uploadedImageUrls.length > 0) {
      const { error: imageInsertError } = await supabase.from("post_images").insert(
        uploadedImageUrls.map((imageUrl, index) => ({
          post_id: insertedPost.id,
          image_url: imageUrl,
          sort_order: index,
        }))
      );

      if (imageInsertError) {
        console.error("Failed to save post images:", imageInsertError);
      }
    }

    setSubmittingPost(false);
    setPosts([savedPost, ...posts]);
    setForm(emptyForm);
    setFormError("");
    setShowPostForm(false);
    setSuccessTitle(t.postedSuccessfully);
    setSuccessHelp(t.postedHelp);
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 3000);
  }

  const currentSelectedImage = selectedPost?.images?.[selectedImageIndex] || selectedPost?.image;

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex w-full sm:w-auto items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Search size={23} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">LostAndFoundDK</h1>
              <p className="text-xs sm:text-sm text-slate-500">{t.tagline}</p>
            </div>
          </div>
          <div className="flex w-full sm:w-auto flex-wrap items-center gap-2">
            <div className="rounded-xl border border-slate-200 p-1 bg-slate-50 flex shrink-0">
              <button type="button" onClick={() => setLang("en")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${lang === "en" ? "bg-slate-900 text-white" : "text-slate-600"}`}>EN</button>
              <button type="button" onClick={() => setLang("da")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${lang === "da" ? "bg-slate-900 text-white" : "text-slate-600"}`}>DA</button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setLoginMessage("Please login with your email before posting.");
                  return;
                }

                setShowPostForm(true);
              }}
              className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-5 py-3 text-base font-semibold shadow-md hover:bg-blue-700 transition"
            >
              <PlusCircle size={20} /> {t.postItem}
            </button>
            {user ? (
  <div className="flex w-full sm:w-auto flex-wrap items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
    <span className="max-w-[220px] truncate">{user.email}</span>
    <button
  type="button"
  onClick={() => setShowMessages(true)}
  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
>
  Messages ({messages.length})
</button>
    <button type="button" onClick={logout} className="font-semibold hover:underline">
      Logout
    </button>
  </div>
) : (
  <div className="relative flex min-w-0 flex-1 sm:flex-none items-center gap-2">
    <input
      className="min-w-0 flex-1 sm:w-48 rounded-xl border border-slate-200 px-3 py-2 text-sm"
      placeholder="Email login"
      value={loginEmail}
      onChange={(e) => setLoginEmail(e.target.value)}
    />
   
    <button
      type="button"
      onClick={sendMagicLink}
      disabled={sendingLogin || loginCooldown > 0}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {sendingLogin ? "Sending..." : loginCooldown > 0 ? `Wait ${loginCooldown}s` : "Login"}
    </button>

     {loginMessage && (
      <p className="absolute left-0 sm:left-auto sm:right-0 top-12 z-20 whitespace-nowrap rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 shadow-sm">
        {loginMessage}
      </p>
    )}

  </div>
)}
          </div>
        </div>
      </section>
      

      <section className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-600 mb-5">
            <Globe2 size={16} /> {t.languageBadge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">{t.heroTitle}</h2>
          <p className="mt-5 text-lg text-slate-600 leading-8">{t.heroText}</p>
          <button
            type="button"
            onClick={() => {
              if (!user) {
                setLoginMessage("Please login with your email before posting.");
                return;
              }

              setShowPostForm(true);
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 text-white px-6 py-3 text-base font-semibold shadow-md hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} /> {t.postItem}
          </button>
          </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="rounded-2xl bg-slate-100 p-5">
            <p className="text-sm font-semibold text-slate-500 mb-2">{t.examplePost}</p>
            <h3 className="text-xl font-bold">{t.exampleTitle}</h3>
            <p className="text-slate-600 mt-3">{t.exampleText}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-white px-3 py-1 border border-slate-200">Aalborg</span>
              <span className="rounded-full bg-white px-3 py-1 border border-slate-200">Documents</span>
              <span className="rounded-full bg-white px-3 py-1 border border-slate-200">{t.found}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{totalPosts} {t.posts}</span>
            <span className="text-slate-300">·</span>
            <span>{activeCities} {t.activeCities.toLowerCase()}</span>
            <span className="text-slate-300">·</span>
            <span>{resolvedPosts} {t.resolved.toLowerCase()}</span>
            {categoryCounts.slice(0, 4).map((categoryItem) => (
              <button
                key={categoryItem.name}
                type="button"
                onClick={() => setCategory(categoryItem.name)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-white"
              >
                {categoryItem.name} · {categoryItem.count}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-5">
            <h2 className="text-2xl font-bold">{t.browsePosts}</h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Filter size={16} /> {filteredPosts.length} {t.results}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-3 outline-none focus:ring-2 focus:ring-slate-300" placeholder={t.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <select className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-slate-300" value={city} onChange={(e) => setCity(e.target.value)}>
              {cityOptions.map((cityOption) => <option key={cityOption} value={cityOption}>{labelOption(cityOption)}</option>)}
            </select>
            <select className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-slate-300" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categoryOptions.map((categoryOption) => <option key={categoryOption} value={categoryOption}>{labelOption(categoryOption)}</option>)}
            </select>
            <select className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-slate-300" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
              <option value="newest">{t.sortNewest}</option>
              <option value="oldest">{t.sortOldest}</option>
              <option value="lost">{t.sortLost}</option>
              <option value="found">{t.sortFound}</option>
            </select>
            <ToggleButton active={showResolved} onClick={() => setShowResolved(!showResolved)} activeLabel={t.hideResolved} inactiveLabel={t.showResolved} />
            <ToggleButton active={showArchived} onClick={() => setShowArchived(!showArchived)} activeLabel={t.hideArchived} inactiveLabel={t.showArchived} />
            <ToggleButton active={showSavedOnly} onClick={() => setShowSavedOnly(!showSavedOnly)} activeLabel={t.showAllPosts} inactiveLabel={t.showSavedOnly} />
            {user && (
              <button
                type="button"
                onClick={() => setShowMyPostsOnly(!showMyPostsOnly)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                  showMyPostsOnly ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                {showMyPostsOnly ? t.showAllPosts : t.myPosts}
              </button>
            )}
          </div>
          <p className="mb-6 text-sm text-slate-500">{t.archivedAfter}</p>

          {filteredPosts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4">
                <Search size={28} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold">{t.noResults}</h3>
              <p className="mt-2 text-slate-500 max-w-md mx-auto leading-7">{t.noResultsHelp}</p>
              <button type="button" onClick={resetFilters} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-medium hover:bg-slate-700">
                <X size={16} /> {t.clearFilters}
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <article key={post.id} className="rounded-2xl overflow-hidden border border-slate-200 hover:shadow-sm transition bg-white">
                {(post.images?.[0] || post.image) && (
                  <button type="button" onClick={() => openPost(post)} className="block w-full text-left group" aria-label={`Open ${post.title}`}>
                    <img src={post.images?.[0] || post.image} alt={post.title} className="w-full h-44 object-cover transition group-hover:scale-[1.02]" />
                  </button>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${post.type === "Lost" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{labelType(post.type)}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => toggleSaved(post.id)} className={`rounded-full p-2 border ${post.saved ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-white text-slate-500 border-slate-200"}`} aria-label={post.saved ? t.savedPost : t.savePost}>
                        <Bookmark size={16} />
                      </button>
                      <span className="text-sm text-slate-500">{post.date}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => openPost(post)} className="text-left w-full">
                    <h3 className="mt-4 text-lg font-bold leading-snug hover:underline">{post.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-6">{post.description}</p>
                  </button>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                    {post.location && <span className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 border border-blue-100">📍 {post.location}</span>}
                    <span className="rounded-full bg-slate-100 px-3 py-1">{post.city}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">{post.category}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {isArchived(post) && <Badge>{t.archived}</Badge>}
                    {post.saved && <Badge><Bookmark size={16} /> {t.savedPost}</Badge>}
                    {post.resolved && <Badge><CheckCircle2 size={16} /> {t.resolved}</Badge>}
                  </div>
                  <button type="button" onClick={() => openPost(post)} className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-900 hover:underline">
                    <Mail size={16} /> {t.contactPoster}
                  </button>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {isOwner(post) && (
                      <button type="button" onClick={() => openManageDialog(post)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-50">
                        <Pencil size={16} /> {t.managePost}
                      </button>
                    )}
                    <button type="button" onClick={() => openReportDialog(post)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-50">
                      <Flag size={16} /> {t.reportPost}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {showPostForm && (
  <SimpleModal
    title={t.formTitle}
    subtitle={user ? `Posting as ${user.email}` : "Please login with your email before posting."}
    closeLabel={t.close}
    onClose={() => setShowPostForm(false)}
    wide
  >
    {formError && (
      <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm font-medium">
        {formError}
      </div>
    )}
    {submittingPost && (
      <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 px-4 py-3 text-sm font-medium">
        Uploading images and publishing your post...
      </div>
    )}

    <PostForm
      form={form}
      setForm={setForm}
      t={t}
      onSubmit={handleSubmit}
      onImageFiles={(files) => handleFiles(files, setForm)}
      submitLabel={submittingPost ? t.submitting : t.submit}
      disabled={submittingPost}
      hideManageCode
      hideContact
    />
  </SimpleModal>
)}

      {showMessages && (
  <SimpleModal
    title="Messages"
    subtitle={`${messages.length} message(s)`}
    closeLabel={t.close}
    onClose={() => setShowMessages(false)}
    wide
  >
    {messages.length === 0 ? (
      <p className="mt-4 text-sm text-slate-500">No messages yet.</p>
    ) : (
      <div className="mt-5 grid gap-3">
        {messages.map((message) => (
          <div key={message.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              About: <span className="font-medium text-slate-700">{message.posts?.title || "Post"}</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              From: <span className="font-medium text-slate-700">{message.sender_name || "Anonymous"}</span>{" "}
              &lt;{message.sender_email}&gt;
            </p>
            <p className="mt-3 text-slate-800 leading-6">{message.message}</p>
            <p className="mt-3 text-xs text-slate-400">
              {new Date(message.created_at).toLocaleString()}
            </p>
           <button
  type="button"
  onClick={async () => {
    await navigator.clipboard.writeText(message.sender_email);
    alert(t.emailCopied);
  }}
  className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
>
  {t.copyEmail}
</button> 
          </div>
        ))}
      </div>
    )}
  </SimpleModal>
)}

      {showSuccess && <SuccessModal title={successTitle || t.postedSuccessfully} help={successHelp || t.postedHelp} closeLabel={t.close} onClose={() => setShowSuccess(false)} />}
      {reportTarget && (
        <SimpleModal title={t.reportTitle} subtitle={reportTarget.title} closeLabel={t.close} onClose={() => setReportTarget(null)}>
          <textarea className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3 min-h-28 outline-none focus:ring-2 focus:ring-slate-300" placeholder={t.reportReason} value={reportReason} onChange={(e) => { setReportReason(e.target.value); setReportError(""); }} autoFocus />
          {reportError && <p className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{reportError}</p>}
          <button type="button" onClick={submitReport} className="mt-5 w-full rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium hover:bg-slate-700 inline-flex items-center justify-center gap-2">
            <Flag size={16} /> {t.reportPost}
          </button>
        </SimpleModal>
      )}
      {editingPost && (
        <SimpleModal title={t.editPost} subtitle={editingPost.title} closeLabel={t.close} onClose={() => setEditingPost(null)} wide>
          {editError && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm font-medium">{editError}</div>}
          <PostForm
            form={editForm}
            setForm={setEditForm}
            t={t}
            onSubmit={saveEditedPost}
            onImageFiles={(files) => handleFiles(files, setEditForm)}
            submitLabel={savingEditedPost ? t.saving : t.saveChanges}
            disabled={savingEditedPost}
            hideType
            hideDate
            hideManageCode
          />
        </SimpleModal>
      )}
      {manageTarget && (
        <SimpleModal title={t.managePostTitle} subtitle={manageTarget.title} closeLabel={t.close} onClose={() => { setManageTarget(null); setPendingDelete(false); }}>
          <p className="mt-4 text-sm text-slate-600 leading-6">{t.manageOwnerHelp}</p>
          {manageError && <p className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{manageError}</p>}
          {pendingDelete && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm leading-6"><p className="font-semibold">{t.confirmDeleteTitle}</p><p>{t.confirmDeleteHelp}</p></div>}
          <div className="mt-5 grid grid-cols-1 gap-3">
            <button type="button" onClick={openEditPost} className="w-full rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-50 inline-flex items-center justify-center gap-2"><Pencil size={16} /> {t.editPost}</button>
            <button type="button" onClick={confirmToggleResolved} className="w-full rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium hover:bg-slate-700 inline-flex items-center justify-center gap-2"><CheckCircle2 size={16} /> {manageTarget.resolved ? t.reopenPost : t.markResolved}</button>
            <button type="button" onClick={confirmDeletePost} className="w-full rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm font-medium hover:bg-rose-100 inline-flex items-center justify-center gap-2"><Trash2 size={16} /> {pendingDelete ? t.confirmDeleteButton : t.deletePost}</button>
            {pendingDelete && <button type="button" onClick={() => setPendingDelete(false)} className="w-full rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-50">{t.cancel}</button>}
          </div>
        </SimpleModal>
      )}
      {lightboxOpen && selectedPost && currentSelectedImage && (
        <div className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center p-4">
          <button type="button" onClick={() => setLightboxOpen(false)} className="absolute right-4 top-4 rounded-full bg-white/10 text-white p-3 hover:bg-white/20" aria-label={t.close}><X size={24} /></button>
          {(selectedPost.images?.length || 0) > 1 && <ImageNav direction="left" label={t.previousImage} onClick={() => setSelectedImageIndex((current) => current === 0 ? (selectedPost.images?.length || 1) - 1 : current - 1)} />}
          <img src={currentSelectedImage} alt={selectedPost.title} className="max-h-[85vh] max-w-[92vw] object-contain rounded-2xl" />
          {(selectedPost.images?.length || 0) > 1 && <ImageNav direction="right" label={t.nextImage} onClick={() => setSelectedImageIndex((current) => (current + 1) % (selectedPost.images?.length || 1))} />}
        </div>
      )}
      {selectedPost && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {currentSelectedImage && (
              <div className="relative">
                <button type="button" onClick={() => setLightboxOpen(true)} className="block w-full group" aria-label={t.openImage}>
                  <img src={currentSelectedImage} alt={selectedPost.title} className="w-full h-56 sm:h-72 object-cover" />
                  <span className="absolute right-3 bottom-3 rounded-full bg-black/60 text-white px-3 py-2 text-sm inline-flex items-center gap-2 opacity-90 group-hover:opacity-100"><Maximize2 size={15} /> {t.openImage}</span>
                </button>
                {(selectedPost.images?.length || 0) > 1 && (
                  <>
                    <button type="button" onClick={() => setSelectedImageIndex((current) => current === 0 ? (selectedPost.images?.length || 1) - 1 : current - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium shadow">{t.previousImage}</button>
                    <button type="button" onClick={() => setSelectedImageIndex((current) => (current + 1) % (selectedPost.images?.length || 1))} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium shadow">{t.nextImage}</button>
                  </>
                )}
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{t.postDetails}</p>
                  <h3 className="text-2xl font-bold mt-1">{selectedPost.title}</h3>
                </div>
                <button type="button" onClick={() => setSelectedPost(null)} className="rounded-xl p-2 hover:bg-slate-100" aria-label={t.close}><X size={20} /></button>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-500 mb-3">{t.postDetails}</p>
                <div className="space-y-2 text-sm text-slate-700 mb-5">
                  <p><span className="font-medium">{t.cityLabel}:</span> {selectedPost.city}</p>
                  {selectedPost.location && <p><span className="font-medium">{t.locationLabel}:</span> {selectedPost.location}</p>}
                  <p><span className="font-medium">{t.dateLabel}:</span> {selectedPost.date}</p>
                  <p><span className="font-medium">{t.categoryLabel}:</span> {selectedPost.category}</p>
                </div>
                <p className="text-sm text-slate-700 leading-6">{selectedPost.description}</p>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-900">{t.contactPoster}</h4>
                  <p className="mt-1 text-sm text-slate-500">{t.contactPrivacy}</p>
                </div>
                <div className="grid gap-3">
                  <input className="rounded-xl border border-slate-200 px-3 py-3" placeholder={t.contactFormName} value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
                  <input className="rounded-xl border border-slate-200 px-3 py-3" placeholder={t.contactFormEmail} value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                  <textarea className="rounded-xl border border-slate-200 px-3 py-3 min-h-28" placeholder={t.contactFormMessage} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
                </div>
                {contactError && <p className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{contactError}</p>}
                {showMessageSent && <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-2 text-sm"><p className="font-medium">{t.messageSent}</p><p className="mt-1">{t.messageSentHelp}</p></div>}
                <button type="button" onClick={handleSendContactMessage} disabled={sendingContactMessage} className="mt-4 w-full rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center justify-center gap-2"><Mail size={16} /> {sendingContactMessage ? t.sending : t.sendMessage}</button>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button type="button" onClick={() => toggleSaved(selectedPost.id)} className={`w-full rounded-xl border px-4 py-3 text-sm font-medium inline-flex items-center justify-center gap-2 ${selectedPost.saved ? "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><Bookmark size={18} /> {selectedPost.saved ? t.savedPost : t.savePost}</button>
                {isOwner(selectedPost) && <button type="button" onClick={() => openManageDialog(selectedPost)} className="w-full rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-50 inline-flex items-center justify-center gap-2"><Pencil size={18} /> {t.managePost}</button>}
                <button type="button" onClick={() => openReportDialog(selectedPost)} className="w-full rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-50 inline-flex items-center justify-center gap-2"><Flag size={18} /> {t.reportPost}</button>
              </div>
              <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800 leading-6">{t.privacyReminder}</div>
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800 leading-6">{t.officialReminder}</div>
              {relatedPosts.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4"><Search size={18} className="text-slate-500" /><h4 className="font-bold text-lg">{t.relatedPosts}</h4></div>
                  {strictRelatedPosts.length === 0 && <p className="mb-4 text-sm text-slate-500 leading-6">{t.fallbackRelated}</p>}
                  <div className="grid gap-3">
                    {relatedPosts.map((post) => <MiniPostCard key={post.id} post={post} t={t} labelType={labelType} onClick={() => openPost(post)} />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {footerModal && (
        <SimpleModal
          title={
            footerModal === "about"
              ? t.aboutTitle
              : footerModal === "privacy"
                ? t.privacyTitle
                : t.contactTitle
          }
          closeLabel={t.close}
          onClose={() => setFooterModal(null)}
        >
          {footerModal === "about" && (
            <p className="mt-4 text-slate-600 leading-7">{t.aboutText}</p>
          )}
          {footerModal === "privacy" && (
            <p className="mt-4 text-slate-600 leading-7">{t.privacyText}</p>
          )}
          {footerModal === "contact" && (
            <div className="mt-4 text-slate-600 leading-7">
              <p>{t.contactText}</p>
              <a href={`mailto:${t.contactEmail}`} className="mt-2 inline-flex font-semibold text-slate-900 hover:underline">
                {t.contactEmail}
              </a>
            </div>
          )}
        </SimpleModal>
      )}

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p>© 2026 LostFoundDK. Community prototype.</p>
            <p className="flex items-center gap-2"><Phone size={15} /> {t.footerOfficial}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button type="button" onClick={() => setFooterModal("about")} className="hover:text-slate-900 hover:underline">{t.about}</button>
            <button type="button" onClick={() => setFooterModal("privacy")} className="hover:text-slate-900 hover:underline">{t.privacyPolicy}</button>
            <button type="button" onClick={() => setFooterModal("contact")} className="hover:text-slate-900 hover:underline">{t.contact}</button>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Feature({ title, text }: { icon?: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 leading-5">{text}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="mt-2 text-3xl font-bold">{value}</h3>
    </div>
  );
}

function ToggleButton({ active, onClick, activeLabel, inactiveLabel }: { active: boolean; onClick: () => void; activeLabel: string; inactiveLabel: string }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${active ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-700"}`}>
      {active ? activeLabel : inactiveLabel}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-sm font-medium border border-slate-200">{children}</span>;
}

function MiniPostCard({ post, t, labelType, onClick }: { post: Post; t: (typeof translations)[Language]; labelType: (type: PostType) => string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-left rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition bg-white">
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${post.type === "Lost" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{labelType(post.type)}</span>
        <span className="text-xs text-slate-500">{formatRelativeDate(post.date, t)}</span>
      </div>
      <h3 className="mt-4 font-bold leading-6">{post.title}</h3>
      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{post.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-3 py-1">{post.city}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">{post.category}</span>
      </div>
    </button>
  );
}

function SimpleModal({ title, subtitle, closeLabel, onClose, children, wide = false }: { title: string; subtitle?: string; closeLabel: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-[60]">
      <div className={`bg-white rounded-3xl shadow-xl border border-slate-200 p-6 w-full ${wide ? "max-w-2xl" : "max-w-sm"} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            {subtitle && <h3 className="text-lg font-bold mt-1">{subtitle}</h3>}
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100" aria-label={closeLabel}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SuccessModal({ title, help, closeLabel, onClose }: { title: string; help: string; closeLabel: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 w-full max-w-sm text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4"><CheckCircle2 size={30} /></div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-slate-600 mt-2 text-sm leading-6">{help}</p>
        <button type="button" onClick={onClose} className="mt-5 w-full rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium hover:bg-slate-700">{closeLabel}</button>
      </div>
    </div>
  );
}

function ImageNav({ direction, label, onClick }: { direction: "left" | "right"; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`absolute ${direction === "left" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 rounded-full bg-white/10 text-white px-4 py-3 hover:bg-white/20`}>
      {label}
    </button>
  );
}

function PostForm({
  form,
  setForm,
  t,
  onSubmit,
  onImageFiles,
  submitLabel,
  hideType = false,
  hideDate = false,
  hideManageCode = false,
  hideContact = false,
  disabled = false,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  t: (typeof translations)[Language];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onImageFiles: (files: File[]) => void;
  submitLabel: string;
  hideType?: boolean;
  hideDate?: boolean;
  hideManageCode?: boolean;
  hideContact?: boolean;
  disabled?: boolean;
}) {
  const previewImages = form.images.length ? form.images : form.image ? [form.image] : [];
  return (
    <form onSubmit={onSubmit} className="mt-6 grid md:grid-cols-2 gap-4">
      {!hideType && (
        <select className="rounded-xl border border-slate-200 px-3 py-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PostType })}>
          <option value="Lost">{t.lost}</option>
          <option value="Found">{t.found}</option>
        </select>
      )}
      <input className="rounded-xl border border-slate-200 px-3 py-3" placeholder={t.titlePlaceholder} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <div className="space-y-3">
        <select className="w-full rounded-xl border border-slate-200 px-3 py-3" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
          {cities.map((cityOption) => <option key={cityOption} value={cityOption}>{cityOption}</option>)}
        </select>
        {form.city === "Other / Anden by" && <input className="w-full rounded-xl border border-slate-200 px-3 py-3" placeholder={t.writeCityName} value={form.customCity} onChange={(e) => setForm({ ...form, customCity: e.target.value })} />}
      </div>
      <select className="rounded-xl border border-slate-200 px-3 py-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        {categories.map((categoryOption) => <option key={categoryOption} value={categoryOption}>{categoryOption}</option>)}
      </select>
      {!hideDate && <input className="rounded-xl border border-slate-200 px-3 py-3" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />}
      <input className="rounded-xl border border-slate-200 px-3 py-3" placeholder={t.locationPlaceholder} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      {!hideContact && <input className="rounded-xl border border-slate-200 px-3 py-3" placeholder={t.emailPlaceholder} value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />}
      {!hideManageCode && (
        <div>
          <input className="w-full rounded-xl border border-slate-200 px-3 py-3" placeholder={t.manageCodePlaceholder} value={form.manageCode} onChange={(e) => setForm({ ...form, manageCode: e.target.value })} />
          <p className="mt-2 text-xs text-slate-500">{t.manageCodeHelp}</p>
        </div>
      )}
      <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
        <ImagePlus className="mx-auto mb-3 text-slate-400" size={30} />
        <p className="text-sm font-medium text-slate-700">{t.imageUploadTitle}</p>
        <p className="text-sm text-slate-500 mt-1">{t.imageUploadHelp}</p>
        <p className="text-xs text-slate-400 mt-2">{t.imageCount}</p>
        {previewImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previewImages.map((imageSrc, index) => (
              <div key={`${imageSrc}-${index}`} className="relative">
                <img src={imageSrc} alt={`Preview ${index + 1}`} className="w-full h-28 object-cover rounded-2xl border border-slate-200" />
                <button
                  type="button"
                  onClick={() => {
                    const nextImages = previewImages.filter((_, imageIndex) => imageIndex !== index);
                    setForm({ ...form, images: nextImages, image: nextImages[0] || "" });
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-slate-900 p-1.5 text-white shadow-sm hover:bg-slate-700"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium hover:bg-slate-700 cursor-pointer">
          <ImagePlus size={18} /> {t.chooseImage}
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onImageFiles(Array.from(e.target.files || []))} />
        </label>
        <input className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3" placeholder={t.imageUrlPlaceholder} value={form.image.startsWith("data:") ? "" : form.image} onChange={(e) => setForm({ ...form, image: e.target.value, images: e.target.value ? [e.target.value] : [] })} />
      </div>
      <textarea className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-3 min-h-28" placeholder={t.descPlaceholder} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <button className="md:col-span-2 rounded-xl bg-slate-900 text-white px-5 py-3 font-medium hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={disabled}>{submitLabel}</button>
    </form>
  );
}
