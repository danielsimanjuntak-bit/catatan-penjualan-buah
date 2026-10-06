// ==========================================
// KONFIGURASI GOOGLE SHEETS
// ==========================================

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzBCKE0J7OlwXBIisZxIO9hOYJKUkh_ipyoUqRTUsrYSnncZeWIZQHapgmZRcSHdhhN/exec";


// ==========================================
// FORMAT RUPIAH
// ==========================================

function formatRupiah(angka) {

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(angka || 0);

}


// ==========================================
// BUAT ID TRANSAKSI
// ==========================================

function generateID() {

  const sekarang = new Date();

  const waktu =
    sekarang.getFullYear().toString() +
    String(sekarang.getMonth() + 1).padStart(2, "0") +
    String(sekarang.getDate()).padStart(2, "0") +
    String(sekarang.getHours()).padStart(2, "0") +
    String(sekarang.getMinutes()).padStart(2, "0") +
    String(sekarang.getSeconds()).padStart(2, "0");

  return "PJ-" + waktu;

}


// ==========================================
// HITUNG TOTAL HARGA
// ==========================================

function hitungTotalHarga() {

  const qty =
    parseFloat(document.getElementById("qty").value) || 0;

  const harga =
    parseFloat(document.getElementById("hargaSatuan").value) || 0;

  const total = qty * harga;

  document.getElementById("totalHarga").value =
    formatRupiah(total);

}


// ==========================================
// EVENT INPUT QTY & HARGA
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  const qty =
    document.getElementById("qty");

  const harga =
    document.getElementById("hargaSatuan");

  if (qty) {

    qty.addEventListener(
      "input",
      hitungTotalHarga
    );

  }

  if (harga) {

    harga.addEventListener(
      "input",
      hitungTotalHarga
    );

  }


  // ========================================
  // FORM PENJUALAN
  // ========================================

  const form =
    document.getElementById("formPenjualan");

  if (form) {

    form.addEventListener(
      "submit",
      simpanPenjualan
    );

  }

});


// ==========================================
// SIMPAN PENJUALAN
// ==========================================

async function simpanPenjualan(event) {

  event.preventDefault();


  // Ambil data form

  const tanggal =
    document.getElementById(
      "tanggalPenjualan"
    ).value;

  const pelanggan =
    document.getElementById(
      "namaPelanggan"
    ).value.trim();

  const whatsapp =
    document.getElementById(
      "noWa"
    ).value.trim();

  const buah =
    document.getElementById(
      "pilihBuah"
    ).value;

  const qty =
    parseFloat(
      document.getElementById(
        "qty"
      ).value
    ) || 0;

  const satuan =
    document.getElementById(
      "satuan"
    ).value;

  const hargaSatuan =
    parseFloat(
      document.getElementById(
        "hargaSatuan"
      ).value
    ) || 0;

  const total =
    qty * hargaSatuan;

  const status =
    document.getElementById(
      "statusPembayaran"
    ).value;


  // ========================================
  // VALIDASI
  // ========================================

  if (!tanggal) {

    alert("Tanggal belum diisi.");

    return;

  }

  if (!pelanggan) {

    alert("Nama pelanggan belum diisi.");

    return;

  }

  if (!buah) {

    alert("Silakan pilih buah.");

    return;

  }

  if (qty <= 0) {

    alert("Jumlah / Qty harus lebih dari 0.");

    return;

  }

  if (hargaSatuan < 0) {

    alert("Harga satuan tidak valid.");

    return;

  }


  // ========================================
  // DATA YANG DIKIRIM KE GOOGLE SHEETS
  // ========================================

  const data = {

    action: "penjualan",

    id: generateID(),

    tanggal: tanggal,

    pelanggan: pelanggan,

    whatsapp: whatsapp,

    buah: buah,

    qty: qty,

    satuan: satuan,

    hargaSatuan: hargaSatuan,

    total: total,

    status: status

  };


  // ========================================
  // TOMBOL SIMPAN
  // ========================================

  const tombol =
    event.submitter;

  const teksAwal =
    tombol
      ? tombol.innerHTML
      : "Simpan Penjualan";


  if (tombol) {

    tombol.disabled = true;

    tombol.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>' +
      'Menyimpan...';

  }


  // ========================================
  // KIRIM KE GOOGLE APPS SCRIPT
  // ========================================

  try {

    const response =
      await fetch(
        GOOGLE_SCRIPT_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body: JSON.stringify(data)

        }
      );


    const hasil =
      await response.json();


    // ======================================
    // BERHASIL
    // ======================================

    if (hasil.success) {

      alert(
        "✅ Penjualan berhasil disimpan ke Google Sheets!"
      );


      // Reset form

      document
        .getElementById("formPenjualan")
        .reset();


      // Isi tanggal kembali dengan hari ini

      isiTanggalHariIni();


      // Reset total

      document
        .getElementById("totalHarga")
        .value = "Rp 0";


      // Ambil ulang data

      ambilPenjualan();

    }


    // ======================================
    // GAGAL
    // ======================================

    else {

      alert(
        "❌ Gagal menyimpan:\n" +
        hasil.message
      );

    }


  } catch (error) {

    console.error(error);

    alert(
      "❌ Tidak dapat terhubung ke Google Sheets.\n\n" +
      "Periksa koneksi internet dan URL Apps Script."
    );

  }


  // ========================================
  // KEMBALIKAN TOMBOL
  // ========================================

  if (tombol) {

    tombol.disabled = false;

    tombol.innerHTML =
      teksAwal;

  }

}


