
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, MapPin, Clock, Package, ArrowRight,
  Menu, X, Laptop, BookOpen, KeyRound, Wallet,
  Headphones, Smartphone, CheckCircle2, Mail,
  SlidersHorizontal, Heart, ShieldCheck, Sparkles,
  Eye, Trash2, ArrowUpRight
} from "lucide-react";

const initialItems = [
  {
    id: 1, name: "MacBook Air", category: "Electronics",
    status: "Lost", location: "Central Library",
    date: "2026-11-09", owner: "Alex Morgan",
    email: "alex@example.com", description: "Space grey MacBook Air with a blue sticker on the lid.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700"
  },
  {
    id: 2, name: "Black Leather Wallet", category: "Accessories",
    status: "Found", location: "Cafeteria",
    date: "2026-11-10", owner: "Jamie Lee",
    email: "jamie@example.com", description: "Black wallet found near the cafeteria entrance.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=700"
  },
  {
    id: 3, name: "Wireless Headphones", category: "Electronics",
    status: "Lost", location: "Computer Lab",
    date: "2026-11-08", owner: "Sam Wilson",
    email: "sam@example.com", description: "White wireless headphones in a charging case.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700"
  },
  {
    id: 4, name: "Student ID Card", category: "Documents",
    status: "Found", location: "Engineering Block",
    date: "2026-11-10", owner: "Taylor Kim",
    email: "taylor@example.com", description: "Student identity card found outside the main block.",
    image: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=700"
  },
  {
    id: 5, name: "Blue Water Bottle", category: "Accessories",
    status: "Lost", location: "Sports Complex",
    date: "2026-11-07", owner: "Jordan Smith",
    email: "jordan@example.com", description: "Blue insulated bottle with a silver cap.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700"
  },
  {
    id: 6, name: "Calculus Notebook", category: "Books",
    status: "Found", location: "Lecture Hall 2",
    date: "2026-11-09", owner: "Chris Park",
    email: "chris@example.com", description: "A spiral-bound calculus notebook with handwritten notes.",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=700"
  }
];

const categories = ["All Categories", "Electronics", "Accessories", "Books", "Documents", "Other"];

const categoryIcons = {
  Electronics: Smartphone,
  Accessories: Wallet,
  Books: BookOpen,
  Documents: Package,
  Other: Package
};

const emptyForm = {
  name: "", category: "Electronics", status: "Lost",
  location: "", date: new Date().toISOString().slice(0, 10),
  owner: "", email: "", description: "", image: ""
};

