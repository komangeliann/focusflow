# FocusFlow Final

FocusFlow adalah aplikasi produktivitas berbasis React yang menggabungkan Pomodoro timer, mood check-in, task tracking, task priority, due date, progress per task, analytics, onboarding, settings, dan PWA support.

## Fitur Final

### Fungsionalitas
- Focus timer 25 / 45 / 60 menit.
- Short break dan long break.
- Long break otomatis setelah beberapa sesi sesuai pengaturan.
- Auto-start break setelah focus selesai.
- Sound alert saat focus dan break selesai.
- Browser notification jika diaktifkan di Settings.
- Task tersimpan di localStorage.
- Edit task.
- Due date task.
- Priority task: Low, Medium, High.
- Target focus session per task.
- Timer terhubung ke task.
- Saat focus selesai, progress task bertambah otomatis.
- Task otomatis selesai ketika target focus session tercapai.
- Reset data aplikasi.

### UX / Design
- Onboarding untuk user baru.
- Mood check-in tersimpan per hari.
- Empty state untuk analytics.
- Confetti saat sesi focus selesai.
- Settings screen.
- Modern dark glassmorphism UI.
- Mobile-first frame.

### PWA
- `manifest.json` sudah tersedia.
- `sw.js` service worker sudah tersedia.
- Icon 192 dan 512 px sudah tersedia.
- Service worker otomatis aktif ketika build production.

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka URL lokal yang muncul dari Vite, biasanya:

```bash
http://localhost:5173
```

## Cara Build

```bash
npm run build
npm run preview
```

## Cara Reset Data Saat Testing

Buka browser console lalu jalankan:

```js
localStorage.clear();
location.reload();
```

## Deploy ke Vercel

1. Upload project ke GitHub.
2. Masuk ke Vercel.
3. Import repository.
4. Framework preset: Vite.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Klik Deploy.

## Deploy ke Netlify

1. Upload project ke GitHub.
2. Masuk ke Netlify.
3. Add new site from Git.
4. Build command: `npm run build`.
5. Publish directory: `dist`.
6. Klik Deploy.

## Catatan Portfolio

File `CASE_STUDY.md` berisi problem statement, target user, user research draft, pain points, iterasi v1 ke v2, dan value proposition. Jangan mengklaim user interview sebagai riset nyata sebelum benar-benar melakukan wawancara. Gunakan bagian tersebut sebagai draft portofolio, lalu sesuaikan setelah validasi dengan user asli.
