// Sayfa yüklendiğinde çalışacak ana motor
window.addEventListener('DOMContentLoaded', () => {
    const ad = localStorage.getItem("skaikru_ad") || "Skaikru";
    
    // Sidebar ve Üst kısımdaki profil resmini/ismini güncelle
    const profilKutu = document.querySelector(".profil-kutu");
    if (profilKutu) {
        // Eğer daha önce isim eklenmediyse ekle
        if(!document.getElementById("nav-user-name")) {
            profilKutu.innerHTML += `<span id="nav-user-name" style="color:#00ff96; font-size:0.8rem; display:block; text-align:center;">${ad}</span>`;
        }
    }

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