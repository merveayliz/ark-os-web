const resimEslesme = {
    clarke: "clark.jpg",
    murphy: "murphy.jpg",
    raven: "raven.jpg",
    bellamy: "bellamy.jpg",
    wells: "wells.jpg"
};


window.testiHazirla = function(tur) {
    if (!sorular[tur]) return; 
    secilenTur = tur;
    suankiTest = sorular[tur];
    suankiSoruIndeks = 0;
    puanlar = { dogru: 0, clarke: 0, murphy: 0, raven: 0, bellamy: 0, wells: 0 };
    
    document.getElementById("test-secim").classList.add("gizli");
    document.getElementById("soru-konteynir").classList.remove("gizli");
    
    window.baslatOksijen(); 
    window.soruyuGoster(); 
};

window.sonrakiSoru = function() {
    const secilen = document.querySelector('input[name="soru"]:checked');
    if (!secilen) return alert("Sistem uyarısı: Bir seçenek belirleyin!");
    
    window.puanlariHesapla(secilen.value); 
    suankiSoruIndeks++;
    window.soruyuGoster(); 
};

window.sonucuHesapla = function() {
    const secilen = document.querySelector('input[name="soru"]:checked');
    if (secilen) puanlariHesapla(secilen.value);

    clearInterval(oksijenTimer);
    const modal = document.getElementById("soz-modal");
    const icerik = document.getElementById("sonuc-penceresi");
    if(!modal || !icerik) return;
    
    let finalBaslik = "";
    let finalAciklama = "";
    let karakterResmi = "";

    if (secilenTur.includes("bilgi")) {
        finalBaslik = `ANALİZ: ${puanlar.dogru} / ${suankiTest.length}`;
        finalAciklama = puanlar.dogru >= (suankiTest.length / 2) ? "Gerçek bir hayatta kalan!" : "Radyasyon seni bitirdi...";
        karakterResmi = "img/icon.jpg"; 
    } else {
        let enYuksekSkor = -1;
        let kazanan = "";
        for (let k in puanlar) {
            if (k !== 'dogru' && puanlar[k] > enYuksekSkor) {
                enYuksekSkor = puanlar[k];
                kazanan = k;
            }
        }
        finalBaslik = `RUHUN: ${kazanan.toUpperCase()}`;
        finalAciklama = "The 100 dünyasındaki yansımanı buldun. May we meet again.";
        karakterResmi = `img/${resimEslesme[kazanan] || 'murphy.jpg'}`; 
    }

    icerik.innerHTML = `
        <span class="kapat-btn" onclick="location.reload()">&times;</span>
        <div class="sonuc-kart">
            <img src="${karakterResmi}" alt="Sonuç" class="sonuc-img" style="width:150px; border-radius:10px;">
            <h2 style="color:#00ff96; margin-top:15px;">${finalBaslik}</h2>
            <p style="color:white; margin: 10px 0;">${finalAciklama}</p>
            <button onclick="location.reload()" class="inis-btn">YENİDEN BAŞLAT</button>
        </div>
    `;
    modal.style.display = "block";
};

