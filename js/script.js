// 1. Firebase Bağlantıları
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- KAYIT OL FONKSİYONU ---
async function kayitOl() {
    const email = document.getElementById("kayit-email").value;
    const sifre = document.getElementById("kayit-sifre").value;
    const ad = document.getElementById("kayit-ad").value;

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
        console.error("Hata:", error.message);
        alert("Erişim Reddedildi: " + error.message);
    }
}

async function girisYap() {
    const email = document.getElementById("login-email")?.value; 
    const sifre = document.getElementById("login-sifre")?.value;

    if (!email || !sifre) {
        alert("Skaikru, tüm alanları doldurmalısın!");
        return;
    }
   
}

    try {
        await signInWithEmailAndPassword(auth, email, sifre);
        alert("Erişim Onaylandı. Ark-OS'a hoş geldin!");
        window.location.href = "anasayfa.html";
    } catch (error) {
        alert("Hatalı Kimlik Bilgileri!");
    }
}

// Fonksiyonları küresel yapıyoruz ki HTML butonları çalışsın
window.kayitOl = kayitOl;
window.girisYap = girisYap;
window.formDegistir = function() {
    document.getElementById("giris-formu").classList.toggle("gizli");
    document.getElementById("kayit-formu").classList.toggle("gizli");
};

// --- GÖRSEL EFEKTLER VE AÇILIŞ ---
window.onload = function() {
    let mesaj = document.getElementById("mesaj");
    let konteynir = document.getElementById("ana-konteynir");
    let formAlani = document.getElementById("form-alani");
    let eskiDost = localStorage.getItem("skaikru_ad");

    setTimeout(() => {
        if(mesaj) {
            mesaj.innerHTML = "We’re back, bitches.";
            mesaj.style.color = "#007bff";
        }
    }, 2000);

    setTimeout(() => {
        konteynir?.classList.add("yukari-kay");
        formAlani?.classList.remove("gizli");
        
        if(eskiDost) {
            const kayitForm = document.getElementById("kayit-formu");
            const girisForm = document.getElementById("giris-formu");
            const selamlama = document.getElementById("selamlama");
            
            if(kayitForm) kayitForm.classList.add("gizli");
            if(girisForm) girisForm.classList.remove("gizli");
            if(selamlama) selamlama.innerHTML = "Tekrar hoş geldin, " + eskiDost + ".";
        }
        formAlani?.classList.add("gorunur");
    }, 2000);
}

// Saat ve Diğer Yardımcılar
setInterval(() => {
    const saatAlani = document.getElementById("canli-saat");
    if(saatAlani) saatAlani.innerText = new Date().toLocaleTimeString();
}, 1000);

