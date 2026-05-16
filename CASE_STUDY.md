# FocusFlow — Portfolio Case Study

## 1. Project Overview

FocusFlow adalah aplikasi produktivitas mobile-first yang membantu pengguna menjaga fokus dengan menggabungkan Pomodoro timer, task progress, mood check-in, dan analytics. Aplikasi ini dibuat untuk pengguna yang sering memiliki banyak tugas, tetapi kesulitan memulai, menjaga ritme, dan memahami pola fokus mereka sendiri.

## 2. Problem Statement

Banyak mahasiswa dan junior developer memiliki daftar tugas yang panjang, tetapi tidak selalu tahu tugas mana yang harus dikerjakan terlebih dahulu dan berapa lama mereka perlu fokus. Aplikasi task manager biasa hanya mencatat tugas, sedangkan aplikasi Pomodoro biasa hanya menghitung waktu. Keduanya sering tidak mempertimbangkan kondisi mental pengguna, seperti lelah, stres, atau sedang bersemangat.

FocusFlow dirancang untuk menjawab masalah tersebut dengan menghubungkan tiga hal penting: kondisi mood pengguna, prioritas tugas, dan progress sesi fokus.

## 3. Target User

Target utama:

- Mahasiswa yang mengerjakan tugas kuliah, proyek, atau skripsi.
- Junior developer yang belajar coding dan mengerjakan portfolio.
- Creative learner yang ingin menjaga rutinitas produktif tanpa merasa terlalu dipaksa.

## 4. User Research Draft

Catatan: bagian ini adalah draft struktur riset. Jika digunakan di portofolio resmi, isi dengan hasil wawancara nyata.

### Calon responden yang relevan

1. Mahasiswa tingkat akhir yang sedang mengerjakan tugas akhir.
2. Mahasiswa atau fresh graduate yang sedang membangun portfolio digital.
3. Junior developer yang sering belajar mandiri dan mengatur jadwal coding sendiri.

### Pertanyaan interview

1. Bagaimana kamu biasanya menentukan tugas mana yang dikerjakan lebih dulu?
2. Apa yang membuat kamu sulit memulai sesi belajar atau coding?
3. Apakah mood atau energi harian memengaruhi produktivitasmu?
4. Apakah kamu pernah menggunakan Pomodoro timer? Apa kekurangannya?
5. Informasi apa yang paling berguna setelah kamu menyelesaikan sesi fokus?

### Insight awal yang diasumsikan

- User tidak hanya butuh timer, tetapi juga arahan tentang task yang sedang dikerjakan.
- User ingin progress yang terlihat agar merasa lebih termotivasi.
- User sering merasa tidak produktif karena tidak mencatat durasi fokus secara konsisten.
- Mood memengaruhi durasi fokus yang realistis untuk dilakukan.

## 5. Pain Points

- User punya banyak tugas tetapi bingung memulai dari mana.
- Timer dan task manager biasanya terpisah.
- Tidak ada hubungan antara sesi fokus dan progress tugas.
- User tidak bisa melihat pola fokus dalam beberapa hari terakhir.
- Aplikasi produktivitas sering terasa terlalu kaku dan tidak personal.

## 6. Solution

FocusFlow menyediakan pengalaman yang lebih personal melalui:

- Mood check-in sebelum fokus.
- Rekomendasi sesi berdasarkan mood.
- Task dengan due date dan prioritas.
- Target focus session per task.
- Timer yang langsung menambah progress task.
- Analytics untuk melihat waktu fokus, mood, dan penyelesaian task.
- Settings agar user bisa menyesuaikan durasi, break, notifikasi, dan nama.

## 7. Key Features

### Mood Check-in

User memilih kondisi mood sebelum memulai sesi. Mood disimpan per hari dan digunakan sebagai konteks pada analytics.

### Focus Timer

User dapat memilih durasi 25, 45, atau 60 menit. Setelah sesi selesai, aplikasi memberikan sound alert, toast, confetti, dan browser notification jika diaktifkan.

### Task Progress Integration

User dapat memilih task yang sedang dikerjakan pada timer. Ketika sesi selesai, progress task bertambah otomatis. Jika target focus session tercapai, task ditandai selesai.

### Smart Break

Aplikasi mendukung short break dan long break. Long break berjalan setelah sejumlah sesi tertentu, default setelah 4 focus session.

### Analytics

Analytics menampilkan total session, total minutes, completed tasks, daily focus, mood by session, dan task by category.

### PWA

Aplikasi dapat dibuat installable melalui manifest dan service worker, sehingga dapat dipasang seperti aplikasi mobile setelah dideploy.

## 8. Iteration

### V1

Fitur awal:

- Timer sederhana.
- Task list sederhana.
- Mood check-in dasar.
- Tampilan dark UI.

Kekurangan V1:

- Data belum tersimpan.
- Task tidak bisa diedit.
- Timer belum terhubung dengan progress task.
- Tidak ada due date dan priority.
- Belum ada onboarding dan settings.
- Belum PWA-ready.

### Feedback

Aplikasi perlu lebih siap sebagai portfolio product, bukan hanya demo UI. Fitur harus menunjukkan alur yang jelas: user membuat task, memilih prioritas, menjalankan focus session, lalu melihat progress dan analytics.

### V2 / Final

Perbaikan:

- Menambahkan localStorage.
- Menambahkan edit task.
- Menambahkan due date, priority, dan target focus session.
- Menghubungkan timer dengan progress task.
- Menambahkan auto-start break dan long break.
- Menambahkan confetti, sound, dan browser notification.
- Menambahkan onboarding dan settings.
- Menambahkan manifest dan service worker untuk PWA.
- Menambahkan case study documentation.

## 9. Design Direction

Visual style yang digunakan adalah modern dark glassmorphism dengan aksen orange, blue, green, yellow, dan purple. Tujuannya agar aplikasi terasa modern, calm, dan cocok untuk produktivitas tanpa terlihat terlalu formal.

## 10. Tech Stack

- React
- Vite
- CSS
- LocalStorage
- Notification API
- Web Audio API
- Progressive Web App setup

## 11. Future Improvement

- Backend authentication.
- Cloud sync antar device.
- Calendar integration.
- Custom focus duration.
- More detailed weekly and monthly analytics.
- Export productivity report.
- Real user testing and usability iteration.

## 12. Portfolio Summary

FocusFlow is a mood-aware productivity app that connects focus sessions with task progress. Unlike a basic Pomodoro timer, FocusFlow helps users understand how their mood, task priority, and work sessions interact, making productivity feel more personal, measurable, and sustainable.
