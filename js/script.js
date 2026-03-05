// 1. Firebase Bağlantıları ve Gerekli Fonksiyonlar
import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    getDoc, 
    collection, 
    addDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- 2. KAYIT OL FONKSİYONU ---
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

        // Kullanıcı verilerini Firestore'a kaydet (Murphy ppsi yerine boş bırakıyoruz)
        await setDoc(doc(db, "kullanicilar", user.uid), {
            kullaniciAdi: ad,
            email: email,
            rutbe: "Skaikru",
            profilResmi: "", // Başta boş, sonra güncellenebilir
            kayitTarihi: new Date()
        });

        alert("Ark-OS Çekirdeğine Başarıyla Kaydedildin!");
        window.location.href = "anasayfa.html";
    } catch (error) {
        alert("Kayıt Hatası: " + error.message);
    }
}

// --- 3. GİRİŞ YAP FONKSİYONU ---
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

// --- 4. PROFİL VERİLERİNİ OTOMATİK YÜKLEME ---
// Bu kısım "Murphy" sorununu çözer; giriş yapanın bilgisini getirir.
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "kullanicilar", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            const navName = document.getElementById("nav-user-name");
            const navAvatar = document.getElementById("nav-avatar");

            if(navName) navName.innerText = data.kullaniciAdi;
            if(navAvatar) {
                // Eğer veritabanında resim yoksa varsayılan bir ikon koyar
                navAvatar.src = data.profilResmi || "img/default-avatar.jpg";
            }
        }
    }
});

// --- 5. FORM DEĞİŞTİRME ---
function formDegistir() {
    document.getElementById("giris-formu").classList.toggle("gizli");
    document.getElementById("kayit-formu").classList.toggle("gizli");
}

// --- 6. MODÜL KORUMASINI KIRMAK ---
window.kayitOl = kayitOl;
window.girisYap = girisYap;
window.formDegistir = formDegistir;

// --- 7. GÖRSEL EFEKTLER ---
window.onload = function() {
    const mesaj = document.getElementById("mesaj");
    const konteynir = document.getElementById("ana-konteynir");
    const formAlani = document.getElementById("form-alani");

    setTimeout(() => { if(mesaj) mesaj.innerHTML = "We’re back, bitches."; }, 2000);
    setTimeout(() => {
        konteynir?.classList.add("yukari-kay");
        formAlani?.classList.remove("gizli");
        formAlani?.classList.add("gorunur");
    }, 2000);
}