function App() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("campus-items");
      return saved ? JSON.parse(saved) : initialItems;
    } catch {
      return initialItems;
    }
  });

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("All Categories");
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem("campus-items", JSON.stringify(items));
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const text = `${item.name} ${item.location} ${item.description}`.toLowerCase();
      const matchesSearch = text.includes(query.toLowerCase());
      const matchesStatus = filter === "All" || item.status === filter;
      const matchesCategory = category === "All Categories" || item.category === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [items, query, filter, category]);

  const lostCount = items.filter(item => item.status === "Lost").length;
  const foundCount = items.filter(item => item.status === "Found").length;

  function showNotice(message) {
    setNotice(message);
    setTimeout(() => setNotice(""), 3000);
  }

  function submitItem(e) {
    e.preventDefault();
    const newItem = {
      ...form,
      id: Date.now(),
      image: form.image || "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=700"
    };
    setItems(previous => [newItem, ...previous]);
    setForm(emptyForm);
    setModal(false);
    setFilter("All");
    setCategory("All Categories");
    setQuery("");
    showNotice("Your item has been reported successfully!");
  }

  function deleteItem(id) {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    setItems(previous => previous.filter(item => item.id !== id));
    setSelected(null);
    showNotice("Listing deleted.");
  }

  function resetFilters() {
    setQuery("");
    setFilter("All");
    setCategory("All Categories");
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Package size={22} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">FindIt<span className="text-indigo-600">.</span></h1>
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-slate-400">Campus Community</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            <a href="#home" className="text-indigo-600">Home</a>
            <a href="#listings" className="transition hover:text-indigo-600">Browse Items</a>
            <a href="#about" className="transition hover:text-indigo-600">How it works</a>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setModal(true)} className="hidden items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 sm:flex">
              <Plus size={17} /> Report an Item
            </button>
            <button className="rounded-lg p-2 md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="border-t bg-white p-5 md:hidden">
            <a className="block py-2" href="#home" onClick={() => setMobileMenu(false)}>Home</a>
            <a className="block py-2" href="#listings" onClick={() => setMobileMenu(false)}>Browse Items</a>
            <a className="block py-2" href="#about" onClick={() => setMobileMenu(false)}>How it works</a>
            <button onClick={() => { setModal(true); setMobileMenu(false); }} className="mt-3 w-full rounded-xl bg-indigo-600 p-3 font-bold text-white">+ Report an Item</button>
          </div>
        )}
      </header>

      {/* HERO */}
      <main id="home">
        <section className="relative overflow-hidden bg-[#111B3A]">
          <div className="pointer-events-none absolute -right-20 -top-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-4 py-2 text-xs font-semibold text-indigo-200">
                <Sparkles size={14} /> YOUR CAMPUS, CONNECTED
              </div>
              <h2 className="max-w-xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Lost something?<br />
                <span className="text-indigo-400">Let's find it.</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
                One campus. One community. One place to reunite lost belongings with their owners. Search, report and help each other out.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#listings" className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 font-bold text-white transition hover:bg-indigo-400">
                  Explore Listings <ArrowRight size={18} />
                </a>
                <button onClick={() => setModal(true)} className="rounded-xl border border-white/20 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">
                  Report Lost Item
                </button>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-green-400" /> Community powered</span>
                <span className="flex items-center gap-2"><Heart size={17} className="text-pink-400" /> Made for students</span>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -left-5 top-10 z-10 rounded-2xl border border-white/60 bg-white p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-100 p-3 text-green-600"><CheckCircle2 /></div>
                  <div><p className="text-sm font-bold">Item reunited!</p><p className="text-xs text-slate-400">Another happy student</p></div>
                </div>
              </div>
              <img className="h-[350px] w-full rounded-3xl object-cover opacity-90 shadow-2xl" src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1100" alt="University campus" />
              <div className="absolute -bottom-5 -right-4 rounded-2xl bg-white p-5 shadow-xl">
                <p className="text-xs font-semibold text-slate-400">COMMUNITY LISTINGS</p>
                <p className="mt-1 text-3xl font-black text-indigo-600">{items.length.toString().padStart(2, "0")}<span className="text-base text-slate-400">+</span></p>
                <p className="text-xs text-slate-500">Items reported</p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 py-8 sm:grid-cols-3 lg:px-8">
          <Stat icon={<Package />} title="Total Listings" value={items.length} color="bg-indigo-100 text-indigo-600" />
          <Stat icon={<Search />} title="Lost Items" value={lostCount} color="bg-orange-100 text-orange-600" />
          <Stat icon={<CheckCircle2 />} title="Found Items" value={foundCount} color="bg-green-100 text-green-600" />
        </section>

        {/* LISTINGS */}
        <section id="listings" className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-indigo-600">Community board</p>
              <h2 className="text-3xl font-black tracking-tight">Browse Listings</h2>
              <p className="mt-2 text-sm text-slate-500">Help someone find what they've lost.</p>
            </div>
            <button onClick={() => setModal(true)} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">
              <Plus size={17} /> Post an Item
            </button>
          </div>

          {/* SEARCH */}
          <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_200px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search items, places or descriptions..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* FILTER TABS */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {["All", "Lost", "Found"].map(status => (
                <button key={status} onClick={() => setFilter(status)} className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${filter === status ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"}`}>
                  {status === "All" ? "All Items" : status + " Items"}
                </button>
              ))}
            </div>
            <button onClick={resetFilters} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600">
              <SlidersHorizontal size={16} /> Reset filters
            </button>
          </div>

          {/* ITEM GRID */}
          {filteredItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <Package size={42} className="mx-auto text-slate-300" />
              <h3 className="mt-4 text-xl font-bold">No items found</h3>
              <p className="mt-2 text-sm text-slate-500">Try another search or reset your filters.</p>
              <button onClick={resetFilters} className="mt-5 font-bold text-indigo-600">Clear filters</button>
            </div>
          )}
        </section>

        {/* HOW IT WORKS */}
        <section id="about" className="border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto mb-12 max-w-xl text-center">
              <p className="text-xs font-bold uppercase tracking-[2px] text-indigo-600">Simple & easy</p>
              <h2 className="mt-3 text-3xl font-black">How FindIt works</h2>
              <p className="mt-3 text-sm text-slate-500">Three small steps can make a big difference.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Step number="01" icon={<Search />} title="Search or Browse" text="Look through campus listings to find your missing belongings." />
              <Step number="02" icon={<Plus />} title="Report an Item" text="Post details and a picture of something you've lost or found." />
              <Step number="03" icon={<Heart />} title="Reconnect" text="Contact the person who reported the item and arrange a safe handover." />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#111B3A] px-5 py-10 text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-black">FindIt<span className="text-indigo-400">.</span></h2>
              <p className="mt-1 text-sm text-slate-400">Making campus a little more connected.</p>
            </div>
            <p className="text-xs text-slate-400">© 2026 FindIt. Built for the campus community.</p>
          </div>
        </footer>
      </main>

      {/* REPORT MODAL */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Community contribution</p>
                <h2 className="mt-2 text-2xl font-black">Report an Item</h2>
                <p className="mt-1 text-sm text-slate-500">Fill in the details below.</p>
              </div>
              <button onClick={() => setModal(false)} className="rounded-xl bg-slate-100 p-2 hover:bg-slate-200"><X size={20} /></button>
            </div>
            <form onSubmit={submitItem} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold">Item name *</label>
                <input required maxLength={60} value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Black laptop bag" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">Report type *</label>
                  <select value={form.status} onChange={e => setForm({...form,status:e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
                    <option>Lost</option><option>Found</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold">Category *</label>
                  <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
                    {categories.slice(1).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">Campus location *</label>
                  <input required maxLength={100} value={form.location} onChange={e => setForm({...form,location:e.target.value})} placeholder="e.g. Main Library" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold">Date *</label>
                  <input required type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">Your name *</label>
                  <input required maxLength={60} value={form.owner} onChange={e => setForm({...form,owner:e.target.value})} placeholder="Your name" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold">Your email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold">Description *</label>
                <textarea required maxLength={500} value={form.description} onChange={e => setForm({...form,description:e.target.value})} rows="3" placeholder="Describe the item, identifying features, etc." className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold">Image URL (optional)</label>
                <input type="url" value={form.image} onChange={e => setForm({...form,image:e.target.value})} placeholder="https://example.com/image.jpg" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
              </div>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
                <Plus size={18} /> Submit Report
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ITEM DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selected.image} alt={selected.name} className="h-64 w-full object-cover" />
              <button onClick={() => setSelected(null)} className="absolute right-4 top-4 rounded-xl bg-white p-2 shadow"><X /></button>
              <span className={`absolute bottom-4 left-4 rounded-full px-4 py-2 text-xs font-bold ${selected.status === "Lost" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>{selected.status} Item</span>
            </div>
            <div className="p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">{selected.category}</p>
              <h2 className="mt-2 text-2xl font-black">{selected.name}</h2>
              <p className="mt-4 leading-7 text-slate-600">{selected.description}</p>
              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
                <p className="flex items-center gap-3"><MapPin size={17} /> {selected.location}</p>
                <p className="flex items-center gap-3"><Clock size={17} /> {selected.date}</p>
                <p className="flex items-center gap-3"><Eye size={17} /> Reported by {selected.owner}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${selected.email}?subject=${encodeURIComponent("Regarding your "+selected.name+" listing")}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700">
                  <Mail size={17} /> Contact Reporter
                </a>
                <button onClick={() => deleteItem(selected.id)} className="rounded-xl border border-red-200 px-4 py-3 text-red-600 hover:bg-red-50" title="Delete listing"><Trash2 size={18} /></button>
              </div>
              <p className="mt-4 text-xs text-slate-400">For safety, arrange item handovers in a public campus location.</p>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white shadow-2xl">
          <CheckCircle2 className="text-green-400" size={20} /> {notice}
        </div>
      )}
    </div>
  );
}

function Stat({ icon, title, value, color }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`rounded-xl p-4 ${color}`}>{icon}</div>
      <div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-1 text-2xl font-black">{value}</p></div>
    </div>
  );
}

function ItemCard({ item, onClick }) {
  const Icon = categoryIcons[item.category] || Package;
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${item.status === "Lost" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>{item.status}</span>
        <span className="absolute right-4 top-4 rounded-lg bg-white/90 p-2 text-indigo-600 backdrop-blur"><Icon size={18} /></span>
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">{item.category}</span>
          <span className="text-xs text-slate-400">{item.date}</span>
        </div>
        <h3 className="text-lg font-extrabold">{item.name}</h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{item.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><MapPin size={14} />{item.location}</span>
          <button onClick={onClick} className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800">Details <ArrowUpRight size={16} /></button>
        </div>
      </div>
    </article>
  );
}

function Step({ number, icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-7 text-center transition hover:border-indigo-200 hover:shadow-lg">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">{icon}</div>
      <p className="mt-5 text-xs font-black tracking-widest text-indigo-500">{number}</p>
      <h3 className="mt-2 text-lg font-extrabold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

export default App;
