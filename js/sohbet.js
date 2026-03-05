// js/sohbet.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let aktifSohbetId = null;
let unsubscribe = null; 

// 1. OTURUM VE NAVBAR BAŞLANGICI
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Kendi profil bilgilerini çek
        const userDoc = await getDoc(doc(db, "kullanicilar", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            if(document.getElementById("nav-user-name")) document.getElementById("nav-user-name").innerText = data.kullaniciAdi;
            if(document.getElementById("nav-avatar") && data.profilResmi) document.getElementById("nav-avatar").src = data.profilResmi;
        }
        // Bağlantıları yükle
        sinyalleriYukle(user.uid);
    } else {
        window.location.href = "index.html";
    }
});

// 2. SİNYALLERİ (BAĞLANTILARI) LİSTELEME
async function sinyalleriYukle(uid) {
    const liste = document.getElementById("arkadas-slotlari");
    if(!liste) return;

    try {
        const q = query(collection(db, "takip"), where("takipEden", "==", uid));
        const querySnapshot = await getDocs(q);
        
        let htmlIcerik = "";

        // Takip edilen her kullanıcı için kart oluştur
        for (const tDoc of querySnapshot.docs) {
            const v = tDoc.data();
            
            // Kullanıcının güncel verisini (PP için) Firestore'dan çek
            const hedefDoc = await getDoc(doc(db, "kullanicilar", v.takipEdilen));
            const hedefVeri = hedefDoc.exists() ? hedefDoc.data() : {};
            const pp = hedefVeri.profilResmi || 'img/murphy.jpg'; // Resim yoksa yedek resim

            htmlIcerik += `
                <div class="arkadas-kart" onclick="sohbetiAc('${v.takipEdilen}', '${v.takipEdilenAd}')">
                    <div class="kart-profil-resim">
                        <img src="${pp}" alt="Savaşçı"> 
                    </div>
                    <div class="kart-bilgi">
                        <span class="kart-isim">${v.takipEdilenAd.toUpperCase()}</span>
                        <span class="kart-durum">BAĞLANTI_KURULDU</span>
                    </div>
                </div>
            `;
        }
        
        liste.innerHTML = htmlIcerik || "<p style='color:#888; padding:10px;'>Henüz bağlantı yok.</p>";

    } catch (e) { 
        console.error("Sinyal listesi yüklenemedi:", e); 
    }
}

// 3. SOHBET KANALINI AKTİFLEŞTİRME
window.sohbetiAc = function(id, ad) {
    aktifSohbetId = id;
    
    // Başlığı güncelle
    const baslik = document.querySelector(".baslik-sol");
    if(baslik) baslik.innerText = `MISSION_CHAT: ${ad.toUpperCase()}`;
    
    // Mesaj alanını temizle ve başlangıç notu ekle
    const mesajAlani = document.getElementById("mesaj-alani");
    if(mesajAlani) {
        mesajAlani.innerHTML = `<div class="sistem-notu">[CHANNEL_OPENED_WITH_${ad.toUpperCase()}]</div>`;
    }
    
    // Bu kişiyle olan mesajları dinlemeye başla
    mesajlariDinle(id);
};

// 4. MESAJLARI GERÇEK ZAMANLI DİNLE
function mesajlariDinle(aliciId) {
    const user = auth.currentUser;
    if(!user) return;

    // Önceki dinleyiciyi (varsa) kapat
    if (unsubscribe) unsubscribe();

    const q = query(collection(db, "mesajlar"), orderBy("tarih", "asc"));

    unsubscribe = onSnapshot(q, (snapshot) => {
        const mesajAlani = document.getElementById("mesaj-alani");
        if(!mesajAlani) return;
        
        mesajAlani.innerHTML = "";
        
        snapshot.forEach((doc) => {
            const m = doc.data();
            // Filtre: Mesajın iki tarafı ben ve seçtiğim kişi mi?
            if ((m.gonderen === user.uid && m.alici === aliciId) || (m.gonderen === aliciId && m.alici === user.uid)) {
                const prefix = m.gonderen === user.uid ? "[YOU]:" : `[${m.gonderenAd.toUpperCase()}]:`;
                const mesajDiv = document.createElement("div");
                mesajDiv.className = "terminal-mesaj";
                mesajDiv.innerHTML = `<span class="mesaj-prefix">${prefix}</span> ${m.metin}`;
                mesajAlani.appendChild(mesajDiv);
            }
        });
        // En alta kaydır
        mesajAlani.scrollTop = mesajAlani.scrollHeight;
    });
}

// 5. MESAJ GÖNDERME FONKSİYONU
window.mesajGonder = async function() {
    const input = document.getElementById("mesaj-input");
    const user = auth.currentUser;
    const gonderenAd = document.getElementById("nav-user-name")?.innerText || "Skaikru";

    if (!input || !input.value.trim() || !aktifSohbetId || !user) return;

    try {
        await addDoc(collection(db, "mesajlar"), {
            gonderen: user.uid,
            gonderenAd: gonderenAd,
            alici: aktifSohbetId,
            metin: input.value,
            tarih: serverTimestamp()
        });
        input.value = ""; // Inputu temizle
    } catch (e) {
        console.error("Mesaj gönderilemedi:", e);
    }
};

// Enter tuşu ile gönderim
document.getElementById("mesaj-input")?.addEventListener("keypress", (e) => {
    if(e.key === "Enter") window.mesajGonder();
});

// Sistem saati
setInterval(() => {
    const d = new Date();
    const saatAlan = document.getElementById("canli-saat");
    if(saatAlan) saatAlan.innerText = d.toLocaleTimeString();
}, 1000);
