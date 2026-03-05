// js/kesfet.js - GÜNCEL VE HATASIZ VERSİYON
import { auth, db } from './firebase-config.js';
import { 
    collection, 
    getDocs, 
    doc, 
    setDoc, 
    getDoc, 
    addDoc, 
    serverTimestamp, 
    query, 
    orderBy, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- 1. TEORİLERİ / GÖNDERİLERİ YÜKLE (TÜM KULLANICILAR İÇİN) ---
// onSnapshot kullanıyoruz ki sayfa yenilenmeden yeni postlar anında düşsün!
function teorileriYukle() {
    const alan = document.getElementById("teori-listesi");
    if (!alan) return;

    // Firebase'deki 'gonderiler' koleksiyonunu tarihe göre sıralayıp dinliyoruz
    const q = query(collection(db, "gonderiler"), orderBy("tarih", "desc"));

    onSnapshot(q, (snapshot) => {
        alan.innerHTML = ""; // Önce alanı temizle

        snapshot.forEach((tDoc) => {
            const t = tDoc.data();
            // Tarih verisi varsa formatla, yoksa "Şimdi" yaz
            const zaman = t.tarih ? new Date(t.tarih.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Az önce";

            alan.innerHTML += `
                <div class="gonderi-kutusu">
                    <div class="gonderici-bilgi">
                        <img src="${t.profilResmi || 'img/murphy.jpg'}" class="post-avatar">
                        <div class="yazar-detay">
                            <strong>${t.kullaniciAdi}</strong>
                            <span>${zaman}</span>
                        </div>
                        <button class="takip-btn" onclick="takipEt('${t.uid}', '${t.kullaniciAdi}')">+ Takip Et</button>
                    </div>
                    <p class="post-metin">${t.metin}</p>
                    <div class="etkilesim-cubugu">
                        <button onclick="begen('${tDoc.id}')"><i class="icon">🚀</i> <span class="sayi">${t.begeniSayisi || 0}</span></button>
                        <button onclick="cevapla()"><i class="icon">💬</i> Cevapla</button>
                        <button onclick="paylas()"><i class="icon">📤</i> Paylaş</button>
                    </div>
                </div>
            `;
        });
    });
}

// Sayfa yüklendiğinde otomatik başlat
window.addEventListener('DOMContentLoaded', () => {
    teorileriYukle();
});

// --- 2. TEORİ PAYLAŞ (HERKESİN GÖRECEĞİ ŞEKİLDE) ---
window.teoriPaylas = async function() {
    const input = document.getElementById("teori-input");
    const user = auth.currentUser;

    if (!user) {
        alert("Sinyal göndermek için önce giriş yapmalısın!");
        return;
    }

    if (!input.value.trim()) {
        alert("Boş veri gönderilemez.");
        return;
    }

    try {
        // Gönderen kişinin güncel bilgilerini Firestore'dan al
        const userDoc = await getDoc(doc(db, "kullanicilar", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        // Firebase 'gonderiler' koleksiyonuna ekle
        await addDoc(collection(db, "gonderiler"), {
            uid: user.uid,
            kullaniciAdi: userData.kullaniciAdi || "Skaikru",
            profilResmi: userData.profilResmi || "img/murphy.jpg",
            metin: input.value,
            tarih: serverTimestamp(),
            begeniSayisi: 0
        });

        input.value = ""; // Kutuyu temizle
        console.log("Sinyal yörüngeye oturdu! 🚀");
    } catch (e) {
        console.error("Paylaşım hatası:", e);
        alert("Bağlantı hatası!");
    }
};

// --- 3. DİĞER FONKSİYONLAR (BOZMADAN GÜNCELLEDİK) ---

window.begen = function(id) {
    // Şimdilik sadece görsel efekt, Firebase entegrasyonu sonra eklenebilir
    alert("Sinyal güçlendirildi! (ID: " + id + ")");
};

window.takipEt = async function(id, ad) {
    const user = auth.currentUser;
    if(!user) return alert("Sisteme erişimin yok!");

    try {
        await setDoc(doc(db, "takip", `${user.uid}_${id}`), {
            takipEden: user.uid,
            takipEdilen: id,
            takipEdilenAd: ad,
            tarih: serverTimestamp()
        });
        alert(ad + " artık radarında!");
    } catch (e) {
        console.error(e);
    }
};

window.cevapla = () => {
    document.getElementById("teori-input").focus();
    document.getElementById("teori-input").placeholder = "Cevabını buraya yaz...";
};

window.paylas = () => alert("Teori Ark-OS frekansına yansıtıldı!");

// Kullanıcı bulma sistemi
window.skaikruBul = async function() {
    const alan = document.getElementById("gercek-kullanici-listesi"); 
    if(!alan) return;
    alan.innerHTML = "📡 Taranıyor...";

    try {
        const userSnapshot = await getDocs(collection(db, "kullanicilar"));
        alan.innerHTML = ""; 
        userSnapshot.forEach((uDoc) => {
            if (uDoc.id !== auth.currentUser?.uid) {
                const veri = uDoc.data();
                alan.innerHTML += `
                    <div class="gonderi-kutusu">
                        <div class="gonderici-bilgi">
                            <img src="${veri.profilResmi || 'img/murphy.jpg'}" class="post-avatar">
                            <div class="yazar-detay"><strong>${veri.kullaniciAdi}</strong></div>
                            <button class="takip-btn" onclick="takipEt('${uDoc.id}', '${veri.kullaniciAdi}')">+ Bağlantı Kur</button>
                        </div>
                    </div>`;
            }
        });
    } catch (e) { console.error(e); }
};
