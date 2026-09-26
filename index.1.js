// Gantilah baris pertama ini dengan URL yang disalin
const SCRIPT_URL = 'const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7r8rX8_Dax-NOZSTY2oFsgtV5vX75dQ_TslFtr5IbMjzRA6CIw63faa4PQ-XRhnbv/exec'

let daftarPenjualan = [];
let filterStatus = 'semua';

document.addEventListener('DOMContentLoaded', () => {
  // Set default tanggal hari ini (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tanggalPenjualan').value = today;

  // Event Listener Hitung Total
  document.getElementById('qty').addEventListener('input', hitungTotal);
  document.getElementById('hargaSatuan').addEventListener('input', hitungTotal);

  // Event Listener Submit
  document.getElementById('formPenjualan').addEventListener('submit', simpanPenjualan);

  renderTabelPenjualan();
  updateDashboard();
});

function hitungTotal() {
  const qty = parseFloat(document.getElementById('qty').value) || 0;
  const harga = parseFloat(document.getElementById('hargaSatuan').value) || 0;
  const total = qty * harga;
  document.getElementById('totalHarga').value = `Rp ${total.toLocaleString('id-ID')}`;
}

async function simpanPenjualan(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerText;
  
  submitBtn.innerText = 'Menyimpan ke Google Sheets...';
  submitBtn.disabled = true;

  const dataTransaksi = {
    tipe: 'penjualan',
    tanggal: document.getElementById('tanggalPenjualan').value,
    pelanggan: document.getElementById('namaPelanggan').value,
    noWa: document.getElementById('noWa').value,
    buah: document.getElementById('pilihBuah').value,
    qty: parseFloat(document.getElementById('qty').value),
    satuan: document.getElementById('satuan').value,
    hargaSatuan: parseFloat(document.getElementById('hargaSatuan').value),
    totalHarga: parseFloat(document.getElementById('qty').value) * parseFloat(document.getElementById('hargaSatuan').value),
    status: document.getElementById('statusPembayaran').value
  };

  try {
    // Kirim data ke Google Sheets
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataTransaksi)
    });

    // Simpan ke tampilan lokal
    daftarPenjualan.unshift({ id: Date.now(), ...dataTransaksi });

    // Reset Form
    document.getElementById('formPenjualan').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggalPenjualan').value = today;
    document.getElementById('totalHarga').value = 'Rp 0';

    renderTabelPenjualan();
    updateDashboard();
    alert('Data berhasil disimpan ke Google Sheets!');
  } catch (error) {
    console.error('Gagal menyimpan data:', error);
    alert('Gagal terhubung ke Google Sheets.');
  } finally {
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
  }
}

function formatTanggal(tanggalString) {
  if (!tanggalString) return '-';
  const parts = tanggalString.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function renderTabelPenjualan() {
  const tbody = document.getElementById('tabelRiwayatPenjualan');
  tbody.innerHTML = '';

  const filteredData = daftarPenjualan.filter(item => {
    if (filterStatus === 'semua') return true;
    return item.status === filterStatus;
  });

  if (filteredData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">Belum ada data penjualan</td></tr>`;
    return;
  }

  filteredData.forEach(item => {
    const isLunas = item.status === 'Lunas';
    const badgeClass = isLunas ? 'bg-success' : 'bg-warning text-dark';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${formatTanggal(item.tanggal)}</strong></td>
      <td>${item.pelanggan} ${item.noWa ? `<br><small class="text-muted">${item.noWa}</small>` : ''}</td>
      <td>${item.buah}</td>
      <td>${item.qty} ${item.satuan}</td>
      <td>Rp ${item.totalHarga.toLocaleString('id-ID')}</td>
      <td><span class="badge ${badgeClass}">${item.status}</span></td>
      <td>
        ${!isLunas ? `<button class="btn btn-sm btn-outline-success me-1" onclick="ubahStatusLunas(${item.id})">Tandai Lunas</button>` : ''}
        <button class="btn btn-sm btn-outline-danger" onclick="hapusPenjualan(${item.id})">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function ubahStatusLunas(id) {
  const index = daftarPenjualan.findIndex(item => item.id === id);
  if (index !== -1) {
    daftarPenjualan[index].status = 'Lunas';
    renderTabelPenjualan();
    updateDashboard();
  }
}

function hapusPenjualan(id) {
  if (confirm('Yakin ingin menghapus data dari tampilan ini?')) {
    daftarPenjualan = daftarPenjualan.filter(item => item.id !== id);
    renderTabelPenjualan();
    updateDashboard();
  }
}

function filterPenjualan(status) {
  filterStatus = status;
  renderTabelPenjualan();
}

function updateDashboard() {
  const totalPenjualan = daftarPenjualan
    .filter(i => i.status === 'Lunas')
    .reduce((acc, curr) => acc + curr.totalHarga, 0);

  const totalPiutang = daftarPenjualan
    .filter(i => i.status === 'Belum Bayar')
    .reduce((acc, curr) => acc + curr.totalHarga, 0);

  document.getElementById('totalPenjualanText').innerText = `Rp ${totalPenjualan.toLocaleString('id-ID')}`;
  document.getElementById('totalPiutangText').innerText = `Rp ${totalPiutang.toLocaleString('id-ID')}`;
  document.getElementById('estimasiKeuntunganText').innerText = `Rp ${totalPenjualan.toLocaleString('id-ID')}`;
}