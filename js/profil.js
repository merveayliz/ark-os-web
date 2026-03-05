// js/profil.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 1. Sayfa Açıldığında Verileri Getir
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Firestore'dan verileri çekiyoruz
        const userDoc = await getDoc(doc(db, "kullanicilar", user.uid));
        
        if (userDoc.exists()) {
            const data = userDoc.data();
            
            // HTML'deki isimleri doldur
            document.getElementById("profil-ad").innerText = data.kullaniciAdi;
            document.getElementById("nav-user-name").innerText = data.kullaniciAdi;
            
            // Eğer veritabanında profil resmi varsa yükle
            if (data.profilResmi) {
                document.getElementById("profil-ana-resim").src = data.profilResmi;
                document.getElementById("nav-avatar").src = data.profilResmi;
            }
        }
    } else {
        // Oturum açılmamışsa giriş sayfasına at
        window.location.href = "index.html";
    }
});

// 2. RESMİ KAYDET FONKSİYONU (Butona basınca çalışacak olan)
window.resmiKaydet = function(input) {
    if (input.files && input.files[0]) {
        const okuyucu = new FileReader();
        okuyucu.onload = async function(e) {
            const yeniResimYolu = e.target.result; // Resmin verisi
            const user = auth.currentUser;

            if (user) {
                try {
                    // Veritabanına "profilResmi" alanını kaydet/güncelle
                    await setDoc(doc(db, "kullanicilar", user.uid), {
                        profilResmi: yeniResimYolu
                    }, { merge: true });

                    // Ekrandaki resimleri anında değiştir
                    document.getElementById('profil-ana-resim').src = yeniResimYolu;
                    document.getElementById('nav-avatar').src = yeniResimYolu;
                    
                    alert("Profil fotoğrafın Ark-OS veritabanına işlendi!");
                } catch (error) {
                    alert("Yükleme sırasında bir hata oluştu: " + error.message);
                }
            }
        };
        okuyucu.readAsDataURL(input.files[0]);
    }
};

// 3. ÇIKIŞ YAP FONKSİYONU
window.cikisYap = function() {
    if(confirm("Sistemden çıkış yapmak istediğine emin misin?")) {
        auth.signOut().then(() => {
            window.location.href = "index.html";
        });
    }
};