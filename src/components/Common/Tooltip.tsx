export default function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute -bottom-8 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-2 py-1 rounded-md text-xs whitespace-nowrap bg-ink text-card hidden group-hover:block pointer-events-none z-50 shadow-sm">
        {text}
      </div>
    </div>
  );
}