// ==========================================
// TANGGAL HARI INI
// ==========================================

function isiTanggalHariIni() {

  const input =
    document.getElementById(
      "tanggalPenjualan"
    );

  if (!input) return;


  const sekarang =
    new Date();

  const tahun =
    sekarang.getFullYear();

  const bulan =
    String(
      sekarang.getMonth() + 1
    ).padStart(2, "0");

  const hari =
    String(
      sekarang.getDate()
    ).padStart(2, "0");


  input.value =
    `${tahun}-${bulan}-${hari}`;

}


// ==========================================
// AMBIL DATA PENJUALAN
// ==========================================

async function ambilPenjualan() {

  try {

    const response =
      await fetch(
        GOOGLE_SCRIPT_URL +
        "?action=getPenjualan"
      );


    const hasil =
      await response.json();


    if (
      hasil.success &&
      Array.isArray(hasil.data)
    ) {

      tampilkanPenjualan(
        hasil.data
      );

      hitungDashboard(
        hasil.data
      );

    }

  } catch (error) {

    console.error(
      "Gagal mengambil data:",
      error
    );

  }

}


// ==========================================
// TAMPILKAN PENJUALAN
// ==========================================

function tampilkanPenjualan(data) {

  const tabel =
    document.getElementById(
      "tabelRiwayatPenjualan"
    );


  if (!tabel) return;


  tabel.innerHTML = "";


  if (data.length === 0) {

    tabel.innerHTML = `
      <tr>
        <td
          colspan="7"
          class="text-center text-muted py-4"
        >
          Belum ada transaksi.
        </td>
      </tr>
    `;

    return;

  }


  data.forEach(function (item) {

    const statusClass =
      item.status === "Lunas"
        ? "status-paid"
        : "status-unpaid";


    const row =
      document.createElement("tr");


    row.innerHTML = `

      <td>
        ${formatTanggal(item.tanggal)}
      </td>

      <td>
        <strong>
          ${escapeHTML(item.pelanggan)}
        </strong>
      </td>

      <td>
        ${escapeHTML(item.buah)}
      </td>

      <td>
        ${item.qty} ${item.satuan}
      </td>

      <td>
        <strong>
          ${formatRupiah(item.total)}
        </strong>
      </td>

      <td>
        <span class="status-badge ${statusClass}">
          ${escapeHTML(item.status)}
        </span>
      </td>

      <td>
        <button
          class="btn btn-sm btn-outline-danger"
          onclick="hapusPenjualan('${item.id}')"
        >
          <i class="bi bi-trash"></i>
        </button>
      </td>

    `;


    tabel.appendChild(row);

  });

}


// ==========================================
// FORMAT TANGGAL
// ==========================================

function formatTanggal(tanggal) {

  if (!tanggal) return "-";


  const parts =
    String(tanggal).split("-");


  if (parts.length !== 3) {

    return tanggal;

  }


  return (
    parts[2] +
    "/" +
    parts[1] +
    "/" +
    parts[0]
  );

}


// ==========================================
// HITUNG DASHBOARD
// ==========================================

function hitungDashboard(data) {

  let totalPenjualan = 0;

  let totalPiutang = 0;


  data.forEach(function (item) {

    const total =
      Number(item.total) || 0;


    totalPenjualan += total;


    if (
      item.status === "Belum Bayar"
    ) {

      totalPiutang += total;

    }

  });


  const penjualanElement =
    document.getElementById(
      "totalPenjualanText"
    );


  const piutangElement =
    document.getElementById(
      "totalPiutangText"
    );


  if (penjualanElement) {

    penjualanElement.innerText =
      formatRupiah(totalPenjualan);

  }


  if (piutangElement) {

    piutangElement.innerText =
      formatRupiah(totalPiutang);

  }

}


// ==========================================
// HAPUS PENJUALAN
// ==========================================

async function hapusPenjualan(id) {

  if (
    !confirm(
      "Yakin ingin menghapus transaksi ini?"
    )
  ) {

    return;

  }


  try {

    const response =
      await fetch(
        GOOGLE_SCRIPT_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body: JSON.stringify({

            action: "hapusPenjualan",

            id: id

          })

        }
      );


    const hasil =
      await response.json();


    if (hasil.success) {

      alert(
        "Transaksi berhasil dihapus."
      );

      ambilPenjualan();

    } else {

      alert(
        "Gagal menghapus transaksi:\n" +
        hasil.message
      );

    }


  } catch (error) {

    console.error(error);

    alert(
      "Terjadi kesalahan saat menghapus transaksi."
    );

  }

}


// ==========================================
// FILTER PENJUALAN
// ==========================================

let semuaDataPenjualan = [];


function filterPenjualan(filter) {

  let data =
    semuaDataPenjualan;


  if (filter === "Lunas") {

    data =
      semuaDataPenjualan.filter(
        item =>
          item.status === "Lunas"
      );

  }


  if (filter === "Belum Bayar") {

    data =
      semuaDataPenjualan.filter(
        item =>
          item.status === "Belum Bayar"
      );

  }


  tampilkanPenjualan(data);

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ==========================================
// LOAD AWAL
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    isiTanggalHariIni();

    ambilPenjualan();

  }
);