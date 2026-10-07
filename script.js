// ===== PENGATURAN (ubah bagian ini) =====
// Nomor WhatsApp kamu: pakai kode negara 62, tanpa 0 di depan, tanpa + atau spasi.
// Contoh: 0812-3456-7890 menjadi 6281234567890
const NOMOR_WA = "6285702421574";
const NAMA_TOKO = "PromoKelas";

// ===== DAFTAR PRODUK (ubah sesuai produkmu) =====
// harga = harga promo, hargaAsli = harga coret (isi 0 kalau tidak ada diskon)
const produk = [
  { id: 1, nama: "Teh Tarik Original", kat: "Teh Tarik", ikon: "🧋", gambar: "teh-tarik-original.svg", warna: "#f3c98f", harga: 7000, hargaAsli: 8000, desk: "Teh tarik klasik dengan susu, manis dan creamy." },

  // ===== DESERT =====
  { id: 2, nama: "Desert Cokelat", kat: "Desert", ikon: "🍫", gambar: "desert-cokelat.svg", warna: "#d7b8a0", harga: 10000, hargaAsli: 11000, desk: "Desert lembut rasa cokelat, manis dan legit." },
  { id: 3, nama: "Desert Strawberry", kat: "Desert", ikon: "🍓", gambar: "desert-strawberry.svg", warna: "#f9c5d1", harga: 10000, hargaAsli: 11000, desk: "Desert segar rasa strawberry, manis dengan sedikit asam." },
  { id: 4, nama: "Desert Vanilla", kat: "Desert", ikon: "🍮", gambar: "desert-vanilla.svg", warna: "#fbe8b5", harga: 10000, hargaAsli: 11000, desk: "Desert creamy rasa vanilla, lembut di mulut." },
  { id: 5, nama: "Desert Matcha", kat: "Desert", ikon: "🍵", gambar: "desert-matcha.svg", warna: "#c9e0b5", harga: 10000, hargaAsli: 12000, desk: "Desert rasa matcha, sedikit pahit dan wangi." },
  { id: 6, nama: "Desert Mangga", kat: "Desert", ikon: "🥭", gambar: "desert-mangga.svg", warna: "#ffd98a", harga: 10000, hargaAsli: 12000, desk: "Desert rasa mangga, manis segar dan harum." }
];

// ===== STATE & ELEMEN =====
const keranjang = {};
let kategoriAktif = "Semua";
const $ = (id) => document.getElementById(id);
const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");

// ===== FILTER KATEGORI =====
function tampilkanFilter() {
  const daftar = ["Semua", ...new Set(produk.map((p) => p.kat))];
  $("filters").innerHTML = daftar.length <= 2 ? "" : daftar.map((k) =>
    `<button class="${k === kategoriAktif ? "active" : ""}" data-kat="${k}">${k}</button>`).join("");
}

// ===== PRODUK =====
function tampilkanProduk() {
  const tampil = produk.filter((p) => kategoriAktif === "Semua" || p.kat === kategoriAktif);
  $("productGrid").innerHTML = tampil.map((p) => {
    const diskon = p.hargaAsli ? Math.round((1 - p.harga / p.hargaAsli) * 100) : 0;
    return `
      <article class="card">
        <div class="card-img" style="background:${p.warna}">
          ${diskon ? `<span class="badge">HEMAT ${diskon}%</span>` : ""}${p.gambar
            ? `<img src="${p.gambar}" alt="${p.nama}" loading="lazy" onerror="this.remove()">`
            : (p.ikon || "")}
        </div>
        <div class="card-body">
          <span class="cat">${p.kat}</span>
          <h3>${p.nama}</h3>
          <p>${p.desk}</p>
          ${p.hargaAsli ? `<span class="old">${rupiah(p.hargaAsli)}</span>` : ""}
          <span class="price">${rupiah(p.harga)}</span>
          <button class="btn" data-id="${p.id}">Tambah ke keranjang</button>
        </div>
      </article>`;
  }).join("");
}

// ===== KERANJANG =====
function ubahJumlah(id, delta) {
  keranjang[id] = (keranjang[id] || 0) + delta;
  if (keranjang[id] <= 0) delete keranjang[id];
  tampilkanKeranjang();
}

