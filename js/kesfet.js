import { auth, db } from './firebase-config.js';
import { collection, getDocs, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

window.addEventListener('DOMContentLoaded', () => {
    teorileriYukle();
});async function teorileriYukle() {
    const alan = document.getElementById("teori-listesi");
    if(!alan) return;

    alan.innerHTML = "<p style='color:#00ff96; text-align:center;'>📡 Frekanslar taranıyor...</p>";

    try {
        // Firebase 'gonderiler' koleksiyonundan verileri çek
        const q = query(collection(db, "gonderiler"), orderBy("tarih", "desc"));
        const querySnapshot = await getDocs(q);
        
        alan.innerHTML = ""; // Yükleniyor yazısını sil

        querySnapshot.forEach((tDoc) => {
            const t = tDoc.data();
            // Zaman damgasını okunabilir yap
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
                        <button onclick="begen(this)"><i class="icon">🚀</i> <span class="sayi">${t.begeniSayisi || 0}</span></button>
                        <button onclick="cevapla()"><i class="icon">💬</i> Cevapla</button>
                        <button onclick="paylas()"><i class="icon">📤</i> Paylaş</button>
                    </div>
                </div>
            `;
        });

    } catch (e) {
        console.error("Teori yükleme hatası:", e);
        alan.innerHTML = "Sinyal kesildi, bağlantıyı kontrol et.";
    }
}

function teorileriBas(liste) {
    const alan = document.getElementById("teori-listesi");
    alan.innerHTML = "";

    liste.forEach(t => {
        alan.innerHTML += `
            <div class="gonderi-kutusu">
                <div class="gonderici-bilgi">
                    <img src="${t.avatar || 'img/murphy.jpg'}" class="post-avatar">
                    <div class="yazar-detay">
                        <strong>${t.yazar}</strong>
                        <span>${t.tarih}</span>
                    </div>
                    <button class="takip-btn" onclick="takipEt('${t.yazar}')">+ Takip Et</button>
                </div>
                <p class="post-metin">${t.metin}</p>
                
                <div class="etkilesim-cubugu">
                    <button onclick="begen(this)"><i class="icon">🚀</i> <span class="sayi">0</span></button>
                    <button onclick="cevapla()"><i class="icon">💬</i> Cevapla</button>
                    <button onclick="paylas()"><i class="icon">📤</i> Paylaş</button>
                </div>
            </div>
        `;
    });
}

window.teoriPaylas = async function() {
    const input = document.getElementById("teori-input");
    const user = auth.currentUser;

    if (!user) return alert("Sinyal göndermek için sisteme giriş yapmalısın!");
    if (input.value.trim() === "") return alert("Boş veri gönderilemez.");

    try {
        // Kullanıcının güncel bilgilerini al
        const userDoc = await getDoc(doc(db, "kullanicilar", user.uid));
        const userData = userDoc.data();

        await addDoc(collection(db, "gonderiler"), {
            uid: user.uid,
            kullaniciAdi: userData.kullaniciAdi || "Skaikru",
            profilResmi: userData.profilResmi || "img/murphy.jpg",
            metin: input.value,
            tarih: serverTimestamp(),
            begeniSayisi: 0
        });

        input.value = "";
        teorileriYukle(); // Listeyi yenile
        console.log("Sinyal yörüngeye oturdu! 🚀");

    } catch (e) {
        console.error("Paylaşım hatası:", e);
        alert("Bağlantı hatası: Sinyal gönderilemedi.");
    }
};
function begen(btn) {
    let sayiSpan = btn.querySelector(".sayi");
    let mevcutSayi = parseInt(sayiSpan.innerText);
    sayiSpan.innerText = mevcutSayi + 1;
    btn.style.color = "#00ff96";
}

function takipEt(isim) {
    alert(isim + " artık radarında! Ark-OS ağın genişliyor.");
}

function cevapla() {
    document.getElementById("teori-input").focus();
    document.getElementById("teori-input").placeholder = "Cevabını buraya yaz...";
}

function paylas() {
    alert("Teori Ark-OS frekansına yansıtıldı!");
}

// Güncellenmiş skaikruBul: Bağlantı durumunu kontrol eder
window.skaikruBul = async function() {
    const alan = document.getElementById("gercek-kullanici-listesi"); 
    alan.innerHTML = "<p style='color:#00ff96; text-align:center; font-size:0.8rem;'>📡 Sinyaller taranıyor...</p>";

    try {
        const userSnapshot = await getDocs(collection(db, "kullanicilar"));

        const takipSnapshot = await getDocs(collection(db, "takip"));
        
      
        const takipEdilenler = [];
        takipSnapshot.forEach(tDoc => {
            if(tDoc.data().takipEden === auth.currentUser?.uid) {
                takipEdilenler.push(tDoc.data().takipEdilen);
            }
        });

        alan.innerHTML = ""; 

        userSnapshot.forEach((uDoc) => {
            if (uDoc.id !== auth.currentUser?.uid) {
                const veri = uDoc.data();
                
                const zatenTakipte = takipEdilenler.includes(uDoc.id);
                const btnMetin = zatenTakipte ? "✔️ Bağlantı Kuruldu" : "+ Bağlantı Kur";
                const btnStyle = zatenTakipte ? "background:#00ff96; color:#000;" : "";
                const btnDisabled = zatenTakipte ? "disabled" : "";

                alan.innerHTML += `
                    <div class="gonderi-kutusu" id="kart-${uDoc.id}" style="border: 1px solid rgba(0,255,150,0.3); margin-bottom:15px;">
                        <div class="gonderici-bilgi">
                            <img src="${veri.profilResmi || 'img/murphy.jpg'}" class="post-avatar" style="width:35px !important; height:35px !important;">
                            <div class="yazar-detay">
                                <strong style="font-size:0.9rem;">${veri.kullaniciAdi}</strong>
                                <span style="font-size:0.6rem;">DÜNYA SAVAŞÇISI</span>
                            </div>
                            <button id="btn-${uDoc.id}" class="takip-btn" 
                                onclick="takipEt('${uDoc.id}', '${veri.kullaniciAdi}')" 
                                style="font-size:0.6rem; padding:5px 10px; ${btnStyle}" ${btnDisabled}>
                                ${btnMetin}
                            </button>
                        </div>
                    </div>
                `;
            }
        });
    } catch (error) {
        console.error("Tarama hatası:", error);
    }
};

window.takipEt = async function(id, ad) {
    const user = auth.currentUser;
    const btn = document.getElementById(`btn-${id}`);
    
    if(!user) return alert("Sisteme erişimin yok!");

    btn.innerText = "⌛ Bağlanıyor...";
    btn.disabled = true;

    try {
        await setDoc(doc(db, "takip", `${user.uid}_${id}`), {
            takipEden: user.uid,
            takipEdilen: id,
            takipEdilenAd: ad,
            tarih: serverTimestamp()
        });

        btn.innerText = "✔️ Bağlantı Kuruldu";
        btn.style.background = "#00ff96";
        btn.style.color = "#000";
        
        console.log(`${ad} ile frekans eşleşti.`);
    } catch (e) {
        console.error("Bağlantı hatası:", e);
        btn.innerText = "+ Bağlantı Kur";
        btn.disabled = false;
        alert("Bağlantı başarısız.");
    }

};
