<div align="center">

  <p><img width="180" height="180" alt="Qurio Logo" src="https://ui-avatars.com/api/?name=Q&background=0ea5e9&color=fff&size=256&rounded=true&font-size=0.6" /></p>
    
  <b>Arsitektur backend yang mutakhir, aman, dan berkinerja tinggi untuk Platform Manajemen Pembelajaran & Kuis modern.</b>

  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  </p>

  <p>
    <img src="https://img.shields.io/github/license/qurio-platform/qurio?style=flat-square&color=6366f1" alt="License" />
    <img src="https://img.shields.io/badge/Status_Proyek-Pengembangan_Aktif-success?style=flat-square&color=10b981" alt="Status" />
    <img src="https://img.shields.io/badge/Fase-Backend_Selesai-blue?style=flat-square&color=3b82f6" alt="Phase" />
  </p>

  <br />
</div>

---

### ✨ Tentang Proyek

**Qurio** adalah *Learning Management System* (LMS) modern dan platform kuis interaktif yang direkayasa untuk evaluasi pendidikan profesional. Platform ini menjembatani kesenjangan antara **Instruktur (Author)** yang membutuhkan alat pembuat soal dinamis dengan analitik komprehensif, dan **Peserta (Participant)** yang berhak mendapatkan pengalaman ujian yang mulus, adil, dan transparan.

#### 🎯 Visi
Repositori ini saat ini menampung **Backend API** dari Qurio. Arsitektur ini lahir dari kebutuhan untuk menciptakan pusat evaluasi *online* yang berintegritas tinggi dan "Anti-Curang". Baik untuk ujian universitas yang ketat dengan batas waktu, maupun kuis pelatihan kasual, Qurio menyediakan RESTful API terpusat yang aman untuk mengelola seluruh siklus kuis—mulai dari penyusunan draf hingga penilaian otomatis dan analitik mendalam.

#### 🛡️ Arsitektur & Keamanan
Pada intinya, Backend Qurio mengutamakan pendekatan **"Keamanan & Konsistensi"**:
- **Kontrol Akses Berbasis Peran (RBAC):** Middleware berbasis JWT yang ketat memastikan bahwa peran `ADMIN`, `AUTHOR`, dan `PARTICIPANT` benar-benar terisolasi. Author hanya dapat mengedit kuisnya sendiri, dan Peserta tidak dapat mengakses *endpoint* analitik.
- **Validasi Sisi Server:** Untuk mencegah manipulasi dari sisi klien, logika krusial seperti penghitung waktu mundur kuis, validasi tanggal Mulai/Selesai, dan batas maksimal percobaan (*Max Attempts*) ditegakkan secara absolut oleh server Node.js.
- **Integritas Data:** Didukung oleh **Prisma ORM**, skema database menggunakan batasan relasional yang ketat dan penghapusan kaskade (*cascading deletes*) untuk mencegah data yatim (*orphaned data*).
- **Manajemen Berkas Terorganisir:** Menggunakan `multer`, lampiran gambar untuk soal dan opsi diproses dengan aman dan disimpan secara sistematis di direktori publik yang terisolasi (`public/uploads/questions` dan `public/uploads/options`).

---

### 🚀 Fitur Utama Backend

#### 📝 Manajemen Kuis Tingkat Lanjut
* **Konfigurasi Dinamis:** Kuis mendukung visibilitas Publik/Privat (via PIN), akses terjadwal (`startDate` & `endDate`), dan batas percobaan yang dapat disesuaikan.
* **Pembuat Soal Granular:** Tambah, perbarui, atau hapus soal dengan berbagai tingkat kesulitan. Mendukung format pilihan ganda dan benar/salah beserta lampiran gambar.
* **Sistem Draf:** Simpan kuis sebagai `DRAFT` sebelum secara resmi diubah menjadi `PUBLISHED`.

#### 🎯 Mesin Pengerjaan Anti-Curang
* **Mekanisme Simpan Otomatis:** Jawaban disimpan secara bertahap per soal (*endpoint* `/answer`), memastikan tidak ada data yang hilang jika peserta kehilangan koneksi.
* **Penilaian Otomatis:** Sistem langsung menghitung skor saat kuis diserahkan, dengan mempertimbangkan preferensi Instruktur apakah akan menampilkan atau menyembunyikan hasil akhir.
* **Sistem Ulasan:** Peserta dapat meninjau jawaban benar/salah pasca-ujian, diatur secara ketat oleh pengaturan `showScore` milik Instruktur.

