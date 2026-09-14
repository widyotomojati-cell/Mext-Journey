export default function Loading() {
  return (
    <main className="route-loading" role="status" aria-live="polite">
      <div className="route-loading__card">
        <span className="route-loading__spinner" aria-hidden="true" />
        <div>
          <p className="eyebrow">MEXT Journey</p>
          <strong>Menyiapkan langkah berikutnya...</strong>
        </div>
      </div>
      <span className="sr-only">Halaman sedang dimuat.</span>
    </main>
  );
}
