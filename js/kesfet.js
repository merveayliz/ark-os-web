import { auth, db } from './firebase-config.js';
import { collection, getDocs, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- 1. MEVCUT LOKAL TEORİLERİ YÜKLE (Senin Eski Kodun) ---
window.addEventListener('DOMContentLoaded', () => {
    teorileriYukle();
});
function teorileriYukle() {
   
    const hazirVeriler = [
        { 
            yazar: "Clarke Griffin", 
            metin: "Mount Weather bir seçenek değil, zorunluluktu. Kimse aksini iddia etmesin.", 
            tarih: "12:45", 
            avatar: "img/clark.jpg" 
        },
        { 
            yazar: "John Murphy", 
            metin: "Yine mi kahramanlık yapıyoruz? Ben sadece kokteylimi içmek istiyorum.", 
            tarih: "10:20", 
            avatar: "img/murphy.jpg" 
        }
    ];

    let kullaniciTeorileri = JSON.parse(localStorage.getItem("ark_teoriler")) || [];
    
    const tumAkis = [...kullaniciTeorileri, ...hazirVeriler];
    
    teorileriBas(tumAkis);
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

function teoriPaylas() {
    const input = document.getElementById("teori-input");
    const kullaniciAd = localStorage.getItem("skaikru_ad") || "Skaikru";
    
    if (input.value.trim() === "") {
        alert("Sistem Hatası: Boş veri gönderilemez.");
        return;
    }

    const yeniTeori = {
        yazar: kullaniciAd,
        metin: input.value,
        tarih: "Az önce",
        avatar: "img/murphy.jpg" 
    };

    let veriler = JSON.parse(localStorage.getItem("ark_teoriler")) || [];
    veriler.unshift(yeniTeori);
    localStorage.setItem("ark_teoriler", JSON.stringify(veriler));

    input.value = "";
    teorileriYukle(); 
}

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
        // 1. Önce tüm kullanıcıları çek
        const userSnapshot = await getDocs(collection(db, "kullanicilar"));
        // 2. Sonra senin takip ettiklerini çek (Buton durumu için)
        const takipSnapshot = await getDocs(collection(db, "takip"));
        
        // Senin takip ettiğin kişilerin ID'lerini bir listeye alalım
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
                
                // EĞER bu kullanıcı takip edilenler listesindeyse butonu farklı bas
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

// js/kesfet.js içindeki takipEt fonksiyonunu bununla değiştir
window.takipEt = async function(id, ad) {
    const user = auth.currentUser;
    const btn = document.getElementById(`btn-${id}`);
    
    if(!user) return alert("Sisteme erişimin yok!");

    // Butonu hemen güncelle ki kullanıcı etkileşimi hissetsin
    btn.innerText = "⌛ Bağlanıyor...";
    btn.disabled = true;

    try {
        // Firebase 'takip' koleksiyonuna kaydet (Mesajlaşma altyapısı burası)
        await setDoc(doc(db, "takip", `${user.uid}_${id}`), {
            takipEden: user.uid,
            takipEdilen: id,
            takipEdilenAd: ad,
            tarih: serverTimestamp()
        });

        // Başarılı olunca butonu kalıcı olarak değiştir
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