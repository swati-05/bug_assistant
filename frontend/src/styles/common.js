// Shared Tailwind class constants — use these everywhere for visual consistency.
export const cardStyle = "bg-white border border-slate-200 shadow-sm hover:shadow-md p-6 sm:p-8 rounded-2xl transition-all duration-300";
export const inputStyle = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400 text-slate-900";
export const buttonStyle = "rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
export const labelStyle = "block text-sm font-semibold text-slate-700 mb-1.5";
export const navStyle = "w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm";
export const badgeStyle = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider";
export const colors = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  accent: "text-indigo-600",
  background: "bg-slate-50"
};

// Priority badge color helper used across pages.
export const priorityColors = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

// Status badge color helper.
export const statusColors = {
  Open: "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};
