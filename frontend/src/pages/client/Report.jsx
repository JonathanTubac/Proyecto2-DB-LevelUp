import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ClientLayout from '../../components/client/ClientLayout';
import { getMyReport } from '../../api/client.api';
import { useAuth } from '../../hooks/useAuth';

export default function Report() {
    const { user } = useAuth();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const fetchReport = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setReport(null);

        try {
            const res = await getMyReport({
                fecha_inicio: fechaInicio || undefined,
                fecha_fin: fechaFin || undefined,
            });
            setReport(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ─── EXPORTAR CSV ────────────────────────────────
    const exportCSV = () => {
        const rows = [];

        // encabezado
        rows.push(['Compra #', 'Fecha', 'Tipo', 'Producto', 'Cantidad', 'Precio Unitario', 'Subtotal', 'Total Compra']);

        // datos
        report.compras.forEach(compra => {
            compra.detalle.forEach((item, i) => {
                rows.push([
                    i === 0 ? `#${compra.id}` : '',
                    i === 0 ? new Date(compra.fecha).toLocaleDateString('es-GT') : '',
                    i === 0 ? compra.tipo : '',
                    item.nombre,
                    item.cantidad,
                    `Q${parseFloat(item.precio_unitario).toFixed(2)}`,
                    `Q${parseFloat(item.subtotal).toFixed(2)}`,
                    i === 0 ? `Q${parseFloat(compra.total).toFixed(2)}` : '',
                ]);
            });
        });

        // totales
        rows.push([]);
        rows.push(['', '', '', '', '', '', 'TOTAL GASTADO:', `Q${report.totalGastado.toFixed(2)}`]);

        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_compras_${user?.name?.replace(' ', '_')}_${new Date().toLocaleDateString('es-GT')}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // ─── EXPORTAR PDF ────────────────────────────────
    const exportPDF = () => {
        const doc = new jsPDF();

        // header
        doc.setFillColor(8, 14, 26);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(0, 212, 164);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('LevelUp', 14, 18);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(139, 163, 201);
        doc.text('Reporte de Historial de Compras', 14, 28);
        doc.text(`Usuario: ${user?.name}`, 14, 35);

        // filtros aplicados
        doc.setFontSize(9);
        doc.setTextColor(100);
        let filterText = 'Período: Todas las compras';
        if (fechaInicio && fechaFin)
            filterText = `Período: ${new Date(fechaInicio).toLocaleDateString('es-GT')} — ${new Date(fechaFin).toLocaleDateString('es-GT')}`;
        else if (fechaInicio)
            filterText = `Desde: ${new Date(fechaInicio).toLocaleDateString('es-GT')}`;
        else if (fechaFin)
            filterText = `Hasta: ${new Date(fechaFin).toLocaleDateString('es-GT')}`;
        doc.text(filterText, 14, 46);
        doc.text(`Generado el: ${new Date().toLocaleString('es-GT')}`, 14, 51);

        // stats
        doc.setFillColor(22, 32, 53);
        doc.roundedRect(14, 56, 55, 22, 3, 3, 'F');
        doc.roundedRect(77, 56, 55, 22, 3, 3, 'F');
        doc.roundedRect(140, 56, 55, 22, 3, 3, 'F');

        doc.setFontSize(8);
        doc.setTextColor(139, 163, 201);
        doc.text('Total compras', 22, 63);
        doc.text('Total gastado', 85, 63);
        doc.text('Producto favorito', 148, 63);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 212, 164);
        doc.text(String(report.totalCompras), 22, 72);
        doc.text(`Q${report.totalGastado.toFixed(2)}`, 85, 72);
        doc.setFontSize(9);
        doc.text(report.topProducto.substring(0, 18), 148, 72);

        // tabla
        const tableRows = [];
        report.compras.forEach(compra => {
            compra.detalle.forEach((item, i) => {
                tableRows.push([
                    i === 0 ? `#${compra.id}` : '',
                    i === 0 ? new Date(compra.fecha).toLocaleDateString('es-GT') : '',
                    i === 0 ? (compra.tipo === 'en_linea' ? 'En línea' : 'Presencial') : '',
                    item.nombre,
                    item.cantidad,
                    `Q${parseFloat(item.precio_unitario).toFixed(2)}`,
                    `Q${parseFloat(item.subtotal).toFixed(2)}`,
                ]);
            });
        });

        autoTable(doc, {
            startY: 84,
            head: [['Compra #', 'Fecha', 'Tipo', 'Producto', 'Cant.', 'P. Unit.', 'Subtotal']],
            body: tableRows,
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [14, 26, 44],
                textColor: [0, 212, 164],
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [22, 32, 53],
            },
            columnStyles: {
                0: { cellWidth: 18 },
                1: { cellWidth: 25 },
                2: { cellWidth: 22 },
                4: { cellWidth: 12, halign: 'center' },
                5: { cellWidth: 22, halign: 'right' },
                6: { cellWidth: 22, halign: 'right' },
            },
        });

        // total al final
        const finalY = doc.lastAutoTable.finalY + 8;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(0, 212, 164);
        doc.text(`Total gastado: Q${report.totalGastado.toFixed(2)}`, 14, finalY);

        doc.save(`reporte_${user?.name?.replace(' ', '_')}_${new Date().toLocaleDateString('es-GT')}.pdf`);
    };

    return (
        <ClientLayout>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 700 }}>
                📊 Mi reporte de compras
            </h2>

            {/* filtros */}
            <div className="profile-card" style={{ marginBottom: '1.5rem' }}>
                <h3>Filtrar por período</h3>
                <form onSubmit={fetchReport} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ flex: 1, minWidth: '160px' }}>
                        <label style={{ color: 'var(--gray)', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>
                            Desde
                        </label>
                        <input
                            type="date"
                            className="search-input"
                            style={{ width: '100%' }}
                            value={fechaInicio}
                            onChange={e => setFechaInicio(e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: '160px' }}>
                        <label style={{ color: 'var(--gray)', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>
                            Hasta
                        </label>
                        <input
                            type="date"
                            className="search-input"
                            style={{ width: '100%' }}
                            value={fechaFin}
                            onChange={e => setFechaFin(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Generando...' : '📊 Generar reporte'}
                    </button>
                    {report && (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => { setReport(null); setFechaInicio(''); setFechaFin(''); }}
                        >
                            Limpiar
                        </button>
                    )}
                </form>
            </div>

            {/* error */}
            {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

            {/* reporte */}
            {report && (
                <>
                    {/* stats cards */}
                    <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                        {[
                            { label: 'Total compras', value: report.totalCompras, icon: '🛒' },
                            { label: 'Total gastado', value: `Q${report.totalGastado.toFixed(2)}`, icon: '💰' },
                            { label: 'Producto favorito', value: report.topProducto, icon: '⭐' },
                        ].map(stat => (
                            <div key={stat.label} className="stat-card">
                                <div className="stat-card-header">
                                    <span>{stat.label}</span>
                                    <span className="stat-icon">{stat.icon}</span>
                                </div>
                                <h3 style={{ fontSize: stat.label === 'Producto favorito' ? '1rem' : '1.8rem' }}>
                                    {stat.value}
                                </h3>
                            </div>
                        ))}
                    </div>

                    {/* botones exportar */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                        <button className="btn-secondary" onClick={exportCSV}>
                            ⬇ Exportar CSV
                        </button>
                        <button className="btn-primary" onClick={exportPDF}>
                            📄 Exportar PDF
                        </button>
                    </div>

                    {/* tabla */}
                    {report.compras.length === 0 ? (
                        <div className="empty-state">
                            <p>🛒</p>
                            No hay compras en este período
                        </div>
                    ) : (
                        <div className="table-card">
                            <div className="table-header">
                                <h3>Detalle de compras</h3>
                                <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                                    {report.totalCompras} compra{report.totalCompras !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Compra</th>
                                        <th>Fecha</th>
                                        <th>Tipo</th>
                                        <th>Producto</th>
                                        <th>Cant.</th>
                                        <th>P. Unit.</th>
                                        <th>Subtotal</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.compras.map(compra =>
                                        compra.detalle.map((item, i) => (
                                            <tr key={`${compra.id}-${i}`}>
                                                {i === 0 && (
                                                    <td rowSpan={compra.detalle.length}>#{compra.id}</td>
                                                )}
                                                {i === 0 && (
                                                    <td rowSpan={compra.detalle.length}>
                                                        {new Date(compra.fecha).toLocaleDateString('es-GT')}
                                                    </td>
                                                )}
                                                {i === 0 && (
                                                    <td rowSpan={compra.detalle.length}>
                                                        <span className={`badge ${compra.tipo === 'en_linea' ? 'badge-blue' : 'badge-amber'}`}>
                                                            {compra.tipo === 'en_linea' ? 'En línea' : 'Presencial'}
                                                        </span>
                                                    </td>
                                                )}
                                                <td>{item.nombre}</td>
                                                <td style={{ textAlign: 'center' }}>{item.cantidad}</td>
                                                <td>Q{parseFloat(item.precio_unitario).toFixed(2)}</td>
                                                <td>Q{parseFloat(item.subtotal).toFixed(2)}</td>
                                                {i === 0 && (
                                                    <td rowSpan={compra.detalle.length} style={{ color: 'var(--green)', fontWeight: 700 }}>
                                                        Q{parseFloat(compra.total).toFixed(2)}
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'right', color: 'var(--gray)', padding: '0.85rem 1.25rem' }}>
                                            Total gastado:
                                        </td>
                                        <td colSpan={2} style={{ color: 'var(--green)', fontWeight: 700, fontSize: '1.1rem', padding: '0.85rem 1.25rem' }}>
                                            Q{report.totalGastado.toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </>
            )}
        </ClientLayout>
    );
}