window.addEventListener('DOMContentLoaded', () => {
    const skaikruAd = localStorage.getItem("skaikru_ad") || "Bilinmeyen Savaşçı";
    const profilKutu = document.querySelector(".profil-kutu");
    if (profilKutu) {
        profilKutu.innerHTML += `<span style="color:#00ff96; font-size:0.9rem; font-family:'Fira Code'; margin-left:10px;">${skaikruAd}</span>`;
    }
});
const sorular = {
    kitap_bilgi: [
        { s: "Kitapta Clarke'ın anne ve babası ne iş yapıyordu?",
          a: ["Doktorlar", "Meclis Üyeleri", "Mühendisler"], 
          c: 0 },

        { s: "Dünyaya gönderilen gençlere ne ad veriliyordu?", 
          a: ["Yeni bir koloni kurmaları için", 
              "Dünya’nın yaşanabilir olup olmadığını test etmeleri için",
              "Uzay gemisindeki isyanı bastırmaları için"], 
          c: 1 },

         { s: "100 genç neden Dünya’ya gönderiliyor?",
           a: ["Yeni bir koloni kurmaları için",
               "Dünya’nın yaşanabilir olup olmadığını test etmeleri için",
               "Uzay gemisindeki isyanı bastırmaları için"], 
           c: 1},

        { s: "Clarke Griffin’in ailesiyle ilgili hangisi doğrudur?", 
          a: ["İki ebeveyni de hâlâ hayattadır",
              "Babası idam edilmiştir", 
              "Ailesi Dünya’ya ilk gönderilenlerdendir"], 
          c: 1},

         { s: "Bellamy’nin gizlice Dünya’ya gitme sebebi nedir?", 
           a: ["Clarke’a aşık olduğu için",
               "Kız kardeşi Octavia’yı korumak için", 
               "Konseyden kaçtığı için"], 
           c: 1},

        { s: "Glass karakteriyle ilgili hangisi doğrudur?",
          a: ["Dünya’ya gönderilen 100 gençten biridir",
             "Uzay gemisinde kalır ve hamiledir", 
             "Aslında Grounder’dır"], 
          c: 1 },

        { s: "Wells’in Dünya’ya gitme motivasyonu nedir?", 
          a: ["Macera yaşamak istemesi",
             "Clarke’ı korumak istemesi",
              "Konsey tarafından sürgün edilmesi"], 
          c: 1 },


        { s: "Kitapta Clarke'ın anne ve babası ne iş yapıyordu?",
          a: ["Doktorlar", "Meclis Üyeleri", "Mühendisler"], 
          c: 1 },


        { s: "Kitapların ana çatışmalarından biri nedir?", 
          a: ["Uzaylı istilası",
             "Dünya’daki hayatta kalma mücadelesi ve insanlar arası güç çatışmaları",
              "Zaman yolculuğu deneyleri"], 
          c: 1}

    ],
    kitap_karakter: [
      { s: "Bir kriz anında önceliğin nedir?", 
        a: ["Halkımın güvenliği", "Kendi özgürlüğüm", "Sevdiklerimi korumak"], 
        p: ["clarke", "bellamy", "wells"] },

      { s: "Sana verilen bir emri sorgular mısın?", 
        a: ["Asla", "Duruma göre", "Ben emir almam"], 
        p: ["wells", "clarke", "bellamy"] },
      
      { s: "Liderlik senin için ne ifade eder?", 
        a: ["Sorumluluk ve fedakârlık", "Güç ve kontrol", "Adaletli kararlar"], 
        p: ["clarke", "bellamy", "wells"] },
      
      { s: "Zor bir karar verirken neye güvenirsin?", 
        a: ["Mantığıma", "İçgüdülerime", "Ahlaki değerlerime"], 
        p: ["clarke", "bellamy", "wells"] },
      
      { s: "Grup içinde genelde hangi rolü üstlenirsin?", 
        a: ["Stratejist", "Koruyucu", "Arabulucu"], 
        p: ["clarke", "bellamy", "wells"] },
      
      { s: "Kurallar hakkında ne düşünürsün?", 
        a: ["Gerekirse çiğnenebilir", "Düzeni sağlar", "Herkes için eşit olmalı"], 
        p: ["bellamy", "clarke", "wells"] },
      
      { s: "Bir hata yaptığında ne yaparsın?", 
        a: ["Sonuçlarına katlanırım", "Gizlemeye çalışırım", "Telafi etmeye uğraşırım"], 
        p: ["clarke", "bellamy", "wells"] }
      
    ],

    dizi_bilgi: [
      { s: "Lexa'nın ölümünden sonra hangi klanın adayı kazandı?", 
        a: ["Azgeda", "Trikru", "Skaikru"], 
        c: 0 },

      { s: "İlk sezonda Dünya'ya kaç genç gönderildi?", 
        a: ["99", "100", "101"], 
        c: 1 },
      
      { s: "Clarke'e 'Wanheda' lakabını kimler vermiştir?", 
        a: ["Skaikru", "Grounderlar", "Dağ Adamları"], 
        c: 1 },
      
      { s: "Mount Weather'da yaşayan insanlara ne ad verilir?", 
        a: ["Grounder", "Sky People", "Mountain Men"], 
        c: 2 },
      
      { s: "Octavia'nın Grounder kimliği nedir?", 
        a: ["Heda", "Osleya", "Skairipa"], 
        c: 2 },
      
      { s: "A.L.I.E. aslında nedir?", 
        a: ["Bir uzay gemisi", "Yapay zeka", "Nükleer silah sistemi"], 
        c: 1 },

    ],

   dizi_karakter: [
    { s: "Savaş kapıda, ne yaparsın?", 
      a: ["Halkım için kendimi feda ederim", "Ne pahasına olsun hayatta kalırım", "Mantıklı bir plan yaparım"], 
      p: ["clarke", "murphy", "raven"] },

    { s: "Zor bir seçim yapman gerekirse hangisini seçersin?", 
      a: ["Mantık", "Duygu", "Hayatta Kalma"], 
      p: ["raven", "clarke", "murphy"] },

    { s: "Grup içinde genelde hangi roldesin?", 
      a: ["Lider", "Tek başına takılan", "Teknik beyin"], 
      p: ["clarke", "murphy", "raven"] },

    { s: "Birisi sana ihanet ederse ne yaparsın?", 
      a: ["Affetmem", "Duruma göre değişir", "Mantıklı sebebi varsa anlarım"], 
      p: ["clarke", "murphy", "raven"] },

    { s: "En büyük gücün nedir?", 
      a: ["Kararlılık", "Hayatta kalma içgüdüsü", "Zeka"], 
      p: ["clarke", "murphy", "raven"] },

    { s: "Kurallar senin için ne ifade eder?", 
      a: ["Gerekirse çiğnenir", "Beni bağlamaz", "Düzen için gereklidir"], 
      p: ["clarke", "murphy", "raven"] },

    { s: "Tehlikeli bir görevde rolün ne olur?", 
      a: ["Kararı ben veririm", "Kendimi kurtarmaya bakarım", "Sistemi çözen kişi olurum"], 
      p: ["clarke", "murphy", "raven"] },

    { s: "Bir hata yaptığında nasıl tepki verirsin?", 
      a: ["Sorumluluğu alırım", "Suçu başkasına atarım", "Çözüm üretmeye çalışırım"], 
      p: ["clarke", "murphy", "raven"] },

    { s: "Seni en çok ne motive eder?", 
      a: ["İnsanları korumak", "Hayatta kalmak", "Bir şeyi başarmak"], 
      p: ["clarke", "murphy", "raven"] },

    { s: "Liderine güvenmiyorsan ne yaparsın?", 
      a: ["Yerine geçerim", "Kendi yoluma giderim", "Daha iyi bir plan sunarım"], 
      p: ["clarke", "murphy", "raven"] }
]

};

