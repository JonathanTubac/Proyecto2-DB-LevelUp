export default function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        onClick={() => onPage(page - 1)}
        disabled={!pagination.hasPrev}
      >
        ← Anterior
      </button>

      {pages.map(p => (
        <button
          key={p}
          className={p === page ? 'active' : ''}
          onClick={() => onPage(p)}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPage(page + 1)}
        disabled={!pagination.hasNext}
      >
        Siguiente →
      </button>

      <span>
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} de {total}
      </span>
    </div>
  );
}