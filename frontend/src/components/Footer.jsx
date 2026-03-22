function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-8 border-t border-zinc-800/50 bg-[#09090b]">
      {/* Ginawa nating flex-col at items-center para laging nasa gitna */}
      <div className="max-w-5xl mx-auto px-6 flex flex-col justify-center items-center gap-4 text-center">
        
        {/* Brand & Copyright Section */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-zinc-100 text-[12px] font-black uppercase tracking-tighter">
            ToDo<span className="text-emerald-500">List</span>
          </p>
          <p className="text-zinc-600 text-[10px] font-medium font-mono">
            &copy; {year} ToDoList Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;