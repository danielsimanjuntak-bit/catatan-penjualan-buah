// State data penyimpanan sementara
let daftarPenjualan = [];
let filterStatus = 'semua';

// Jalankan fungsi awal saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Set default input tanggal ke hari ini (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tanggalPenjualan').value = today;

  // Event Listener Otomatis Hitung Total Harga
  document.getElementById('qty').addEventListener('input', hitungTotal);
  document.getElementById('hargaSatuan').addEventListener('input', hitungTotal);

  // Event Listener Submit Form
  document.getElementById('formPenjualan').addEventListener('submit', simpanPenjualan);

  renderTabelPenjualan();
  updateDashboard();
});

// Fungsi menghitung Total Harga secara otomatis
function hitungTotal() {
  const qty = parseFloat(document.getElementById('qty').value) || 0;
  const harga = parseFloat(document.getElementById('hargaSatuan').value) || 0;
  const total = qty * harga;
  document.getElementById('totalHarga').value = `Rp ${total.toLocaleString('id-ID')}`;
}

// Fungsi menyimpan data penjualan baru
function simpanPenjualan(e) {
  e.preventDefault();

  const tanggal = document.getElementById('tanggalPenjualan').value;
  const namaPelanggan = document.getElementById('namaPelanggan').value;
  const noWa = document.getElementById('noWa').value;
  const pilihBuah = document.getElementById('pilihBuah').value;
  const qty = parseFloat(document.getElementById('qty').value);
  const satuan = document.getElementById('satuan').value;
  const hargaSatuan = parseFloat(document.getElementById('hargaSatuan').value);
  const totalHarga = qty * hargaSatuan;
  const statusPembayaran = document.getElementById('statusPembayaran').value;

  const transaksiBaru = {
    id: Date.now(),
    tanggal: tanggal,
    pelanggan: namaPelanggan,
    noWa: noWa,
    buah: pilihBuah,
    qty: qty,
    satuan: satuan,
    hargaSatuan: hargaSatuan,
    totalHarga: totalHarga,
    status: statusPembayaran
  };

  daftarPenjualan.unshift(transaksiBaru);

  // Reset form
  document.getElementById('formPenjualan').reset();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tanggalPenjualan').value = today;
  document.getElementById('totalHarga').value = 'Rp 0';

  renderTabelPenjualan();
  updateDashboard();
}

// Format tanggal standar Indonesia (contoh: 26/09/2026)
function formatTanggal(tanggalString) {
  if (!tanggalString) return '-';
  const parts = tanggalString.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Render data ke tabel
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

// Fungsi mengubah status piutang menjadi Lunas
function ubahStatusLunas(id) {
  const index = daftarPenjualan.findIndex(item => item.id === id);
  if (index !== -1) {
    daftarPenjualan[index].status = 'Lunas';
    renderTabelPenjualan();
    updateDashboard();
  }
}

// Fungsi menghapus data
function hapusPenjualan(id) {
  if (confirm('Yakin ingin menghapus data ini?')) {
    daftarPenjualan = daftarPenjualan.filter(item => item.id !== id);
    renderTabelPenjualan();
    updateDashboard();
  }
}

// Filter riwayat penjualan
function filterPenjualan(status) {
  filterStatus = status;
  renderTabelPenjualan();
}

// Update angka ringkasan dashboard
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