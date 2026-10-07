/* =========================================================
   CATATAN BUAH CELINE
   SCRIPT.JS LENGKAP

   MENU:
   1. PRE ORDER
   2. PENJUALAN
   3. BELANJA STOK

   TERHUBUNG KE GOOGLE APPS SCRIPT
   ========================================================= */


/* =========================================================
   1. URL GOOGLE APPS SCRIPT
   ========================================================= */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyy3ZCEy5E5TaGSCLTALIrXyZ0g3-Mg6ZY1CJ-DfGDg3ARpBfvFWJTCn4du_CdhnQUe/exec";


/* =========================================================
   2. DATA GLOBAL
   ========================================================= */

let semuaDataPenjualan = [];
let semuaDataPembelian = [];
let semuaDataPreOrder = [];


/* =========================================================
   3. FORMAT RUPIAH
   ========================================================= */

function formatRupiah(angka) {
  const nilai = Number(angka) || 0;
  return "Rp " + nilai.toLocaleString("id-ID");
}


/* =========================================================
   4. FORMAT TANGGAL
   ========================================================= */

function formatTanggal(tanggal) {
  if (!tanggal) {
    return "-";
  }

  try {
    const d = new Date(tanggal);
    if (isNaN(d.getTime())) {
      return tanggal;
    }

    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  } catch (error) {
    return tanggal;
  }
}


/* =========================================================
   5. TANGGAL HARI INI
   ========================================================= */