function tampilkanKeranjang() {
  const ids = Object.keys(keranjang);
  let total = 0, jumlah = 0;
  $("cartList").innerHTML = ids.length === 0
    ? '<li class="empty">Keranjang masih kosong. Pilih produk dulu.</li>'
    : ids.map((id) => {
        const p = produk.find((x) => x.id == id);
        total += p.harga * keranjang[id];
        jumlah += keranjang[id];
        return `<li>
          <div>${p.ikon || ""} ${p.nama}<small>${rupiah(p.harga)} x ${keranjang[id]}</small></div>
          <div class="qty">
            <button data-aksi="kurang" data-id="${id}" aria-label="Kurangi">-</button>
            <span>${keranjang[id]}</span>
            <button data-aksi="tambah" data-id="${id}" aria-label="Tambah">+</button>
          </div></li>`;
      }).join("");
  $("cartCount").textContent = jumlah;
  $("cartTotal").textContent = rupiah(total);
}

function bukaKeranjang(buka) {
  $("drawer").classList.toggle("open", buka);
  $("overlay").classList.toggle("show", buka);
  $("drawer").setAttribute("aria-hidden", !buka);
}

function tampilToast(teks) {
  const t = $("toast");
  t.textContent = teks;
  t.classList.add("show");
  clearTimeout(tampilToast.w);
  tampilToast.w = setTimeout(() => t.classList.remove("show"), 1800);
}

// ===== HITUNG MUNDUR PROMO (berakhir di akhir bulan ini) =====
function hitungMundur() {
  const now = new Date();
  const akhir = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  let s = Math.max(0, Math.floor((akhir - now) / 1000));
  const bagi = [86400, 3600, 60, 1], label = ["hari", "jam", "menit", "detik"];
  $("timer").innerHTML = bagi.map((b, i) => {
    const n = Math.floor(s / b); s %= b;
    return `<span>${String(n).padStart(2, "0")}<i>${label[i]}</i></span>`;
  }).join("");
}

// ===== KIRIM PESANAN KE WHATSAPP =====
function pesanWhatsApp() {
  const nama = $("nama").value.trim(), kelas = $("kelas").value.trim(), catatan = $("catatan").value.trim();
  const ids = Object.keys(keranjang);
  if (ids.length === 0) { $("error").textContent = "Keranjang masih kosong."; return; }
  if (!nama || !kelas) { $("error").textContent = "Isi nama dan kelas dulu."; return; }
  $("error").textContent = "";

  let total = 0;
  const baris = ids.map((id, i) => {
    const p = produk.find((x) => x.id == id), sub = p.harga * keranjang[id];
    total += sub;
    return `${i + 1}. ${p.nama} x ${keranjang[id]} = ${rupiah(sub)}`;
  });

  const pesan = `Halo, saya mau pesan di ${NAMA_TOKO}.\n\nNama: ${nama}\nKelas: ${kelas}\n\nPesanan:\n${baris.join("\n")}\n\nTotal: ${rupiah(total)}${catatan ? "\nCatatan: " + catatan : ""}\n\nTerima kasih!`;
  window.open(`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`, "_blank");
}

// ===== EVENT =====
$("filters").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-kat]");
  if (!b) return;
  kategoriAktif = b.dataset.kat;
  tampilkanFilter();
  tampilkanProduk();
});

$("productGrid").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-id]");
  if (!b) return;
  const p = produk.find((x) => x.id == b.dataset.id);
  ubahJumlah(p.id, 1);
  tampilToast(`${p.nama} masuk keranjang`);
  const c = $("openCart");
  c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
});

$("cartList").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-aksi]");
  if (b) ubahJumlah(Number(b.dataset.id), b.dataset.aksi === "tambah" ? 1 : -1);
});

$("openCart").addEventListener("click", () => bukaKeranjang(true));
$("closeCart").addEventListener("click", () => bukaKeranjang(false));
$("overlay").addEventListener("click", () => bukaKeranjang(false));
$("checkout").addEventListener("click", pesanWhatsApp);

// ===== MULAI =====
tampilkanFilter();
tampilkanProduk();
tampilkanKeranjang();
hitungMundur();
setInterval(hitungMundur, 1000);
