import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  PlusCircle,
  ShieldCheck,
  Globe2,
  Mail,
  Phone,
  Upload,
  Filter,
  X,
  CheckCircle2,
  ImagePlus,
  Trash2,
  Flag,
  Pencil,
  Bookmark,
  Clock3,
  Maximize2,
} from "lucide-react";

type Language = "en" | "da";
type PostType = "Lost" | "Found";

type Post = {
  id: number;
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
    postItem: "Post item",
    languageBadge: "English · Danish friendly",
    heroTitle: "Lost something in Denmark? Let the community help.",
    heroText:
      "Post lost or found items by city, category, date and location. This prototype is designed for foreigners, students and visitors who may not know the local system.",
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
    messageSentHelp: "Prototype: in the real version, this message would be forwarded without revealing the poster's email.",
    contactPrivacy: "The poster's email is hidden. Messages are sent through the website.",
    close: "Close",
    formTitle: "Post a lost or found item",
    formHelp: "This first version stores posts only in the browser session. Later we can connect it to a database.",
    missingFields: "Please fill in title, description, email and manage code.",
    contactMissingFields: "Please fill in your email and message.",
    postedSuccessfully: "Posted successfully!",
    postedHelp: "Your post is now visible at the top of the list.",
    titlePlaceholder: "Title",
    locationPlaceholder: "Exact location",
    emailPlaceholder: "Email contact",
    descPlaceholder: "Description: where, when, what it looks like...",
    imageUploadTitle: "Image upload coming next",
    imageUploadHelp: "For now you can paste an image URL below.",
    imageUrlPlaceholder: "Paste image URL",
    officialReminder: "Important items like passports, ID cards and bank cards should also be reported to Danish police (114).",
    privacyReminder: "Privacy reminder: do not post CPR numbers, passport numbers, bank card numbers or other sensitive personal information.",
    submit: "Submit post",
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
    savedLocally: "Posts are saved locally in this browser for this prototype.",
    chooseImage: "Choose images",
    imageCount: "Up to 3 images",
    nextImage: "Next",
    previousImage: "Previous",
    managePostTitle: "Manage post",
    managePostHelp: "Enter the manage code you created when posting.",
    confirm: "Confirm",
    editPost: "Edit post",
    saveChanges: "Save changes",
    editedSuccessfully: "Post updated",
    editedHelp: "Your changes have been saved in this browser prototype.",
    deletePost: "Delete post",
    confirmDeleteTitle: "Delete this post?",
    confirmDeleteHelp: "This cannot be undone in this prototype.",
    cancel: "Cancel",
    deletedSuccessfully: "Post deleted",
    deletedHelp: "The post has been removed from this browser prototype.",
    reportPost: "Report post",
    reportTitle: "Report this post",
    reportReason: "Reason for report",
    reportHelp: "Prototype: in the real version, reports would be reviewed by moderators.",
    reportSent: "Report sent",
    reportMissingReason: "Please enter a reason for the report.",
    savePost: "Save post",
    savedPost: "Saved",
    showSavedOnly: "Show saved only",
    showAllPosts: "Show all posts",
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
    openImage: "Open image"
  },
  da: {
    tagline: "En simpel fælles opslagstavle for hittegods i Danmark",
    postItem: "Opret opslag",
    languageBadge: "Engelsk · Dansk venlig",
    heroTitle: "Har du mistet noget i Danmark? Lad fællesskabet hjælpe.",
    heroText:
      "Opret opslag om mistede eller fundne ting efter by, kategori, dato og sted. Denne prototype er lavet til udlændinge, studerende og besøgende, som ikke kender det lokale system.",
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
    messageSentHelp: "Prototype: i den rigtige version videresendes beskeden uden at vise opretterens e-mail.",
    contactPrivacy: "Opretterens e-mail er skjult. Beskeder sendes gennem hjemmesiden.",
    close: "Luk",
    formTitle: "Opret et opslag om mistet eller fundet ting",
    formHelp: "Denne første version gemmer kun opslag i browsersessionen. Senere kan vi forbinde den til en database.",
    missingFields: "Udfyld venligst titel, beskrivelse, e-mail og administrationskode.",
    contactMissingFields: "Udfyld venligst din e-mail og besked.",
    postedSuccessfully: "Opslaget er oprettet!",
    postedHelp: "Dit opslag er nu synligt øverst på listen.",
    titlePlaceholder: "Titel",
    locationPlaceholder: "Præcis placering",
    emailPlaceholder: "E-mail kontakt",
    descPlaceholder: "Beskrivelse: hvor, hvornår, hvordan det ser ud...",
    imageUploadTitle: "Billedupload kommer snart",
    imageUploadHelp: "Indsæt et billede-link nedenfor indtil videre.",
    imageUrlPlaceholder: "Indsæt billede-link",
    officialReminder: "Vigtige genstande som pas, ID-kort og bankkort bør også anmeldes til dansk politi (114).",
    privacyReminder: "Privatlivspåmindelse: skriv ikke CPR-numre, pasnumre, kortnumre eller andre følsomme personoplysninger.",
    submit: "Opret opslag",
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
    savedLocally: "Opslag gemmes lokalt i denne browser i denne prototype.",
    chooseImage: "Vælg billeder",
    imageCount: "Op til 3 billeder",
    nextImage: "Næste",
    previousImage: "Forrige",
    managePostTitle: "Administrer opslag",
    managePostHelp: "Indtast administrationskoden, du oprettede ved opslaget.",
    confirm: "Bekræft",
    editPost: "Rediger opslag",
    saveChanges: "Gem ændringer",
    editedSuccessfully: "Opslaget er opdateret",
    editedHelp: "Dine ændringer er gemt i denne browserprototype.",
    deletePost: "Slet opslag",
    confirmDeleteTitle: "Slet dette opslag?",
    confirmDeleteHelp: "Dette kan ikke fortrydes i denne prototype.",
    cancel: "Annuller",
    deletedSuccessfully: "Opslaget er slettet",
    deletedHelp: "Opslaget er fjernet fra denne browserprototype.",
    reportPost: "Anmeld opslag",
    reportTitle: "Anmeld dette opslag",
    reportReason: "Årsag til anmeldelse",
    reportHelp: "Prototype: i den rigtige version vil anmeldelser blive gennemgået af moderatorer.",
    reportSent: "Anmeldelse sendt",
    reportMissingReason: "Indtast venligst en årsag til anmeldelsen.",
    savePost: "Gem opslag",
    savedPost: "Gemt",
    showSavedOnly: "Vis kun gemte",
    showAllPosts: "Vis alle opslag",
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
    openImage: "Åbn billede"
  },
} as const;

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
    manageCode: "1234",
  },
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

