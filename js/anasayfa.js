
window.addEventListener('DOMContentLoaded', () => {
    const skaikruAd = localStorage.getItem("skaikru_ad") || "Bilinmeyen Savaşçı";
   
    const profilKutu = document.querySelector(".profil-kutu");
    if(profilKutu) {
        profilKutu.innerHTML += `<span style="color:var(--ana-neon); font-size:0.9rem;">${skaikruAd}</span>`;
    }

    karakterleriGoster(); 
});
const karakterler = [
    { 
        isim: "Clarke Griffin", 
        klan: "Skaikru", 
        unvan: "Wanheda (Ölüm Komutanı)", 
        ozet: "Halkı için her türlü zor kararı alan, fedakar bir lider.The 100’ün baş kahramanı; güçlü, zeki ve vicdanlı bir lider. Sık sık hayatta kalma ile insanilik arasında zor seçimler yapar ve Wanheda (Ölüm Komutanı) olarak bilinir",
        resim: "img/clark.jpg",
        replik: "I bear it so they don’t have to."
    },
    { 
        isim: "Bellamy Blake", 
        klan: "Skaikru", 
        unvan: "İsyancı Lider", 
        ozet: "Kardeşini korumakla başlayan yolculuğu, insanlığın kurtarıcılarından birine dönüştü.Clarke’ın ortağı ve zor durumlarda liderlik yapan savaşçı. Başta asi bir figür iken zamanla daha derin ve fedakâr biri olur",
        resim: "img/bellamy.jpg",
        replik:"Maybe life should be about more than just surviving."
    },
    { 
        isim: "Octavia Blake", 
        klan: "Trikru / Wonkru", 
        unvan: "Blodreina", 
        ozet: "Zemin altından çıkan bir kraliçe; savaşçı ruhun en büyük temsilcisi.",
        resim: "img/octevia.jpg",
        replik:"You are Wonkru, or you are the enemy of Wonkru. Choose!"
    },
    { 
        isim: "Lexa", 
        klan: "Trikru", 
        unvan: "Heda (Komutan)", 
        ozet: "Klanları birleştiren bilge ve güçlü lider. 'Aşk zayıflıktır' derdi ama yanıldı.",
        resim: "img/lexa.jpg",
        replik:"Jus drein jus daun" 
    },
    { 
        isim: "John Murphy", 
        klan: "Skaikru", 
        unvan: "Hayatta Kalan", 
        ozet: "Dizinin en ilginç dönüşümü; sadece kendini düşünürken bir kahramana dönüştü.",
        resim: "img/murphy.jpg",
        replik:"In this world, when people leave, they don’t come back."
    },
    { 
        isim: "Raven Reyes", 
        klan: "Skaikru", 
        unvan: "Teknik Deha", 
        ozet: "Sıfır yerçekiminde tamir yapabilen, acıyı güce dönüştüren dahi mühendis.",
        resim: "img/raven.jpg",
        replik:"Nothing can stop us if we work together."
    },
    { 
        isim: "Lincoln", 
        klan: "Trikru", 
        unvan:"Fedai", 
        ozet: "Skaikru ve Trikru arasındaki ilk köprü, Octavia'nın büyük aşkı.", 
        resim: "img/lincoln.jpg",
        replik:"From water we are born, to water we return."
    },
    { 
        isim: "Monty Green", 
        klan: "Skaikru", 
        unvan: "Ziraat Dehası", 
        ozet: "Dünya'yı yaşanabilir kılan, grubun vicdanı.Tüm grubun mühendis ve bilim beyni; barışçıl ve idealisttir.", 
        resim: "img/monty.jpg",
        replik:"We always figure something out." 
    },
    { 
        isim: "Jasper Jordan", 
        klan: "Skaikru", 
        unvan: "Kaybolan Ruh", 
        ozet: "Dünya'nın acısına dayanamayan, neşesini kaybetmiş bir dost.", 
        resim: "img/jasper.jpg",
        replik:"Sounds like a terrible idea. I’m in." 
    },
    { 
        isim: "Harper McIntyre", 
        klan: "Skaikru", 
        unvan: "Sadık Savaşçı", 
        ozet: "Monty'nin hayat arkadaşı ve Ark'ın cesur kızı.", 
        resim: "img/harper.jpg"
    },
    { 
        isim: "Nyko", 
        klan: "Trikru", 
        unvan: "Şifacı", 
        ozet: "Lincoln'ün sadık dostu, barış yanlısı bir sağlıkçı.", 
        resim: "img/nyko.jpg",
        replik:"I did do something. I saved your life. Now run."
    },
    { 
        isim: "Finn Collins", 
        klan: "Skaikru", 
        unvan: "Barış Gönüllüsü", 
        ozet: "Aşkı için karanlığa gömülen 'Spacewalker'.", 
        resim: "img/finn.jpg",
        replik:"Everything that’s happened… all that matters is that you’re okay."
    },
    { 
        isim: "Thelonious Jaha", 
        klan: "Skaikru", 
        unvan: "Başkan (Chancellor)", 
        ozet: "Halkını Işık Şehri'ne götüren vizyoner lider.", 
        resim: "img/jaha.jpg",
        replik:"Good can come out of even the darkest acts."
    },
    { 
        isim: "Wells Jaha", 
        klan: "Skaikru", 
        unvan: "Prens", 
        ozet: "Jaha'nın oğlu, Clarke'ın çocukluk dostu; erken giden adalet.", 
        resim: "img/weels.jpg",
        replik:"Your secret’s safe with me. I promise" 
    },
    { 
        isim: "Abby Griffin", 
        klan: "Skaikru", 
        unvan: "Baş Tabip", 
        ozet: "Clarke'ın annesi, tıbbi deha ve Konsey üyesi.", 
        resim: "img/abby.jpg",
        replik:"I choose to make sure that we deserve to stay alive.”"
    },
    { 
        isim: "Marcus Kane", 
        klan: "Skaikru", 
        unvan: "Diplomat", 
        ozet: "Katı kurallardan merhamete uzanan muazzam bir değişim.", 
        resim: "img/marcus.jpg" 
    },
    { 
        isim: "Jake Griffin", 
        klan: "Skaikru", 
        unvan: "Mühendis", 
        ozet: "Abby'nin eşi, Ark'ın sırrını ifşa ettiği için öldürülen baba.", 
        resim: "img/jake.jpg" 
    },
    {
        isim: "Levitt", 
        klan: "Disciple", 
        unvan: "Bardo Bilgini", 
        ozet: "Octavia'ya aşık olan ve Bardo'nun sırlarını veren yardımcı.", 
        resim: "img/levvit.jpg" 
    },
    { 
        isim: "Ilian", 
        klan: "Trishanakru", 
        unvan: "İntikamcı", 
        ozet: "Teknolojiden nefret eden ama Octavia ile yol kesiştiren zeminli.", 
        resim: "img/illan.jpg" 
    }

];

