// js/sohbet.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let aktifSohbetId = null;

// 1. OTURUM KONTROLÜ VE BAŞLANGIÇ
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Navbar Profil Bilgileri
        const userDoc = await getDoc(doc(db, "kullanicilar", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            if(document.getElementById("nav-user-name")) document.getElementById("nav-user-name").innerText = data.kullaniciAdi;
            if(document.getElementById("nav-avatar") && data.profilResmi) document.getElementById("nav-avatar").src = data.profilResmi;
        }
        // Hem botları hem gerçek takipçileri yükle
        sinyalleriYukle(user.uid);
    } else {
        window.location.href = "index.html";
    }
});

// js/sohbet.js içindeki sinyalleriYukle fonksiyonunu bununla değiştir:

async function sinyalleriYukle(uid) {
    const liste = document.getElementById("arkadas-slotlari"); // Yeni ID'yi kullanıyoruz
    if(!liste) return;

    liste.innerHTML = "";

    // Hayali arkadaşlar (Botlar) - Profil resimlerini senin klasöründekilerle eşledim
    const botlar = [
        { id: "bot_clarke", ad: "Clarke Griffin", unvan: "Wanheda", resim: "img/clark.jpg" },
        { id: "bot_bellamy", ad: "Bellamy Blake", unvan: "Lider", resim: "img/bellamy.jpg" },
        { id: "bot_murphy", ad: "John Murphy", unvan: "Hayatta Kalan", resim: "img/murphy.jpg" }
    ];

    let htmlIcerik = "";

    // Bot Kartlarını Oluştur
    botlar.forEach(bot => {
        htmlIcerik += `
            <div class="arkadas-kart bot-ayar" onclick="sohbetiAc('${bot.id}', '${bot.ad}')">
                <div class="kart-profil-resim">
                    <img src="${bot.resim}" alt="${bot.ad}">
                </div>
                <div class="kart-bilgi">
                    <span class="kart-isim">${bot.ad} <small>(BOT)</small></span>
                    <span class="kart-durum">MESAJ AT</span>
                </div>
            </div>
        `;
    });

    // Gerçek Sinyalleri Ekle
    try {
        const q = query(collection(db, "takip"), where("takipEden", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const v = doc.data();
            htmlIcerik += `
                <div class="arkadas-kart" onclick="sohbetiAc('${v.takipEdilen}', '${v.takipEdilenAd}')">
                    <div class="kart-profil-resim">
                        <img src="img/murphy.jpg" alt="Skaikru"> 
                    </div>
                    <div class="kart-bilgi">
                        <span class="kart-isim">${v.takipEdilenAd.toUpperCase()}</span>
                        <span class="kart-durum">BAĞLANTI_KURULDU</span>
                    </div>
                </div>
            `;
        });
    } catch (e) { console.error(e); }

    liste.innerHTML = htmlIcerik;
}

// 3. SOHBETİ AÇ VE MESAJLARI DİNLE
window.sohbetiAc = function(id, ad) {
    aktifSohbetId = id;
    document.querySelector(".baslik-sol").innerText = `MISSION_CHAT: ${ad.toUpperCase()}`;
    const mesajAlani = document.getElementById("mesaj-alani");
    mesajAlani.innerHTML = `<div class="sistem-notu">[ENCRYPTING_CHANNEL_WITH_${ad.toUpperCase()}]</div>`;
    
    mesajlariDinle(id);
};

// 4. MESAJLARI ANLIK GETİR (Kalıcı Kayıt)
function mesajlariDinle(aliciId) {
    const user = auth.currentUser;
    if(!user) return;

    const q = query(collection(db, "mesajlar"), orderBy("tarih", "asc"));

    onSnapshot(q, (snapshot) => {
        const mesajAlani = document.getElementById("mesaj-alani");
        mesajAlani.innerHTML = "";
        
        snapshot.forEach((doc) => {
            const m = doc.data();
            // Seninle alıcı arasındaki mesaj trafiği
            if ((m.gonderen === user.uid && m.alici === aliciId) || (m.gonderen === aliciId && m.alici === user.uid)) {
                const prefix = m.gonderen === user.uid ? "[YOU]:" : `[${m.gonderenAd || 'STRANGER'}]:`;
                const mesajDiv = document.createElement("div");
                mesajDiv.className = "terminal-mesaj";
                mesajDiv.innerHTML = `<span class="mesaj-prefix">${prefix}</span> ${m.metin}`;
                mesajAlani.appendChild(mesajDiv);
            }
        });
        mesajAlani.scrollTop = mesajAlani.scrollHeight;
    });
}

// 5. MESAJ GÖNDER (Firebase'e kaydeder)
window.mesajGonder = async function() {
    const input = document.getElementById("mesaj-input");
    const user = auth.currentUser;

    if (!input.value.trim() || !aktifSohbetId || !user) return;

    try {
        await addDoc(collection(db, "mesajlar"), {
            gonderen: user.uid,
            gonderenAd: document.getElementById("nav-user-name").innerText || "Skaikru",
            alici: aktifSohbetId,
            metin: input.value,
            tarih: serverTimestamp()
        });
        input.value = "";
    } catch (e) {
        console.error("Signal Lost:", e);
    }
};

// Klavye Desteği
document.getElementById("mesaj-input")?.addEventListener("keypress", (e) => {
    if(e.key === "Enter") window.mesajGonder();
});

// Terminal Saati
setInterval(() => {
    const d = new Date();
    document.getElementById("canli-saat").innerText = d.toLocaleTimeString();
}, 1000);