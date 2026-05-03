# Yabancılara Türkçe Öğretimi - AI SaaS Platformu 🇹🇷🤖

Bu proje, yabancılara Türkçe öğretmek amacıyla geliştirilmiş, yapay zeka (OpenAI) ve Doğal Dil İşleme (Zemberek NLP) teknolojileriyle güçlendirilmiş kapsamlı bir SaaS (Hizmet Olarak Yazılım) platformudur.

## 👨‍💻 Geliştirici Ekip
- **Geliştirici (Software Engineer):** [Kadir Gedik](https://github.com/kadirgedik) - Web sitesinin oluşturulması, veritabanı mimarisi, AI entegrasyonları, deployment süreci ve tüm SaaS mimarisinin uçtan uca kodlanması.
- **Proje Fikri ve NLP Backend:** Arş. Gör. Kerim Gedik - Projenin ana fikrinin oluşturulması ve platformun arkasında çalışan Zemberek NLP API altyapısının geliştirilmesi.

## 🚀 Özellikler

### 1. Kapsamlı Üyelik ve Limit Sistemi
- **Rol Bazlı Erişim:** Kullanıcı ve Yönetici (Admin) rolleri.
- **Güvenli Kimlik Doğrulama:** JWT (JSON Web Token), Bcryptjs hashleme ve HttpOnly çerezler.
- **SaaS Planları (Free & Pro):**
  - **Free:** Zemberek araçlarına sınırsız erişim, Yapay Zeka eğitim modüllerine 2 kullanım hakkı.
  - **Pro:** Tüm eğitim modüllerine sınırsız erişim.
- **Admin Paneli:** Yöneticinin kullanıcı yetkilerini ve abonelik durumlarını (Free -> Pro) değiştirebileceği özel panel.
- **WhatsApp Entegrasyonu:** Fiyatlandırma sayfasından direkt WhatsApp üzerinden tek tıkla ön sipariş ve ödeme talebi oluşturma.

### 2. Eğitim Modülleri
- **Yazılı Eğitim (Kâtip Çelebi):** GPT-4o-mini destekli sanal Türkçe öğretmeni. Öğrencinin seviyesine (B1) uygun, motive edici ve düzeltici (recasting) konuşmalar yapar. Resim anlatma, günlük yazma gibi senaryolar içerir.
- **Sesli Eğitim (Avatar):** 3D Robot avatarı eşliğinde sesli Türkçe pratiği. Whisper (STT) ile sesi metne, GPT-4o-mini ile anlama ve TTS-1 ile tekrar sese dönüştürme döngüsünü milisaniyeler içinde gerçekleştirir.
- **Zemberek Analizleri:** Kelime kökü/gövdesi bulma, heceleme, cümlenin ögelerini bulma ve yazım yanlışı denetimi.

## 🌐 Canlı Yayın (Live Demo)
Platformumuz tamamen yayındadır ve kullanıma açıktır. Kaynak kodlarımız kapalı kaynak (closed-source) olarak korunmaktadır. 

Projeyi hemen incelemek ve test etmek için:
👉 **[kerimgedik.tech](https://kerimgedik.tech)**

## 🛠 Teknoloji Yığını
- **Frontend & Backend Framework:** Next.js (App Router, Server Actions)
- **Veritabanı:** MongoDB Atlas & Mongoose
- **Stil & UI:** Tailwind CSS, Framer Motion (Animasyonlar), Lucide Icons, Glassmorphism UI
- **Yapay Zeka:** OpenAI API (GPT-4o-mini, Whisper)
- **Ses Sentezi (TTS):** ElevenLabs Entegrasyonu (Doğal ve akıcı insan sesi üretimi)
- **Kimlik Doğrulama:** Jose (JWT), Bcryptjs
