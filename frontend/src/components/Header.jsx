function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-black font-black text-xs">TD</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            ToDo<span className="text-emerald-500">List</span>
          </h1>
        </div>
      </div>
    </nav>
  );
}
export default Header;