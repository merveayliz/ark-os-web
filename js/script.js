import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- 1. KAYIT OL FONKSİYONU ---
async function kayitOl() {
    const email = document.getElementById("kayit-email")?.value;
    const sifre = document.getElementById("kayit-sifre")?.value;
    const ad = document.getElementById("kayit-ad")?.value;

    if (!email || !sifre || !ad) {
        alert("Skaikru, tüm alanları doldurmalısın!");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, sifre);
        const user = userCredential.user;

        await setDoc(doc(db, "kullanicilar", user.uid), {
            kullaniciAdi: ad,
            email: email,
            rutbe: "Skaikru",
            kayitTarihi: new Date()
        });

        localStorage.setItem("skaikru_ad", ad);
        alert("Ark-OS Çekirdeğine Başarıyla Kaydedildin!");
        window.location.href = "anasayfa.html";
    } catch (error) {
        alert("Kayıt Hatası: " + error.message);
    }
}

// --- 2. GİRİŞ YAP FONKSİYONU ---
async function girisYap() {
    const email = document.getElementById("login-email")?.value;
    const sifre = document.getElementById("login-sifre")?.value;

    if (!email || !sifre) {
        alert("Lütfen e-posta ve şifreni gir!");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, sifre);
        alert("Erişim Onaylandı!");
        window.location.href = "anasayfa.html";
    } catch (error) {
        alert("Hata: " + error.message);
    }
}

// --- 3. FORM DEĞİŞTİRME ---
function formDegistir() {
    document.getElementById("giris-formu").classList.toggle("gizli");
    document.getElementById("kayit-formu").classList.toggle("gizli");
}

// --- 4. MODÜL KORUMASINI KIRMAK (KRİTİK ADIM) ---
// Fonksiyonları dış dünyaya açıyoruz
window.kayitOl = kayitOl;
window.girisYap = girisYap;
window.formDegistir = formDegistir;

// --- 5. GÖRSEL EFEKTLER ---
window.onload = function() {
    const mesaj = document.getElementById("mesaj");
    const konteynir = document.getElementById("ana-konteynir");
    const formAlani = document.getElementById("form-alani");

    setTimeout(() => {
        if(mesaj) mesaj.innerHTML = "We’re back, bitches.";
    }, 2000);

    setTimeout(() => {
        konteynir?.classList.add("yukari-kay");
        formAlani?.classList.remove("gizli");
        formAlani?.classList.add("gorunur");
    }, 2000);
}