function tanggalHariIni() {
  const sekarang = new Date();
  const tahun = sekarang.getFullYear();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const tanggal = String(sekarang.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${tanggal}`;
}


/* =========================================================
   6. ISI TANGGAL HARI INI
   ========================================================= */

function isiTanggalHariIni() {
  const hariIni = tanggalHariIni();

  const tanggalPenjualan = document.getElementById("tanggalPenjualan");
  if (tanggalPenjualan) {
    tanggalPenjualan.value = hariIni;
  }

  const tanggalPembelian = document.getElementById("tanggalPembelian");
  if (tanggalPembelian) {
    tanggalPembelian.value = hariIni;
  }

  const tanggalPO = document.getElementById("tanggalPO");
  if (tanggalPO) {
    tanggalPO.value = hariIni;
  }

  const tanggalDibutuhkan = document.getElementById("tanggalDibutuhkan");
  if (tanggalDibutuhkan && !tanggalDibutuhkan.value) {
    tanggalDibutuhkan.value = hariIni;
  }
}


/* =========================================================
   7. GENERATE ID
   ========================================================= */

function generateID(prefix) {
  const sekarang = new Date();
  const tahun = sekarang.getFullYear();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const tanggal = String(sekarang.getDate()).padStart(2, "0");
  const jam = String(sekarang.getHours()).padStart(2, "0");
  const menit = String(sekarang.getMinutes()).padStart(2, "0");
  const detik = String(sekarang.getSeconds()).padStart(2, "0");
  const random = Math.floor(Math.random() * 900 + 100);

  return `${prefix}-${tahun}${bulan}${tanggal}-${jam}${menit}${detik}-${random}`;
}


/* =========================================================
   8. ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   9. MENU UTAMA
   ========================================================= */

function bukaMenu(menu) {
  const sectionPenjualan = document.getElementById("sectionPenjualan");
  const sectionPembelian = document.getElementById("sectionPembelian");
  const sectionPreOrder = document.getElementById("sectionPreOrder");

  const btnPenjualan = document.getElementById("btnTabPenjualan");
  const btnPembelian = document.getElementById("btnTabPembelian");
  const btnPreOrder = document.getElementById("btnTabPreOrder");

  if (sectionPenjualan) sectionPenjualan.classList.add("section-hidden");
  if (sectionPembelian) sectionPembelian.classList.add("section-hidden");
  if (sectionPreOrder) sectionPreOrder.classList.add("section-hidden");

  if (btnPenjualan) btnPenjualan.classList.remove("active");
  if (btnPembelian) btnPembelian.classList.remove("active");
  if (btnPreOrder) btnPreOrder.classList.remove("active");

  if (menu === "penjualan") {
    if (sectionPenjualan) sectionPenjualan.classList.remove("section-hidden");
    if (btnPenjualan) btnPenjualan.classList.add("active");
  } else if (menu === "pembelian") {
    if (sectionPembelian) sectionPembelian.classList.remove("section-hidden");
    if (btnPembelian) btnPembelian.classList.add("active");
  } else if (menu === "preOrder") {
    if (sectionPreOrder) sectionPreOrder.classList.remove("section-hidden");
    if (btnPreOrder) btnPreOrder.classList.add("active");
  }
}


/* =========================================================
   10. HITUNG TOTAL PENJUALAN
   ========================================================= */

function hitungTotalPenjualanForm() {
  const qtyElement = document.getElementById("qty");
  const hargaElement = document.getElementById("hargaSatuan");
  const totalElement = document.getElementById("totalHarga");

  if (!qtyElement || !hargaElement || !totalElement) return;

  const qty = parseFloat(qtyElement.value) || 0;
  const harga = parseFloat(hargaElement.value) || 0;
  totalElement.value = formatRupiah(qty * harga);
}


/* =========================================================
   11. HITUNG TOTAL PEMBELIAN
   ========================================================= */

function hitungTotalPembelianForm() {
  const qtyElement = document.getElementById("qtyPembelian");
  const hargaElement = document.getElementById("hargaBeli");
  const totalElement = document.getElementById("totalPembelianForm");

  if (!qtyElement || !hargaElement || !totalElement) return;

  const qty = parseFloat(qtyElement.value) || 0;
  const harga = parseFloat(hargaElement.value) || 0;
  totalElement.value = formatRupiah(qty * harga);
}


/* =========================================================
   12. HITUNG TOTAL PRE ORDER
   ========================================================= */

function hitungTotalPreOrderForm() {
  const qtyElement = document.getElementById("qtyPreOrder");
  const hargaElement = document.getElementById("hargaPreOrder");
  const totalElement = document.getElementById("totalPreOrder");

  if (!qtyElement || !hargaElement || !totalElement) return;

  const qty = parseFloat(qtyElement.value) || 0;
  const harga = parseFloat(hargaElement.value) || 0;
  totalElement.value = formatRupiah(qty * harga);
}


/* =========================================================
   13. SIMPAN PENJUALAN
   ========================================================= */

async function simpanPenjualan(event) {
  event.preventDefault();

  const tanggal = document.getElementById("tanggalPenjualan").value;
  const pelanggan = document.getElementById("namaPelanggan").value.trim();
  const whatsapp = document.getElementById("noWa").value.trim();
  const buah = document.getElementById("pilihBuah").value;
  const qty = parseFloat(document.getElementById("qty").value) || 0;
  const satuan = document.getElementById("satuan").value;
  const hargaSatuan = parseFloat(document.getElementById("hargaSatuan").value) || 0;
  const total = qty * hargaSatuan;
  const status = document.getElementById("statusPembayaran").value;
  const catatan = document.getElementById("catatanPenjualan").value.trim();

  if (!tanggal || !pelanggan || !buah || qty <= 0 || !satuan || hargaSatuan <= 0) {
    alert("Mohon lengkapi seluruh data penjualan dengan benar.");
    return;
  }

  const data = {
    action: "penjualan",
    id: generateID("PJ"),
    tanggal,
    pelanggan,
    whatsapp,
    buah,
    qty,
    satuan,
    hargaSatuan,
    total,
    status,
    catatan
  };

  try {
    const response = await kirimData(data);
    if (response.success) {
      alert("✅ Penjualan berhasil disimpan.");
      const form = document.getElementById("formPenjualan");
      if (form) form.reset();
      isiTanggalHariIni();
      const totalElement = document.getElementById("totalHarga");
      if (totalElement) totalElement.value = "Rp 0";
      await ambilSemuaData();
    } else {
      alert("❌ Gagal menyimpan Penjualan:\n" + response.message);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Terjadi kesalahan saat menyimpan Penjualan:\n" + error.message);
  }
}


/* =========================================================
   14. SIMPAN PEMBELIAN / BELANJA STOK
   ========================================================= */

async function simpanPembelian(event) {
  event.preventDefault();

  const tanggal = document.getElementById("tanggalPembelian").value;
  const supplier = document.getElementById("namaSupplier").value.trim();
  const buah = document.getElementById("pilihBuahPembelian").value;
  const qty = parseFloat(document.getElementById("qtyPembelian").value) || 0;
  const satuan = document.getElementById("satuanPembelian").value;
  const hargaBeli = parseFloat(document.getElementById("hargaBeli").value) || 0;
  const total = qty * hargaBeli;
  const status = document.getElementById("statusPembelian").value;
  const catatan = document.getElementById("catatanPembelian").value.trim();

  if (!tanggal || !supplier || !buah || qty <= 0 || !satuan || hargaBeli <= 0) {
    alert("Mohon lengkapi seluruh data pembelian dengan benar.");
    return;
  }

  const data = {
    action: "pembelian",
    id: generateID("PB"),
    tanggal,
    supplier,
    buah,
    qty,
    satuan,
    hargaBeli,
    total,
    status,
    catatan
  };

  try {
    const response = await kirimData(data);
    if (response.success) {
      alert("✅ Belanja stok berhasil disimpan.");
      const form = document.getElementById("formPembelian");
      if (form) form.reset();
      isiTanggalHariIni();
      const totalElement = document.getElementById("totalPembelianForm");
      if (totalElement) totalElement.value = "Rp 0";
      await ambilSemuaData();
    } else {
      alert("❌ Gagal menyimpan Belanja Stok:\n" + response.message);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Terjadi kesalahan saat menyimpan Belanja Stok:\n" + error.message);
  }
}


/* =========================================================
   15. SIMPAN PRE ORDER
   ========================================================= */

async function simpanPreOrder(event) {
  event.preventDefault();

  const tanggalPO = document.getElementById("tanggalPO").value;
  const tanggalDibutuhkan = document.getElementById("tanggalDibutuhkan").value;
  const pelanggan = document.getElementById("namaPelangganPO").value.trim();
  const whatsapp = document.getElementById("noWaPO").value.trim();
  const buah = document.getElementById("pilihBuahPO").value;
  const qty = parseFloat(document.getElementById("qtyPreOrder").value) || 0;
  const satuan = document.getElementById("satuanPreOrder").value;
  const hargaSatuan = parseFloat(document.getElementById("hargaPreOrder").value) || 0;
  const total = qty * hargaSatuan;
  const status = document.getElementById("statusPreOrder").value;
  const catatan = document.getElementById("catatanPreOrder").value.trim();

  if (!tanggalPO || !tanggalDibutuhkan || !pelanggan || !buah || qty <= 0 || !satuan || hargaSatuan <= 0) {
    alert("Mohon lengkapi seluruh data Pre Order dengan benar.");
    return;
  }

  if (tanggalDibutuhkan < tanggalPO) {
    alert("Tanggal dibutuhkan tidak boleh sebelum tanggal PO.");
    return;
  }

  const data = {
    action: "preOrder",
    id: generateID("PO"),
    tanggalPO,
    tanggalDibutuhkan,
    pelanggan,
    whatsapp,
    buah,
    qty,
    satuan,
    hargaSatuan,
    total,
    status,
    catatan
  };

  try {
    const response = await kirimData(data);
    if (response.success) {
      alert("✅ Pre Order berhasil disimpan.");
      const form = document.getElementById("formPreOrder");
      if (form) form.reset();
      isiTanggalHariIni();
      const totalElement = document.getElementById("totalPreOrder");
      if (totalElement) totalElement.value = "Rp 0";
      await ambilSemuaData();
    } else {
      alert("❌ Gagal menyimpan Pre Order:\n" + response.message);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Terjadi kesalahan saat menyimpan Pre Order:\n" + error.message);
  }
}


/* =========================================================
   16. KIRIM DATA KE GOOGLE APPS SCRIPT
   ========================================================= */

async function kirimData(data) {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("HTTP Error " + response.status);
  }

  const text = await response.text();
  let result;

  try {
    result = JSON.parse(text);
  } catch (error) {
    throw new Error("Response Google Apps Script bukan JSON yang valid.\n\n" + text.substring(0, 500));
  }

  return result;
}


/* =========================================================
   17. AMBIL SEMUA DATA
   ========================================================= */

async function ambilSemuaData() {
  try {
    await Promise.all([
      ambilPenjualan(),
      ambilPembelian(),
      ambilPreOrder()
    ]);
    hitungDashboard();
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
}


/* =========================================================
   18. AMBIL DATA PENJUALAN
   ========================================================= */

async function ambilPenjualan() {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL + "?action=getPenjualan");
    const result = await response.json();

    if (result.success) {
      semuaDataPenjualan = Array.isArray(result.data) ? result.data : [];
      renderPenjualan();
    } else {
      console.error("Gagal mengambil Penjualan:", result.message);
    }
  } catch (error) {
    console.error("Error Penjualan:", error);
  }
}


/* =========================================================
   19. AMBIL DATA PEMBELIAN
   ========================================================= */

async function ambilPembelian() {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL + "?action=getPembelian");
    const result = await response.json();

    if (result.success) {
      semuaDataPembelian = Array.isArray(result.data) ? result.data : [];
      renderPembelian();
    } else {
      console.error("Gagal mengambil Pembelian:", result.message);
    }
  } catch (error) {
    console.error("Error Pembelian:", error);
  }
}


/* =========================================================
   20. AMBIL DATA PRE ORDER
   ========================================================= */

async function ambilPreOrder() {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL + "?action=getPreOrder");
    const result = await response.json();

    if (result.success) {
      semuaDataPreOrder = Array.isArray(result.data) ? result.data : [];
      renderPreOrder();
    } else {
      console.error("Gagal mengambil Pre Order:", result.message);
    }
  } catch (error) {
    console.error("Error Pre Order:", error);
  }
}


/* =========================================================
   21. STATUS PENJUALAN
   ========================================================= */

function badgeStatusPenjualan(status) {
  if (status === "Lunas") {
    return `<span class="status-badge status-paid">Lunas</span>`;
  }
  return `<span class="status-badge status-unpaid">Belum Bayar</span>`;
}


/* =========================================================
   22. STATUS PEMBELIAN
   ========================================================= */

function badgeStatusPembelian(status) {
  if (status === "Sudah Dibayar") {
    return `<span class="status-badge status-paid">Sudah Dibayar</span>`;
  }
  return `<span class="status-badge status-unpaid">Belum Dibayar</span>`;
}


/* =========================================================
   23. STATUS PRE ORDER
   ========================================================= */

function badgeStatusPreOrder(status) {
  if (status === "Menunggu") {
    return `<span class="status-badge status-process">Menunggu</span>`;
  }
  if (status === "Diproses") {
    return `<span class="status-badge status-process">Diproses</span>`;
  }
  if (status === "Siap Diambil") {
    return `<span class="status-badge status-ready">Siap Diambil</span>`;
  }
  if (status === "Sudah Diambil") {
    return `<span class="status-badge status-paid">Sudah Diambil</span>`;
  }
  if (status === "Dibatalkan") {
    return `<span class="status-badge status-cancel">Dibatalkan</span>`;
  }
  return `<span class="status-badge status-process">${escapeHTML(status)}</span>`;
}


/* =========================================================
   24. RENDER PENJUALAN
   ========================================================= */

function renderPenjualan(data = semuaDataPenjualan) {
  const tbody = document.getElementById("tabelRiwayatPenjualan");
  const mobile = document.getElementById("tabelRiwayatPenjualanMobile");

  if (!tbody || !mobile) return;

  tbody.innerHTML = "";
  mobile.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">Belum ada data penjualan.</div></td></tr>`;
    mobile.innerHTML = `<div class="empty-state">Belum ada data penjualan.</div>`;
    return;
  }

  data.forEach(function(item) {
    const id = item.id || "";
    const tanggal = item.tanggal || "";
    const pelanggan = item.pelanggan || "";
    const buah = item.buah || "";
    const qty = item.qty || 0;
    const satuan = item.satuan || "";
    const total = Number(item.total) || 0;
    const status = item.status || "";

    /* DESKTOP */
    tbody.innerHTML += `
      <tr>
        <td>${escapeHTML(formatTanggal(tanggal))}</td>
        <td>${escapeHTML(pelanggan)}</td>
        <td>${escapeHTML(buah)}</td>
        <td>${escapeHTML(qty)} ${escapeHTML(satuan)}</td>
        <td><strong>${formatRupiah(total)}</strong></td>
        <td>${badgeStatusPenjualan(status)}</td>
        <td>
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="hapusPenjualan('${escapeHTML(id)}')">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;

    /* MOBILE */
    mobile.innerHTML += `
      <div class="mobile-history-card">
        <div class="row">
          <div class="col-6">
            <div class="label">Tanggal</div>
            <div class="value">${escapeHTML(formatTanggal(tanggal))}</div>
          </div>
          <div class="col-6">
            <div class="label">Pelanggan</div>
            <div class="value">${escapeHTML(pelanggan)}</div>
          </div>
          <div class="col-6">
            <div class="label">Buah</div>
            <div class="value">${escapeHTML(buah)}</div>
          </div>
          <div class="col-6">
            <div class="label">Qty</div>
            <div class="value">${escapeHTML(qty)} ${escapeHTML(satuan)}</div>
          </div>
          <div class="col-12">
            <div class="label">Total</div>
            <div class="value">${formatRupiah(total)}</div>
          </div>
          <div class="col-8">
            <div class="label">Status</div>
            <div class="value">${badgeStatusPenjualan(status)}</div>
          </div>
          <div class="col-4 text-end">
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="hapusPenjualan('${escapeHTML(id)}')">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
}


/* =========================================================
   25. RENDER PEMBELIAN
   ========================================================= */

function renderPembelian(data = semuaDataPembelian) {
  const tbody = document.getElementById("tabelRiwayatPembelian");
  const mobile = document.getElementById("tabelRiwayatPembelianMobile");

  if (!tbody || !mobile) return;

  tbody.innerHTML = "";
  mobile.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">Belum ada data pembelian.</div></td></tr>`;
    mobile.innerHTML = `<div class="empty-state">Belum ada data pembelian.</div>`;
    return;
  }

  data.forEach(function(item) {
    const id = item.id || "";
    const tanggal = item.tanggal || "";
    const supplier = item.supplier || "";
    const buah = item.buah || "";
    const qty = item.qty || 0;
    const satuan = item.satuan || "";
    const total = Number(item.total) || 0;
    const status = item.status || "";

    /* DESKTOP */
    tbody.innerHTML += `
      <tr>
        <td>${escapeHTML(formatTanggal(tanggal))}</td>
        <td>${escapeHTML(supplier)}</td>
        <td>${escapeHTML(buah)}</td>
        <td>${escapeHTML(qty)} ${escapeHTML(satuan)}</td>
        <td><strong>${formatRupiah(total)}</strong></td>
        <td>${badgeStatusPembelian(status)}</td>
        <td>
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="hapusPembelian('${escapeHTML(id)}')">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;

    /* MOBILE */
    mobile.innerHTML += `
      <div class="mobile-history-card">
        <div class="row">
          <div class="col-6">
            <div class="label">Tanggal</div>
            <div class="value">${escapeHTML(formatTanggal(tanggal))}</div>
          </div>
          <div class="col-6">
            <div class="label">Supplier</div>
            <div class="value">${escapeHTML(supplier)}</div>
          </div>
          <div class="col-6">
            <div class="label">Buah</div>
            <div class="value">${escapeHTML(buah)}</div>
          </div>
          <div class="col-6">
            <div class="label">Qty</div>
            <div class="value">${escapeHTML(qty)} ${escapeHTML(satuan)}</div>
          </div>
          <div class="col-12">
            <div class="label">Total</div>
            <div class="value">${formatRupiah(total)}</div>
          </div>
          <div class="col-8">
            <div class="label">Status</div>
            <div class="value">${badgeStatusPembelian(status)}</div>
          </div>
          <div class="col-4 text-end">
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="hapusPembelian('${escapeHTML(id)}')">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
}


/* =========================================================
   26. RENDER PRE ORDER (DILENGKAPI TOMBOL KONVERSI)
   ========================================================= */

function renderPreOrder(data = semuaDataPreOrder) {
  const tbody = document.getElementById("tabelRiwayatPreOrder");
  const mobile = document.getElementById("tabelRiwayatPreOrderMobile");

  if (!tbody || !mobile) return;

  tbody.innerHTML = "";
  mobile.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state">Belum ada data Pre Order.</div></td></tr>`;
    mobile.innerHTML = `<div class="empty-state">Belum ada data Pre Order.</div>`;
    return;
  }

  data.forEach(function(item) {
    const id = item.id || "";
    const tanggalPO = item.tanggalPO || "";
    const tanggalDibutuhkan = item.tanggalDibutuhkan || "";
    const pelanggan = item.pelanggan || "";
    const buah = item.buah || "";
    const qty = item.qty || 0;
    const satuan = item.satuan || "";
    const total = Number(item.total) || 0;
    const status = item.status || "";

    // Cek apakah PO sudah diproses ke penjualan
    const isSudahDiambil = status.toLowerCase() === "sudah diambil";

    const tombolAksi = isSudahDiambil ? `
      <span class="badge bg-secondary text-white p-2">Sudah Diproses</span>
      <button type="button" class="btn btn-sm btn-outline-danger ms-1" title="Hapus" onclick="hapusPreOrder('${escapeHTML(id)}')">
        <i class="bi bi-trash"></i>
      </button>
    ` : `
      <button type="button" class="btn btn-sm btn-success me-1" title="Jadikan Penjualan" onclick="prosesKonversiPreOrder('${escapeHTML(id)}')">
        <i class="bi bi-cart-check"></i> Jadikan Penjualan
      </button>
      <button type="button" class="btn btn-sm btn-outline-danger" title="Hapus" onclick="hapusPreOrder('${escapeHTML(id)}')">
        <i class="bi bi-trash"></i>
      </button>
    `;

    /* DESKTOP */
    tbody.innerHTML += `
      <tr>
        <td>${escapeHTML(formatTanggal(tanggalPO))}</td>
        <td>${escapeHTML(formatTanggal(tanggalDibutuhkan))}</td>
        <td>${escapeHTML(pelanggan)}</td>
        <td>${escapeHTML(buah)}</td>
        <td>${escapeHTML(qty)} ${escapeHTML(satuan)}</td>
        <td><strong>${formatRupiah(total)}</strong></td>
        <td>${badgeStatusPreOrder(status)}</td>
        <td>${tombolAksi}</td>
      </tr>
    `;

    /* MOBILE */
    mobile.innerHTML += `
      <div class="mobile-history-card">
        <div class="row">
          <div class="col-6">
            <div class="label">Tanggal PO</div>
            <div class="value">${escapeHTML(formatTanggal(tanggalPO))}</div>
          </div>
          <div class="col-6">
            <div class="label">Dibutuhkan</div>
            <div class="value">${escapeHTML(formatTanggal(tanggalDibutuhkan))}</div>
          </div>
          <div class="col-12">
            <div class="label">Pelanggan</div>
            <div class="value">${escapeHTML(pelanggan)}</div>
          </div>
          <div class="col-6">
            <div class="label">Buah</div>
            <div class="value">${escapeHTML(buah)}</div>
          </div>
          <div class="col-6">
            <div class="label">Qty</div>
            <div class="value">${escapeHTML(qty)} ${escapeHTML(satuan)}</div>
          </div>
          <div class="col-12">
            <div class="label">Total</div>
            <div class="value">${formatRupiah(total)}</div>
          </div>
          <div class="col-6">
            <div class="label">Status</div>
            <div class="value">${badgeStatusPreOrder(status)}</div>
          </div>
          <div class="col-6 text-end d-flex justify-content-end align-items-center">
            ${tombolAksi}
          </div>
        </div>
      </div>
    `;
  });
}


/* =========================================================
   27. KONVERSI PRE ORDER KE PENJUALAN (FITUR BARU)
   ========================================================= */

async function prosesKonversiPreOrder(id) {
  if (!id) {
    alert("ID Pre Order tidak ditemukan.");
    return;
  }

  const pilihan = confirm("Pilih status pembayaran untuk penjualan ini:\n\nKlik OK jika 'Lunas'\nKlik Cancel jika 'Belum Bayar'");
  const statusPenjualan = pilihan ? "Lunas" : "Belum Bayar";

  try {
    const response = await kirimData({
      action: "konversiPreOrder",
      id: id,
      statusPenjualan: statusPenjualan
    });

    if (response.success) {
      alert("✅ Pre Order berhasil dijadikan Penjualan!");
      await ambilSemuaData();
    } else {
      alert("❌ Gagal memproses Pre Order:\n" + response.message);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Terjadi kesalahan:\n" + error.message);
  }
}


/* =========================================================
   28. FILTER PENJUALAN
   ========================================================= */

function filterPenjualan(status) {
  if (!status || status === "Semua") {
    renderPenjualan(semuaDataPenjualan);
    return;
  }

  const hasil = semuaDataPenjualan.filter(item => item.status === status);
  renderPenjualan(hasil);
}


/* =========================================================
   29. HAPUS PENJUALAN
   ========================================================= */

async function hapusPenjualan(id) {
  if (!id) {
    alert("ID Penjualan tidak ditemukan.");
    return;
  }

  if (!confirm("Yakin ingin menghapus transaksi penjualan ini?")) return;

  try {
    const response = await kirimData({ action: "hapusPenjualan", id: id });
    if (response.success) {
      alert("✅ Penjualan berhasil dihapus.");
      await ambilSemuaData();
    } else {
      alert("❌ Gagal menghapus Penjualan:\n" + response.message);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Terjadi kesalahan:\n" + error.message);
  }
}


/* =========================================================
   30. HAPUS PEMBELIAN
   ========================================================= */

async function hapusPembelian(id) {
  if (!id) {
    alert("ID Pembelian tidak ditemukan.");
    return;
  }

  if (!confirm("Yakin ingin menghapus transaksi belanja stok ini?")) return;

  try {
    const response = await kirimData({ action: "hapusPembelian", id: id });
    if (response.success) {
      alert("✅ Belanja stok berhasil dihapus.");
      await ambilSemuaData();
    } else {
      alert("❌ Gagal menghapus Belanja Stok:\n" + response.message);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Terjadi kesalahan:\n" + error.message);
  }
}


/* =========================================================
   31. HAPUS PRE ORDER
   ========================================================= */

async function hapusPreOrder(id) {
  if (!id) {
    alert("ID Pre Order tidak ditemukan.");
    return;
  }

  if (!confirm("Yakin ingin menghapus Pre Order ini?")) return;

  try {
    const response = await kirimData({ action: "hapusPreOrder", id: id });
    if (response.success) {
      alert("✅ Pre Order berhasil dihapus.");
      await ambilSemuaData();
    } else {
      alert("❌ Gagal menghapus Pre Order:\n" + response.message);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Terjadi kesalahan:\n" + error.message);
  }
}


/* =========================================================
   32. DASHBOARD
   ========================================================= */

function hitungDashboard() {
  let totalPenjualan = 0;
  let totalPembelian = 0;
  let totalPiutang = 0;

  semuaDataPenjualan.forEach(item => {
    const total = Number(item.total) || 0;
    totalPenjualan += total;
    if (item.status === "Belum Bayar") {
      totalPiutang += total;
    }
  });

  semuaDataPembelian.forEach(item => {
    totalPembelian += Number(item.total) || 0;
  });

  const keuntungan = totalPenjualan - totalPembelian;

  const totalPenjualanText = document.getElementById("totalPenjualanText");
  if (totalPenjualanText) totalPenjualanText.textContent = formatRupiah(totalPenjualan);

  const totalPembelianText = document.getElementById("totalPembelianText");
  if (totalPembelianText) totalPembelianText.textContent = formatRupiah(totalPembelian);

  const totalPiutangText = document.getElementById("totalPiutangText");
  if (totalPiutangText) totalPiutangText.textContent = formatRupiah(totalPiutang);

  const totalKeuntunganText = document.getElementById("totalKeuntunganText");
  if (totalKeuntunganText) totalKeuntunganText.textContent = formatRupiah(keuntungan);
}


/* =========================================================
   33. PASANG EVENT LISTENER
   ========================================================= */

function pasangEventListener() {
  const formPenjualan = document.getElementById("formPenjualan");
  if (formPenjualan) formPenjualan.addEventListener("submit", simpanPenjualan);

  const formPembelian = document.getElementById("formPembelian");
  if (formPembelian) formPembelian.addEventListener("submit", simpanPembelian);

  const formPreOrder = document.getElementById("formPreOrder");
  if (formPreOrder) formPreOrder.addEventListener("submit", simpanPreOrder);

  // Auto Calc Forms
  const qty = document.getElementById("qty");
  const hargaSatuan = document.getElementById("hargaSatuan");
  if (qty) qty.addEventListener("input", hitungTotalPenjualanForm);
  if (hargaSatuan) hargaSatuan.addEventListener("input", hitungTotalPenjualanForm);

  const qtyPembelian = document.getElementById("qtyPembelian");
  const hargaBeli = document.getElementById("hargaBeli");
  if (qtyPembelian) qtyPembelian.addEventListener("input", hitungTotalPembelianForm);
  if (hargaBeli) hargaBeli.addEventListener("input", hitungTotalPembelianForm);

  const qtyPreOrder = document.getElementById("qtyPreOrder");
  const hargaPreOrder = document.getElementById("hargaPreOrder");
  if (qtyPreOrder) qtyPreOrder.addEventListener("input", hitungTotalPreOrderForm);
  if (hargaPreOrder) hargaPreOrder.addEventListener("input", hitungTotalPreOrderForm);
}


/* =========================================================
   34. SAAT WEBSITE SELESAI DIMUAT
   ========================================================= */

document.addEventListener("DOMContentLoaded", async function() {
  console.log("Catatan Buah Celine siap.");

  pasangEventListener();
  isiTanggalHariIni();
  bukaMenu("penjualan");
  await ambilSemuaData();
});