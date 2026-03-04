const bilgiBankasi = [
    {
        kategori: "KİTAP",
        baslik: "WELLS JAHA GERÇEĞİ",
        ozet: "Wells kitapta dizideki gibi erken ölmüyor.",
        detay: "Dizide Wells karakteri ilk sezonun başında trajik bir şekilde ölse de, Kass Morgan'ın kitap serisinde Wells Jaha ana karakterlerden biri olarak uzun süre hayatta kalır."
    },
    {
        kategori: "DİZİ",
        baslik: "RAVEN REYES'İN KADERİ",
        ozet: "Raven aslında ilk sezonda ölecekti.",
        detay: "Senaristler başlangıçta Raven Reyes karakterini sadece 5-6 bölümlük tasarlamıştı. Ancak Lindsey Morgan'ın performansı o kadar beğenildi ki karakter ana kadroya dahil edildi."
    },
    {
        kategori: "DİZİ",
        baslik: "TRIGEDASLENG DİLİ",
        ozet: "David J. Peterson tarafından yaratıldı.",
        detay: "Dizideki Zeminli dili, Game of Thrones dillerini de yapan dilbilimci tarafından İngilizcenin 100 yıl sonraki bozulmuş hali olarak sıfırdan tasarlandı."
    },
    {
        kategori: "DİZİ",
        baslik: "LEXA'NIN KOSTÜMÜ",
        ozet: "Kostümü aslında atıklardan yapıldı.",
        detay: "Lexa'nın ikonik zırhı ve pelerini, post-apokaliptik havayı vermek için gerçek araba lastikleri ve atık plastik parçaların eskitilmesiyle oluşturulmuştur."
    },
    {
        kategori: "DİZİ",
        baslik: "ELİZA TAYLOR'IN AKSANI",
        ozet: "Clarke aslında Avustralyalı!",
        detay: "Clarke karakterini canlandıran Eliza Taylor aslında Avustralyalıdır. Dizideki Amerikan aksanını o kadar iyi yapmıştır ki, set ekibinin yarısı onun Avustralyalı olduğunu uzun süre bilmemiştir."
    },
    {
        kategori: "DİZİ",
        baslik: "FİNAL BÖLÜMÜNDEKİ GÖNDERME",
        ozet: "İlk ve son sahne arasındaki benzerlik.",
        detay: "Dizinin final sahnesinde Clarke'ın kıyafetleri ve oturuşu, birinci sezonun ilk bölümünde hücresinde oturduğu sahneye bir saygı duruşu niteliğindedir."
    },
    {
        kategori: "DİZİ",
        baslik: "JASPER'IN KURTULUŞU",
        ozet: "Jasper aslında ilk bölümde ölecekti.",
        detay: "Senaryoya göre Jasper ilk bölümde mızraklandığında ölmeliydi. Ancak karakteri canlandıran Devon Bostick çok sevilince senaryo değiştirildi ve iyileştirildi."
    },
    {
        kategori: "KİTAP",
        baslik: "WELLS VE CLARKE AŞKI",
        ozet: "Kitapta Wells ve Clarke sevgiliydi.",
        detay: "Dizinin aksine kitap serisinde Wells ve Clarke'ın geçmişte ciddi bir ilişkisi vardır ve hikayenin büyük bölümünde bu duygusal bağ devam eder."
    },
    {
        kategori: "KİTAP",
        baslik: "DÜNYADA YAŞAYANLAR",
        ozet: "Kitapta Zeminliler 'Dünyalılar' olarak geçer.",
        detay: "Kitapta Trigedasleng dili veya klan yapıları dizideki kadar karmaşık değildir. Onlara sadece 'Earthborns' (Dünyada Doğanlar) denir ve daha teknolojik kalıntılara sahiptirler."
    },
    {
        kategori: "KİTAP",
        baslik: "MOUNT WEATHER'DAKİLER",
        ozet: "Kitapta Dağ Adamları kötü değil.",
        detay: "Kitap serisinde Mount Weather halkı, dizideki gibi gençlerin kanını çalan caniler değildir; aksine Ark'tan gelenlere yardım eden daha barışçıl bir topluluktur."
    },
    {
        kategori: "KİTAP",
        baslik: "BELLAMY'NİN SIRRI",
        ozet: "Kitapta Bellamy bir suçlu değil.",
        detay: "Dizide gemiye kaçak binen Bellamy, kitapta aslında bir koruma görevlisidir ve Octavia'yı korumak için gönüllü olarak gruba katılmıştır."
    },
    {
        kategori: "KİTAP",
        baslik: "CAM VE SASHA",
        ozet: "Kitapta dizide hiç olmayan karakterler var.",
        detay: "Dizide hiç görmediğimiz Cam ve Sasha karakterleri, kitabın en önemli POV (bakış açısı) karakterleridir. Hikaye onların gözünden de anlatılır."
    },
    {
        kategori: "DİZİ",
        baslik: "MOUNT WEATHER LOKASYONU",
        ozet: "Gerçek dünyada da var olan bir sığınak.",
        detay: "Mount Weather, Virginia'da bulunan ve gerçek hayatta da nükleer bir felaket anında hükümet yetkililerini korumak için tasarlanmış gerçek bir tesistir."
    },
    {
        kategori: "KİTAP",
        baslik: "CITY OF LIGHT FARKI",
        ozet: "Işık Şehri kitaplarda yer almıyor.",
        detay: "ALIE ve Işık Şehri hikaye örgüsü tamamen dizi senaristlerinin yaratımıdır. Kitaplar daha çok dünyadaki klan çatışmalarına odaklanır."
    }
];

