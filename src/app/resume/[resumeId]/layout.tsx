export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
      <div className="flex print:block">
        <main className="flex-1 p-8 print:p-0">{children}</main>
      </div>
    </div>
  );
}