const STORAGE_KEY = "lost-and-found-dk-posts-v1";
const ARCHIVE_AFTER_DAYS = 90;
const fallbackImage = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop";

function daysBetween(dateString: string, now = new Date()) {
  const postDate = new Date(`${dateString}T00:00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today.getTime() - postDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function isArchived(post: Post, now = new Date()) {
  return daysBetween(post.date, now) > ARCHIVE_AFTER_DAYS;
}

function normalizePost(post: Post): Post {
  return {
    ...post,
    images: post.images || (post.image ? [post.image] : []),
    manageCode: post.manageCode || "1234",
    resolved: Boolean(post.resolved),
    saved: Boolean(post.saved),
  };
}

function filterPosts(
  postsToFilter: Post[],
  filters: { city: string; category: string; query: string; showResolved: boolean; showArchived: boolean; showSavedOnly: boolean }
) {
  const { city, category, query, showResolved, showArchived, showSavedOnly } = filters;
  return postsToFilter.filter((post) => {
    const matchesCity = city === "All cities" || post.city === city;
    const matchesCategory = category === "All categories" || post.category === category;
    const searchText = `${post.title} ${post.description} ${post.city} ${post.category} ${post.location || ""}`;
    const matchesQuery = searchText.toLowerCase().includes(query.toLowerCase());
    const matchesResolved = showResolved || !post.resolved;
    const matchesArchived = showArchived || !isArchived(post);
    const matchesSaved = !showSavedOnly || Boolean(post.saved);
    return matchesCity && matchesCategory && matchesQuery && matchesResolved && matchesArchived && matchesSaved;
  });
}

function formatRelativeDate(dateString: string, t: typeof translations.en) {
  const days = daysBetween(dateString);
  if (days <= 0) return t.today;
  if (days === 1) return t.yesterday;
  return `${days} ${t.daysAgo}`;
}

function runSelfTests() {
  const englishKeys = Object.keys(translations.en);
  const danishKeys = Object.keys(translations.da);
  console.assert(englishKeys.every((key) => danishKeys.includes(key)), "Danish translations should include all English keys.");
  console.assert(cities[cities.length - 1] === "Other / Anden by", "Other city option should stay last.");
  console.assert(translations.en.hideResolved === "Hide resolved", "Resolved button should describe the hide action.");
  console.assert(typeof STORAGE_KEY === "string" && STORAGE_KEY.length > 0, "LocalStorage key should be defined.");

  const withoutResolved = filterPosts(samplePosts, {
    city: "All cities",
    category: "All categories",
    query: "",
    showResolved: false,
    showArchived: true,
    showSavedOnly: false,
  });
  console.assert(withoutResolved.every((post) => !post.resolved), "Resolved posts should be hidden when showResolved is false.");

  const archivedHidden = filterPosts([{ ...samplePosts[0], date: "2025-01-01" }], {
    city: "All cities",
    category: "All categories",
    query: "",
    showResolved: true,
    showArchived: false,
    showSavedOnly: false,
  });
  console.assert(archivedHidden.length === 0, "Archived posts should be hidden when showArchived is false.");
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

  function resetFilters() {
    setCity("All cities");
    setCategory("All categories");
    setQuery("");
    setShowResolved(true);
    setShowArchived(false);
    setShowSavedOnly(false);
  }
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactError, setContactError] = useState("");
  const [showMessageSent, setShowMessageSent] = useState(false);
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const cityOptions = ["All cities", ...cities];
  const categoryOptions = ["All categories", ...categories];

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // LocalStorage can fail in private browsing or restricted preview environments.
    }
  }, [posts]);

  const totalPosts = posts.length;
  const resolvedPosts = posts.filter((post) => post.resolved).length;
  const activeCities = new Set(posts.map((post) => post.city)).size;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const filteredPosts = useMemo(
    () => filterPosts(posts, { city, category, query, showResolved, showArchived, showSavedOnly }),
    [posts, city, category, query, showResolved, showArchived, showSavedOnly]
  );

  function labelType(type: PostType) {
    return type === "Lost" ? t.lost : t.found;
  }

  function labelOption(option: string) {
    if (option === "All cities") return t.allCities;
    if (option === "All categories") return t.allCategories;
    return option;
  }

  function handleSendContactMessage() {
    if (!selectedPost) return;
    if (!contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError(t.contactMissingFields);
      return;
    }

    setContactError("");
    setShowMessageSent(true);
    setContactForm({ name: "", email: "", message: "" });
    window.setTimeout(() => setShowMessageSent(false), 3000);
  }

  function toggleSaved(postId: number) {
    setPosts((currentPosts) =>
      currentPosts.map((post) => post.id === postId ? { ...post, saved: !post.saved } : post)
    );
    setSelectedPost((currentPost) =>
      currentPost && currentPost.id === postId ? { ...currentPost, saved: !currentPost.saved } : currentPost
    );
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
    setManageTarget(post);
    setManageCodeInput("");
    setManageError("");
    setPendingDelete(false);
  }

  function confirmToggleResolved() {
    if (!manageTarget) return;
    const expectedCode = manageTarget.manageCode || "1234";
    if (manageCodeInput.trim() !== expectedCode.trim()) {
      setManageError(t.wrongManageCode);
      return;
    }

    const nextResolved = !manageTarget.resolved;
    setPosts((currentPosts) =>
      currentPosts.map((currentPost) =>
        currentPost.id === manageTarget.id
          ? { ...currentPost, resolved: nextResolved, manageCode: expectedCode }
          : currentPost
      )
    );
    setSelectedPost((currentPost) =>
      currentPost && currentPost.id === manageTarget.id
        ? { ...currentPost, resolved: nextResolved, manageCode: expectedCode }
        : currentPost
    );
    setManageTarget(null);
    setManageCodeInput("");
    setManageError("");
  }

  function openEditPost() {
    if (!manageTarget) return;
    const expectedCode = manageTarget.manageCode || "1234";
    if (manageCodeInput.trim() !== expectedCode.trim()) {
      setManageError(t.wrongManageCode);
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
      manageCode: expectedCode,
    });
    setEditError("");
    setManageTarget(null);
    setPendingDelete(false);
  }

  function saveEditedPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingPost) return;
    if (!editForm.title.trim() || !editForm.description.trim() || !editForm.contact.trim()) {
      setEditError(t.missingFields);
      return;
    }

    const finalCity = editForm.city === "Other / Anden by" && editForm.customCity.trim()
      ? editForm.customCity.trim()
      : editForm.city;

    const updatedPost: Post = {
      ...editingPost,
      title: editForm.title.trim(),
      city: finalCity,
      category: editForm.category,
      description: editForm.description.trim(),
      contact: editForm.contact.trim(),
      location: editForm.location.trim(),
      image: (editForm.images[0] || editForm.image).trim() || fallbackImage,
      images: editForm.images.length ? editForm.images : [editForm.image || fallbackImage],
    };

    setPosts((currentPosts) => currentPosts.map((post) => post.id === editingPost.id ? updatedPost : post));
    setSelectedPost((currentPost) => currentPost && currentPost.id === editingPost.id ? updatedPost : currentPost);
    setEditingPost(null);
    setEditError("");
    setSuccessTitle(t.editedSuccessfully);
    setSuccessHelp(t.editedHelp);
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 3000);
  }

  function handleEditImageFile(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, 3);
    if (!files.length) return;

    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
            reader.readAsDataURL(file);
          })
      )
    ).then((images) => {
      setEditForm((currentForm) => ({
        ...currentForm,
        images,
        image: images[0] || currentForm.image,
      }));
    });
  }

  function confirmDeletePost() {
    if (!manageTarget) return;
    const expectedCode = manageTarget.manageCode || "1234";
    if (manageCodeInput.trim() !== expectedCode.trim()) {
      setManageError(t.wrongManageCode);
      return;
    }

    if (!pendingDelete) {
      setPendingDelete(true);
      setManageError("");
      return;
    }

    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== manageTarget.id));
    setSelectedPost((currentPost) =>
      currentPost && currentPost.id === manageTarget.id ? null : currentPost
    );
    setManageTarget(null);
    setManageCodeInput("");
    setManageError("");
    setPendingDelete(false);
    setSuccessTitle(t.deletedSuccessfully);
    setSuccessHelp(t.deletedHelp);
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 3000);
  }

  function handleImageFile(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, 3);
    if (!files.length) return;

    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
            reader.readAsDataURL(file);
          })
      )
    ).then((images) => {
      setForm((currentForm) => ({
        ...currentForm,
        images,
        image: images[0] || currentForm.image,
      }));
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.contact.trim() || !form.manageCode.trim()) {
      setFormError(t.missingFields);
      return;
    }

    const finalCity = form.city === "Other / Anden by" && form.customCity.trim() ? form.customCity.trim() : form.city;

    const newPost: Post = {
      id: Date.now(),
      type: form.type,
      title: form.title.trim(),
      city: finalCity,
      category: form.category,
      date: form.date || new Date().toISOString().slice(0, 10),
      description: form.description.trim(),
      contact: form.contact.trim(),
      location: form.location.trim(),
      resolved: false,
      image: (form.images[0] || form.image).trim() || fallbackImage,
      images: form.images.length ? form.images : [form.image || fallbackImage],
      manageCode: form.manageCode.trim(),
    };

    setPosts([newPost, ...posts]);
    setForm(emptyForm);
    setFormError("");
    setSuccessTitle(t.postedSuccessfully);
    setSuccessHelp(t.postedHelp);
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 3000);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Search size={23} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">LostAndFoundDK</h1>
              <p className="text-sm text-slate-500">{t.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl border border-slate-200 p-1 bg-slate-50 flex">
              <button type="button" onClick={() => setLang("en")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${lang === "en" ? "bg-slate-900 text-white" : "text-slate-600"}`}>
                EN
              </button>
              <button type="button" onClick={() => setLang("da")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${lang === "da" ? "bg-slate-900 text-white" : "text-slate-600"}`}>
                DA
              </button>
            </div>
            <a href="#post" className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-700">
              <PlusCircle size={18} /> {t.postItem}
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-600 mb-5">
            <Globe2 size={16} /> {t.languageBadge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">{t.heroTitle}</h2>
          <p className="mt-5 text-lg text-slate-600 leading-8">{t.heroText}</p>
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <Feature icon={<MapPin size={18} />} title={t.cityBoards} text={t.cityBoardsText} />
            <Feature icon={<ShieldCheck size={18} />} title={t.safetyFirst} text={t.safetyFirstText} />
            <Feature icon={<Upload size={18} />} title={t.easyPosting} text={t.easyPostingText} />
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
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

      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">{t.totalPosts}</p>
            <h3 className="mt-2 text-3xl font-bold">{totalPosts}</h3>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">{t.resolvedPosts}</p>
            <h3 className="mt-2 text-3xl font-bold">{resolvedPosts}</h3>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">{t.activeCities}</p>
            <h3 className="mt-2 text-3xl font-bold">{activeCities}</h3>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Clock3 size={18} className="text-slate-500" />
            <h2 className="text-xl font-bold">{t.recentlyPosted}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {recentPosts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => {
                  setSelectedPost(post);
                  setSelectedImageIndex(0);
                  setContactError("");
                  setShowMessageSent(false);
                }}
                className="text-left rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${post.type === "Lost" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {labelType(post.type)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatRelativeDate(post.date, t)}
                  </span>
                </div>
                <h3 className="mt-4 font-bold leading-6">{post.title}</h3>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">{post.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{post.city}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{post.category}</span>
                </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-3 outline-none focus:ring-2 focus:ring-slate-300" placeholder={t.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <select className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-slate-300" value={city} onChange={(e) => setCity(e.target.value)}>
              {cityOptions.map((cityOption) => (
                <option key={cityOption} value={cityOption}>{labelOption(cityOption)}</option>
              ))}
            </select>
            <select className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-slate-300" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categoryOptions.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>{labelOption(categoryOption)}</option>
              ))}
            </select>
            <button type="button" onClick={() => setShowResolved(!showResolved)} className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${showResolved ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-700"}`}>
              {showResolved ? t.hideResolved : t.showResolved}
            </button>
            <button type="button" onClick={() => setShowArchived(!showArchived)} className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${showArchived ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-700"}`}>
              {showArchived ? t.hideArchived : t.showArchived}
            </button>
            <button type="button" onClick={() => setShowSavedOnly(!showSavedOnly)} className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${showSavedOnly ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-700"}`}>
              {showSavedOnly ? t.showAllPosts : t.showSavedOnly}
            </button>
          </div>
          <p className="mb-6 text-sm text-slate-500">{t.archivedAfter}</p>

          {filteredPosts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4">
                <Search size={28} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold">{t.noResults}</h3>
              <p className="mt-2 text-slate-500 max-w-md mx-auto leading-7">{t.noResultsHelp}</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-medium hover:bg-slate-700"
              >
                <X size={16} /> {t.clearFilters}
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <article key={post.id} className="rounded-2xl overflow-hidden border border-slate-200 hover:shadow-sm transition bg-white">
                {(post.images?.[0] || post.image) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPost(post);
                      setSelectedImageIndex(0);
                      setContactError("");
                      setShowMessageSent(false);
                    }}
                    className="block w-full text-left group"
                    aria-label={`Open ${post.title}`}
                  >
                    <img
                      src={post.images?.[0] || post.image}
                      alt={post.title}
                      className="w-full h-44 object-cover transition group-hover:scale-[1.02]"
                    />
                  </button>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${post.type === "Lost" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{labelType(post.type)}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSaved(post.id)}
                        className={`rounded-full p-2 border ${post.saved ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-white text-slate-500 border-slate-200"}`}
                        aria-label={post.saved ? t.savedPost : t.savePost}
                      >
                        <Bookmark size={16} />
                      </button>
                      <span className="text-sm text-slate-500">{post.date}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPost(post);
                      setSelectedImageIndex(0);
                      setContactError("");
                      setShowMessageSent(false);
                    }}
                    className="text-left w-full"
                  >
                    <h3 className="mt-4 text-lg font-bold leading-snug hover:underline">{post.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-6">{post.description}</p>
                  </button>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                    {post.location && <span className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 border border-blue-100">📍 {post.location}</span>}
                    <span className="rounded-full bg-slate-100 px-3 py-1">{post.city}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">{post.category}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {isArchived(post) && <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-sm font-medium border border-amber-100">{t.archived}</span>}
                    {post.saved && <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 text-yellow-700 px-3 py-1 text-sm font-medium border border-yellow-100"><Bookmark size={16} /> {t.savedPost}</span>}
                    {post.resolved && <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-sm font-medium border border-emerald-100"><CheckCircle2 size={16} /> {t.resolved}</span>}
                  </div>
                  <button type="button" onClick={() => {
                    setSelectedPost(post);
                    setSelectedImageIndex(0);
                    setContactError("");
                    setShowMessageSent(false);
                  }} className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-900 hover:underline">
                    <Mail size={16} /> {t.contactPoster}
                  </button>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openManageDialog(post)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                      <Pencil size={16} /> {t.managePost}
                    </button>
                    <button
                      type="button"
                      onClick={() => openReportDialog(post)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                      <Flag size={16} /> {t.reportPost}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="post" className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6">
          <h2 className="text-2xl font-bold">{t.formTitle}</h2>
          <p className="text-slate-600 mt-2">{t.formHelp}</p>
          <p className="text-sm text-slate-500 mt-2">{t.savedLocally}</p>
          {formError && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm font-medium">{formError}</div>}
          <form onSubmit={handleSubmit} className="mt-6 grid md:grid-cols-2 gap-4">
            <select className="rounded-xl border border-slate-200 px-3 py-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PostType })}>
              <option value="Lost">{t.lost}</option>
              <option value="Found">{t.found}</option>
            </select>
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
            <input className="rounded-xl border border-slate-200 px-3 py-3" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <input className="rounded-xl border border-slate-200 px-3 py-3" placeholder={t.locationPlaceholder} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input className="rounded-xl border border-slate-200 px-3 py-3" placeholder={t.emailPlaceholder} value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            <div>
              <input className="w-full rounded-xl border border-slate-200 px-3 py-3" placeholder={t.manageCodePlaceholder} value={form.manageCode} onChange={(e) => setForm({ ...form, manageCode: e.target.value })} />
              <p className="mt-2 text-xs text-slate-500">{t.manageCodeHelp}</p>
            </div>
            <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <ImagePlus className="mx-auto mb-3 text-slate-400" size={30} />
              <p className="text-sm font-medium text-slate-700">{t.imageUploadTitle}</p>
              <p className="text-sm text-slate-500 mt-1">{t.imageUploadHelp}</p>
              <p className="text-xs text-slate-400 mt-2">{t.imageCount}</p>
              {(form.images.length ? form.images : form.image ? [form.image] : []).length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(form.images.length ? form.images : [form.image]).map((imageSrc, index) => (
                    <img key={index} src={imageSrc} alt={`Preview ${index + 1}`} className="w-full h-28 object-cover rounded-2xl border border-slate-200" />
                  ))}
                </div>
              )}
              <label className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium hover:bg-slate-700 cursor-pointer">
                <ImagePlus size={18} /> {t.chooseImage}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageFile} />
              </label>
              <input className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3" placeholder={t.imageUrlPlaceholder} value={form.image.startsWith("data:") ? "" : form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <textarea className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-3 min-h-28" placeholder={t.descPlaceholder} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="md:col-span-2 rounded-xl bg-slate-900 text-white px-5 py-3 font-medium hover:bg-slate-700" type="submit">{t.submit}</button>
          </form>
        </div>
      </section>

      {showSuccess && (
        <div className="fixed inset-0 bg-slate-900/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 w-full max-w-sm text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="text-xl font-bold">{successTitle || t.postedSuccessfully}</h3>
            <p className="text-slate-600 mt-2 text-sm leading-6">{successHelp || t.postedHelp}</p>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="mt-5 w-full rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium hover:bg-slate-700"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {reportTarget && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 w-full max-w-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{t.reportTitle}</p>
                <h3 className="text-lg font-bold mt-1">{reportTarget.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setReportTarget(null)}
                className="rounded-xl p-2 hover:bg-slate-100"
                aria-label={t.close}
              >
                <X size={20} />
              </button>
            </div>
            <textarea
              className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3 min-h-28 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder={t.reportReason}
              value={reportReason}
              onChange={(e) => {
                setReportReason(e.target.value);
                setReportError("");
              }}
              autoFocus
            />
            {reportError && (
              <p className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {reportError}
              </p>
            )}
            <button
              type="button"
              onClick={submitReport}
              className="mt-5 w-full rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium hover:bg-slate-700 inline-flex items-center justify-center gap-2"
            >
              <Flag size={16} /> {t.reportPost}
            </button>
          </div>
        </div>
      )}

      {editingPost && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{t.editPost}</p>
                <h3 className="text-lg font-bold mt-1">{editingPost.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="rounded-xl p-2 hover:bg-slate-100"
                aria-label={t.close}
              >
                <X size={20} />
              </button>
            </div>
            {editError && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm font-medium">{editError}</div>}
            <form onSubmit={saveEditedPost} className="mt-6 grid md:grid-cols-2 gap-4">
              <input className="rounded-xl border border-slate-200 px-3 py-3" placeholder={t.titlePlaceholder} value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              <select className="rounded-xl border border-slate-200 px-3 py-3" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                {categories.map((categoryOption) => <option key={categoryOption} value={categoryOption}>{categoryOption}</option>)}
              </select>
              <div className="space-y-3">
                <select className="w-full rounded-xl border border-slate-200 px-3 py-3" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}>
                  {cities.map((cityOption) => <option key={cityOption} value={cityOption}>{cityOption}</option>)}
                </select>
                {editForm.city === "Other / Anden by" && <input className="w-full rounded-xl border border-slate-200 px-3 py-3" placeholder={t.writeCityName} value={editForm.customCity} onChange={(e) => setEditForm({ ...editForm, customCity: e.target.value })} />}
              </div>
              <input className="rounded-xl border border-slate-200 px-3 py-3" placeholder={t.locationPlaceholder} value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
              <input className="rounded-xl border border-slate-200 px-3 py-3" placeholder={t.emailPlaceholder} value={editForm.contact} onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })} />
              <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                {(editForm.images.length ? editForm.images : editForm.image ? [editForm.image] : []).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(editForm.images.length ? editForm.images : [editForm.image]).map((imageSrc, index) => (
                      <img key={index} src={imageSrc} alt={`Preview ${index + 1}`} className="w-full h-28 object-cover rounded-2xl border border-slate-200" />
                    ))}
                  </div>
                )}
                <label className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium hover:bg-slate-700 cursor-pointer">
                  <ImagePlus size={18} /> {t.chooseImage}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleEditImageFile} />
                </label>
                <input className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3" placeholder={t.imageUrlPlaceholder} value={editForm.image.startsWith("data:") ? "" : editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />
              </div>
              <textarea className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-3 min-h-28" placeholder={t.descPlaceholder} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
              <button className="md:col-span-2 rounded-xl bg-slate-900 text-white px-5 py-3 font-medium hover:bg-slate-700" type="submit">{t.saveChanges}</button>
            </form>
          </div>
        </div>
      )}

      {manageTarget && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 w-full max-w-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{t.managePostTitle}</p>
                <h3 className="text-lg font-bold mt-1">{manageTarget.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setManageTarget(null);
                  setPendingDelete(false);
                }}
                className="rounded-xl p-2 hover:bg-slate-100"
                aria-label={t.close}
              >
                <X size={20} />
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-6">{t.managePostHelp}</p>
            <input
              className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder={t.manageCodePlaceholder}
              value={manageCodeInput}
              onChange={(e) => {
                setManageCodeInput(e.target.value);
                setManageError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmToggleResolved();
              }}
              autoFocus
            />
            {manageError && (
              <p className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {manageError}
              </p>
            )}
            {pendingDelete && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm leading-6">
                <p className="font-semibold">{t.confirmDeleteTitle}</p>
                <p>{t.confirmDeleteHelp}</p>
              </div>
            )}
            <div className="mt-5 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={openEditPost}
                className="w-full rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-50 inline-flex items-center justify-center gap-2"
              >
                <Pencil size={16} /> {t.editPost}
              </button>
              <button
                type="button"
                onClick={confirmToggleResolved}
                className="w-full rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium hover:bg-slate-700 inline-flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} /> {manageTarget.resolved ? t.reopenPost : t.markResolved}
              </button>
              <button
                type="button"
                onClick={confirmDeletePost}
                className="w-full rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm font-medium hover:bg-rose-100 inline-flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> {pendingDelete ? t.confirmDeleteTitle : t.deletePost}
              </button>
              {pendingDelete && (
                <button
                  type="button"
                  onClick={() => setPendingDelete(false)}
                  className="w-full rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {lightboxOpen && selectedPost && (
        <div className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 text-white p-3 hover:bg-white/20"
            aria-label={t.close}
          >
            <X size={24} />
          </button>
          {(selectedPost.images?.length || 0) > 1 && (
            <button
              type="button"
              onClick={() => setSelectedImageIndex((current) => current === 0 ? (selectedPost.images?.length || 1) - 1 : current - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 text-white px-4 py-3 hover:bg-white/20"
            >
              {t.previousImage}
            </button>
          )}
          <img
            src={selectedPost.images?.[selectedImageIndex] || selectedPost.image}
            alt={selectedPost.title}
            className="max-h-[85vh] max-w-[92vw] object-contain rounded-2xl"
          />
          {(selectedPost.images?.length || 0) > 1 && (
            <button
              type="button"
              onClick={() => setSelectedImageIndex((current) => (current + 1) % (selectedPost.images?.length || 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 text-white px-4 py-3 hover:bg-white/20"
            >
              {t.nextImage}
            </button>
          )}
        </div>
      )}

      {selectedPost && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {(selectedPost.images?.[selectedImageIndex] || selectedPost.image) && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="block w-full group"
                aria-label={t.openImage}
              >
                <img src={selectedPost.images?.[selectedImageIndex] || selectedPost.image} alt={selectedPost.title} className="w-full h-56 sm:h-72 object-cover" />
                <span className="absolute right-3 bottom-3 rounded-full bg-black/60 text-white px-3 py-2 text-sm inline-flex items-center gap-2 opacity-90 group-hover:opacity-100">
                  <Maximize2 size={15} /> {t.openImage}
                </span>
              </button>
              {(selectedPost.images?.length || 0) > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedImageIndex((current) => current === 0 ? (selectedPost.images?.length || 1) - 1 : current - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium shadow"
                  >
                    {t.previousImage}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedImageIndex((current) => ((current + 1) % (selectedPost.images?.length || 1)))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium shadow"
                  >
                    {t.nextImage}
                  </button>
                </>
              )}
            </div>
          )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{t.contactInfo}</p>
                  <h3 className="text-xl font-bold mt-1">{selectedPost.title}</h3>
                </div>
                <button type="button" onClick={() => setSelectedPost(null)} className="rounded-xl p-2 hover:bg-slate-100" aria-label={t.close}>
                  <X size={20} />
                </button>
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
                <p className="text-sm text-slate-500 mb-3">{t.contactPrivacy}</p>
                <div className="grid gap-3">
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-3"
                    placeholder={t.contactFormName}
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-3"
                    placeholder={t.contactFormEmail}
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                  <textarea
                    className="rounded-xl border border-slate-200 px-3 py-3 min-h-28"
                    placeholder={t.contactFormMessage}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>
                {contactError && <p className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{contactError}</p>}
                {showMessageSent && (
                  <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
                    <p className="font-medium">{t.messageSent}</p>
                    <p className="mt-1">{t.messageSentHelp}</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSendContactMessage}
                  className="mt-4 w-full rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium hover:bg-slate-700 inline-flex items-center justify-center gap-2"
                >
                  <Mail size={16} /> {t.sendMessage}
                </button>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => toggleSaved(selectedPost.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-medium inline-flex items-center justify-center gap-2 ${selectedPost.saved ? "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                >
                  <Bookmark size={18} /> {selectedPost.saved ? t.savedPost : t.savePost}
                </button>
                <button
                  type="button"
                  onClick={() => openManageDialog(selectedPost)}
                  className="w-full rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-50 inline-flex items-center justify-center gap-2"
                >
                  <Pencil size={18} /> {t.managePost}
                </button>
                <button
                  type="button"
                  onClick={() => openReportDialog(selectedPost)}
                  className="w-full rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-3 text-sm font-medium hover:bg-slate-50 inline-flex items-center justify-center gap-2"
                >
                  <Flag size={18} /> {t.reportPost}
                </button>
              </div>
              <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800 leading-6">{t.privacyReminder}</div>
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800 leading-6">{t.officialReminder}</div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© 2026 LostAndFoundDK. Community prototype.</p>
          <p className="flex items-center gap-2"><Phone size={15} /> {t.footerOfficial}</p>
        </div>
      </footer>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center mb-3">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 leading-5">{text}</p>
    </div>
  );
}