let aktifKategori = "HEPSİ";
 

function bilgileriYukle(filtreliListe = bilgiBankasi) {
    const alan = document.getElementById("bilgi-alani");
    if (!alan) return;
    alan.innerHTML = "";

    filtreliListe.forEach((bilgi) => {
        const güvenliBaslik = bilgi.baslik.replace(/'/g, "\\'");
        
        alan.innerHTML += `
            <div class="bilgi-kart" onclick="modalAc('${güvenliBaslik}')">
                <div class="kart-no">${bilgi.kategori} | DATA_LOG</div>
                <h3>${bilgi.baslik}</h3>
                <p>${bilgi.ozet}</p>
                <div class="kart-footer">VERİYE ERİŞ [+]</div>
            </div>
        `;
    });
}

function modalAc(baslik) {
    const veri = bilgiBankasi.find(b => b.baslik === baslik);
    
    if (veri) {
        document.getElementById("modal-baslik").innerText = veri.baslik;
        document.getElementById("modal-detay").innerText = veri.detay;
        
        const modal = document.getElementById("bilgi-modal");
        
        modal.classList.remove("modal-gizli");
        modal.classList.add("aktif"); 
    }
}

function modalKapat() {
    const modal = document.getElementById("bilgi-modal");
    modal.classList.remove("aktif");
    modal.classList.add("modal-gizli");
}


function kategoriFiltrele(kat) {
    aktifKategori = kat;
    filtrele(); 
}

function filtrele() {
    const terim = document.getElementById("bilgi-ara").value.toUpperCase();
    
    const süzülmüş = bilgiBankasi.filter(b => {
        const metinUyuyor = b.baslik.toUpperCase().includes(terim) || 
                            b.ozet.toUpperCase().includes(terim);
        const kategoriUyuyor = (aktifKategori === "HEPSİ" || b.kategori === aktifKategori);
        
        return metinUyuyor && kategoriUyuyor;
    });
    
    bilgileriYukle(süzülmüş);
}

window.onload = () => bilgileriYukle();

window.onclick = function(event) {
    const modal = document.getElementById("bilgi-modal");
    if (event.target == modal) {
        modalKapat();
    }
}