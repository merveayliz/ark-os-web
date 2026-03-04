
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

        // 2. Kullanıcı ek bilgilerini Firestore Database'e kaydet
        await setDoc(doc(db, "kullanicilar", user.uid), {
            kullaniciAdi: ad,
            email: email,
            rutbe: "Skaikru",
            kayitTarihi: new Date()
        });

        alert("Ark-OS Çekirdeğine Başarıyla Kaydedildin!");
        window.location.href = "anasayfa.html";
    } catch (error) {
        console.error("Hata kodu:", error.code);
        alert("Erişim Reddedildi: " + error.message);
    }
}

window.kayitOl = kayitOl;
window.onload = function() {
    let mesaj = document.getElementById("mesaj");
    let konteynir = document.getElementById("ana-konteynir");
    let formAlani = document.getElementById("form-alani");
    

    let eskiDost = localStorage.getItem("skaikru_ad");
    

    setTimeout(() => {
        mesaj.innerHTML = "We’re back, bitches.";
        mesaj.style.color = "#007bff";
    }, 2000);

    setTimeout(() => {
        konteynir.classList.add("yukari-kay");
        formAlani.classList.remove("gizli");
        
       
        if(eskiDost) {
           
            document.getElementById("kayit-formu").classList.add("gizli");
            document.getElementById("giris-formu").classList.remove("gizli");
            document.getElementById("selamlama").innerHTML = "Tekrar hoş geldin, " + eskiDost + ".";
        }
      
        
        formAlani.classList.add("gorunur");
    }, 2000);
}
let kaydedilenIsim = ""; 

function kaydet() {
    let input = document.getElementById("kullanici-ad");
    kaydedilenIsim = input.value.trim(); 

    if(kaydedilenIsim === "") {
        alert("Bir isim yazmalısın Skaikru!");
    } else {
       
        localStorage.setItem("skaikru_ad", kaydedilenIsim); 
        document.getElementById("kayit-formu").classList.add("gizli");
        document.getElementById("giris-formu").classList.remove("gizli");
        document.getElementById("giris-formu").classList.add("gorunur");
        document.getElementById("selamlama").innerHTML = "Hoş geldin, " + kaydedilenIsim + ". Dünya seni bekliyor.";
    }
}
function dunyayaIn() {
  
    console.log("Sistem: İniş başlatıldı...");

   
    let hedef = "anasayfa.html";

   
    setTimeout(function() {
        
        console.log("Işınlanılıyor: " + hedef);
        window.location.href = hedef; 
    }, 1000);
}



setInterval(() => {
    const saatAlani = document.getElementById("canli-saat");
    
    if(saatAlani) {
        saatAlani.innerText = new Date().toLocaleTimeString();
    }
}, 1000);


function mesajGonder() {
    const input = document.getElementById("mesaj-input");
    const alan = document.getElementById("mesaj-alani");
    const kullaniciAd = localStorage.getItem("skaikru_ad") || "Skaikru"; 

    if (input.value.trim() !== "") {
        const div = document.createElement("div");
        div.className = "mesaj-balonu";
       
        div.innerHTML = `<span style="font-size: 0.75rem; opacity: 0.6;">${kullaniciAd}:</span><br>${input.value}`;
        
        alan.appendChild(div);
        input.value = ""; 

        alan.scrollTop = alan.scrollHeight; 
    }
}
document.getElementById("mesaj-input")?.addEventListener("keypress", (e) => {

    if (e.key === "Enter") mesajGonder(); 
});
window.addEventListener('DOMContentLoaded', () => {
    const skaikruAd = localStorage.getItem("skaikru_ad") || "Bilinmeyen Savaşçı";
    
    const profilKutu = document.querySelector(".profil-kutu");
    if (profilKutu && !document.getElementById("kullanici-etiket")) {
        profilKutu.innerHTML += `<span id="kullanici-etiket" style="color:#00ff96; font-size:0.9rem; font-family:'Fira Code';">${skaikruAd}</span>`;
    }
});
function formDegistir() {
    document.getElementById("giris-formu").classList.toggle("gizli");
    document.getElementById("kayit-formu").classList.toggle("gizli");
}

function kayitOl() {
    const ad = document.getElementById("kayit-ad").value;
    const sifre = document.getElementById("kayit-sifre").value;

    if (ad === "" || sifre === "") {
        alert("Sistem Hatası: Alanlar boş bırakılamaz!");
        return;
    }

    const kullaniciVerisi = {
        kullaniciAdi: ad,
        sifre: sifre,
        profilResmi: "img/murphy.jpg" 
    };

    localStorage.setItem("skaikru_user", JSON.stringify(kullaniciVerisi));
    localStorage.setItem("skaikru_ad", ad);
    
    alert("Kayıt Başarılı! Şimdi giriş yapabilirsin.");
    formDegistir(); 
}

function sistemeGir() {
    const girilenAd = document.getElementById("login-ad").value;
    const girilenSifre = document.getElementById("login-sifre").value;

    const kayitliVeri = JSON.parse(localStorage.getItem("skaikru_user"));

    if (!kayitliVeri) {
        alert("Erişim Reddedildi: Önce kayıt olmalısın!");
        return;
    }

    if (girilenAd === kayitliVeri.kullaniciAdi && girilenSifre === kayitliVeri.sifre) {
        alert("Erişim Onaylandı. Ark-OS'a hoş geldin, " + girilenAd);
        window.location.href = "anasayfa.html";
    } else {
        alert("Hatalı Kimlik Bilgileri! Sistem kilitlendi.");
    }
}


document.addEventListener("DOMContentLoaded", () => {
   
    const user = JSON.parse(localStorage.getItem("skaikru_user"));
    const kullaniciAd = localStorage.getItem("skaikru_ad");

    if (user || kullaniciAd) {
        
        const navIsim = document.getElementById("nav-user-name");
        if (navIsim) {
            navIsim.innerText = user ? user.kullaniciAdi : kullaniciAd;
        }

        const navAvatar = document.getElementById("nav-avatar");
        if (navAvatar) {
           
            navAvatar.src = user?.profilResmi || "img/murphy.jpg";
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("skaikru_user"));
    
    if (user) {
        
        const navAvatar = document.getElementById("nav-avatar");
        if (navAvatar && user.profilResmi) {
            navAvatar.src = user.profilResmi;
        }
    
        const navIsim = document.getElementById("nav-user-name");
        if (navIsim) {
            navIsim.innerText = user.kullaniciAdi;
        }
    }

});
window.kayitOl = kayitOl;