#### 📈 Analitik Kelas Enterprise
* **Dasbor Instruktur:** Satu *endpoint* tangguh yang mengumpulkan total persentase kelulusan, durasi rata-rata, tren pengerjaan 7 hari terakhir, dan kuis dengan performa terbaik.
* **Papan Peringkat (Leaderboards):** Peringkat peserta secara *real-time* berdasarkan skor akhir dan kecepatan penyelesaian.
* **Inspeksi Pengerjaan Mendalam:** Memungkinkan Instruktur memeriksa jawaban individu siswa untuk mengidentifikasi soal yang paling sering dijawab salah.

---

### 🛠️ Teknologi yang Digunakan

<div align="center">

**Runtime & Bahasa** <br /> 
[![My Skills](https://skillicons.dev/icons?i=nodejs,js,ts)](https://skillicons.dev)

**Framework & Database** <br /> 
[![My Skills](https://skillicons.dev/icons?i=express,mysql,prisma)](https://skillicons.dev)

**Alat & Infrastruktur** <br /> 
[![My Skills](https://skillicons.dev/icons?i=postman,git,github,vscode)](https://skillicons.dev)

</div>

---

### 📂 Struktur Proyek

```text
qurio-backend/
├── prisma/                 
│   ├── schema.prisma       
│   └── seed.js             
├── public/                 
│   └── uploads/            
│       ├── questions/      
│       └── options/        
├── src/
│   ├── config/             
│   ├── controllers/        
│   ├── middlewares/        
│   ├── routes/             
│   └── server.js           
├── .env                    
└── package.json
└── prisma.config.ts
```
---

### 📡 Dokumentasi Endpoint API

<p><i>Semua endpoint menerima dan menghasilkan <code>application/json</code> kecuali dinyatakan lain. Endpoint yang dilindungi memerlukan JWT yang valid melalui header <code>Authorization: Bearer &lt;token&gt;</code>.</i></p>

<h3 align="center">Authentication (<code>/api/auth</code>)</h3>
<table width="100%" style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Method</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Endpoint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Akses</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Body / Params</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Deskripsi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>POST</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/register</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Publik</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>name</code>, <code>username</code>, <code>password</code>, <code>role</code>, <code>phone</code> (opsional)</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mendaftarkan akun pengguna baru.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>POST</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/login</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Publik</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>username</code>, <code>password</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Autentikasi kredensial dan menerima token JWT.</td>
    </tr>
  </tbody>
</table>

<br/>

<h3 align="center">Quiz Management (<code>/api/quizzes</code>)</h3>
<table width="100%" style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Method</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Endpoint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Akses</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Body / Params</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Deskripsi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/public</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Publik</td>
      <td style="padding: 8px; border: 1px solid #ddd;">-</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Menampilkan kuis berstatus <code>PUBLISHED</code> tanpa PIN.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/join/:quizCode</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Participant</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>quizCode</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mengambil metadata kuis untuk halaman pra-kuis (Lobby).</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>POST</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>title</code>, <code>description</code>, <code>timeLimit</code>, <code>status</code>, <code>pin</code>, <code>startDate</code>, <code>endDate</code>, <code>showScore</code>, <code>randomizeQuestions</code>, <code>maxAttempts</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Membuat kuis baru dengan pengaturan akses.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/my-quizzes</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;">-</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mengambil semua kuis yang dibuat oleh Instruktur terkait.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>PUT</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/:id</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>id</code><br/><i>Body</i>: Sama seperti POST</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Memperbarui konfigurasi kuis.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>DELETE</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/:id</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>id</code> kuis</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Menghapus kuis beserta isinya secara kaskade.</td>
    </tr>
  </tbody>
</table>

<br/>

<h3 align="center">Question Engine (<code>/api/questions</code>)</h3>
<table width="100%" style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Method</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Endpoint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Akses</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Body / Params</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Deskripsi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>POST</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/:quizId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>quizId</code><br/><i>Body</i>: <code>type</code>, <code>content</code>, <code>imageUrl</code>, <code>options</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Menambahkan soal baru beserta daftar opsinya.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/quiz/:quizId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>quizId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mengambil semua soal dalam kuis tertentu.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>PUT</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/:questionId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>questionId</code><br/><i>Body</i>: Sama seperti POST</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Memperbarui konten soal atau mengganti opsi jawaban.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>DELETE</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/:questionId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>questionId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Menghapus soal beserta opsi di dalamnya.</td>
    </tr>
  </tbody>
</table>

<br/>

<h3 align="center">Attempt & Scoring (<code>/api/attempts</code>)</h3>
<table width="100%" style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Method</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Endpoint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Akses</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Body / Params</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Deskripsi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>POST</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/start/:quizId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Participant</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>quizId</code><br/><i>Body</i>: <code>pin</code> (opsional)</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Memulai kuis (Memvalidasi PIN, jadwal, dan max attempts).</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>POST</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/:attemptId/answer</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Participant</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>attemptId</code><br/><i>Body</i>: <code>questionId</code>, <code>optionId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Simpan otomatis jawaban (Validasi batas waktu dari server).</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>POST</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/:attemptId/finish</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Participant</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>attemptId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mengakhiri pengerjaan dan memicu perhitungan skor.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/my-history</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Participant</td>
      <td style="padding: 8px; border: 1px solid #ddd;">-</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Melihat riwayat skor pengerjaan kuis pribadi.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/:attemptId/review</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Participant</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>attemptId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Melihat rincian jawaban benar/salah pasca ujian.</td>
    </tr>
  </tbody>
</table>

<br/>

<h3 align="center">Analytics & Files (<code>/api/analytics</code> & <code>/api/uploads</code>)</h3>
<table width="100%" style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Method</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Endpoint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Akses</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Body / Params</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Deskripsi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/analytics/author/dashboard</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;">-</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Menarik metrik global, tren, dan grafik performa kuis.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/analytics/quiz/:id</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>id</code> kuis</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mengambil statistik kuis spesifik dan Leaderboard.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/analytics/attempt/:id</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>id</code> attempt</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Memeriksa detail jawaban historis dari satu peserta.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>POST</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/uploads/question</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Form</i>: <code>image</code> (File)</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mengunggah lampiran gambar untuk ilustrasi soal.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>POST</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/uploads/option</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Author, Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Form</i>: <code>image</code> (File)</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mengunggah lampiran gambar untuk opsi jawaban.</td>
    </tr>
  </tbody>
</table>

<br/>

<h3 align="center">Admin Control (<code>/api/admin</code>)</h3>
<table width="100%" style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Method</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Endpoint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Akses</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Body / Params</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Deskripsi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/dashboard</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;">-</td>
      <td style="padding: 8px; border: 1px solid #ddd;">Memantau metrik global (total pengguna, kuis, pengerjaan).</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>DELETE</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/quizzes/:quizId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>quizId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Menghapus paksa kuis yang melanggar aturan.</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>DELETE</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/users/:userId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Admin</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>userId</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Membekukan atau menghapus akun dari sistem.</td>
    </tr>
  </tbody>
</table>

---

### 🌟 FRONTEND: SEGERA HADIR!
Backend yang tangguh dan aman ini hanyalah setengah dari ekosistem Qurio. Kami saat ini sedang aktif mengembangkan Aplikasi Frontend yang akan mendefinisikan ulang cara Anda berinteraksi dengan platform pendidikan.

Dibangun menggunakan kerangka kerja mutakhir Astro untuk pemuatan halaman super cepat (tanpa JS secara bawaan), terintegrasi mulus dengan React (Astro Islands) untuk komponen UI yang sangat interaktif seperti Quiz Builder dinamis dan Mesin Ujian real-time.

Apa yang akan datang:

- ✨ UI Bersih & Glassmorphism: Antarmuka memukau dengan kontras tinggi yang ditenagai oleh Tailwind CSS terbaru. Dirancang untuk mengurangi beban kognitif selama ujian dan terlihat luar biasa premium.

- 📱 Responsivitas Sempurna: Pendekatan mobile-first memastikan platform terlihat dan terasa seperti aplikasi native di ponsel pintar, sekaligus melebar dengan elegan di monitor desktop.

- 📊 Visualisasi Data Interaktif: Grafik indah dan beranimasi yang merender analitik backend Anda secara real-time.

- ⚡ Transisi Tampilan Mulus: Memanfaatkan View Transitions API dari Astro untuk pengalaman navigasi yang mulus dan tanpa hambatan.

Masa depan evaluasi hampir tiba. Tetap pantau!

---

### 📦 Instalasi

Untuk mendapatkan salinan lokal dan menjalankannya, ikuti langkah-langkah sederhana berikut:

1. **Kloning repositori**
   ```bash
   git clone https://github.com/nyomangedewisaya/qurio.git
   cd qurio-backend
   ```

2. **Instal paket NPM**
   ```bash
   npm install
   ```
   
3. **Konfigurasi Environment & Database** <br />
   Buat file `.env` untuk mengatur koneksi database dan JWT, lalu jalankan perintah inisialisasi database berikut:
   ```bash
   npx prisma db push
   npx prisma generate
   npx prisma db seed
   ```

4. **Jalankan server backend**
   ```bash
   npm run dev
   # atau
   npm start
   ```

---

### 📜 Lisensi
Didistribusikan di bawah Lisensi MIT.

<br />

<div align="center">
<i>"Memberdayakan pikiran melalui evaluasi yang mulus dan andal."</i>
<br />
<b>— Developer Qurio</b>
</div>