let suankiTest = [];
let suankiSoruIndeks = 0;
let puanlar = { dogru: 0, clarke: 0, murphy: 0, raven: 0, bellamy: 0, wells: 0 }; 
let oksijen = 100;
let oksijenTimer;
let secilenTur = "";

window.soruyuGoster = function() {
    const soru = suankiTest[suankiSoruIndeks];
    const soruMetni = document.getElementById("soru-metni");
    const seceneklerAlan = document.getElementById("secenekler-listesi");
    const sonrakiBtn = document.getElementById("sonraki-btn");
    const analizBtn = document.getElementById("analiz-btn");

    soruMetni.innerText = `${suankiSoruIndeks + 1}. VERİ PAKETİ: ${soru.s}`;
    seceneklerAlan.innerHTML = "";

    soru.a.forEach((secenek, i) => {
        seceneklerAlan.innerHTML += `
            <label class="secenek">
                <input type="radio" name="soru" value="${i}"> ${secenek}
            </label>
        `;
    });


    if (suankiSoruIndeks === suankiTest.length - 1) {
        sonrakiBtn.classList.add("gizli");
        analizBtn.classList.remove("gizli");
    } else {
        sonrakiBtn.classList.remove("gizli");
        analizBtn.classList.add("gizli");
    }
}


window.sonrakiSoru = function() {
    const secilen = document.querySelector('input[name="soru"]:checked');
    if (!secilen) return alert("Sistem uyarısı: Bir seçenek belirleyin!");
    puanlariHesapla(secilen.value);
    suankiSoruIndeks++;
    soruyuGoster();
}

window.puanlariHesapla = function(secimValue) {
    const soru = suankiTest[suankiSoruIndeks];
    if (secilenTur.includes("bilgi")) {
        if (parseInt(secimValue) === soru.c) puanlar.dogru++;
    } else {
        const karakter = soru.p[secimValue];
        puanlar[karakter]++;
    }
}

window.baslatOksijen = function() {
    oksijen = 100;
    const saat = document.getElementById("test-saat");
    clearInterval(oksijenTimer);
    
    oksijenTimer = setInterval(() => {
        oksijen--;
        saat.innerText = `OKSİJEN: %${oksijen}`;
        if (oksijen <= 20) saat.style.color = "red";
        if (oksijen <= 0) {
            clearInterval(oksijenTimer);
            alert("OKSİJEN BİTTİ! ANALİZ ZORUNLU OLARAK BAŞLATILIYOR.");
            sonucuHesapla();
        }
    }, 1000);
}