window.addEventListener('DOMContentLoaded', () => {
    karakterleriGoster();
});


function karakterleriGoster() {
    let alan = document.getElementById("karakterler-alani");
    alan.innerHTML = "";

    karakterler.forEach(kisi => {
        alan.innerHTML += `
            <div class="kart">
                <div class="kart-resim">
                    <img src="${kisi.resim}" alt="${kisi.isim}">
                </div>
                <h3>${kisi.isim}</h3>
                <p class="klan">${kisi.klan}</p>
                <span class="unvan">${kisi.unvan}</span>
                <p class="ozet">${kisi.ozet}</p>
            </div>
        `;
    });
}
karakterleriGoster();

function karakterleriGoster() {
    let alan = document.getElementById("karakterler-alani");
    if(!alan) return; 
    
    alan.innerHTML = ""; 

    karakterler.forEach((kisi, sira) => {
        alan.innerHTML += `
            <div class="kart" onclick="modalAc(${sira})"> 
                <div class="kart-resim">
                    <img src="${kisi.resim}" alt="${kisi.isim}">
                </div>
                <h3>${kisi.isim}</h3>
                <p class="klan" style="color: #00ff96; font-size: 0.8rem;">${kisi.klan || 'Zeminli'}</p>
                <span class="unvan">${kisi.unvan}</span>
                <p class="ozet">${kisi.ozet}</p>
            </div>
        `;
    });
}

function modalAc(siraNo) {
   
    const secilenKarakter = karakterler[siraNo];
    document.getElementById("modal-isim").innerText = secilenKarakter.isim;
    document.getElementById("modal-soz").innerText = `"${secilenKarakter.replik || 'May we meet again.'}"`;
    document.getElementById("soz-modal").style.display = "block";
}

function modalKapat() {
    document.getElementById("soz-modal").style.display = "none";
}

window.onclick = function(event) {
    let modal = document.getElementById("soz-modal");
    if (event.target == modal) {
        modalKapat();
    }
}