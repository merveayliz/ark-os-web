
document.addEventListener("DOMContentLoaded", () => {
   
    const user = JSON.parse(localStorage.getItem("skaikru_user"));
    
    if (!user) {
        alert("Erişim Reddedildi: Lütfen Giriş Yapın!");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("profil-ad").innerText = user.kullaniciAdi;
    document.getElementById("nav-user-name").innerText = user.kullaniciAdi;
    
    teorilerimiYukle(user.kullaniciAdi);
});

function teorilerimiYukle(kullaniciAdi) {
    const tumTeoriler = JSON.parse(localStorage.getItem("ark_teoriler")) || [];
    const benimTeorilerim = tumTeoriler.filter(t => t.yazar === kullaniciAdi);
    
    const alan = document.getElementById("kullanici-teorileri");
    
    if (benimTeorilerim.length === 0) {
        alan.innerHTML = "<p style='color:#888; text-align:center;'>Henüz bir teori yayınlamadın, Skaikru.</p>";
        return;
    }

    benimTeorilerim.forEach(t => {
        alan.innerHTML += `
            <div class="gonderi-kutusu">
                <div class="gonderici-bilgi">
                    <img src="${t.avatar || 'img/murphy.jpg'}" class="post-avatar">
                    <div class="yazar-detay">
                        <strong>${t.yazar}</strong>
                        <span>${t.tarih}</span>
                    </div>
                </div>
                <p class="post-metin">${t.metin}</p>
            </div>
        `;
    });
}

function cikisYap() {
    if(confirm("Sistemden çıkış yapmak istediğine emin misin?")) {
        window.location.href = "index.html";
    }
}

function resmiKaydet(input) {
    if (input.files && input.files[0]) {
        const okuyucu = new FileReader();

        okuyucu.onload = function(e) {
            const yeniResimYolu = e.target.result; 

            document.getElementById('profil-ana-resim').src = yeniResimYolu;
            const navAvatar = document.getElementById('nav-avatar');
            if(navAvatar) navAvatar.src = yeniResimYolu;

            let user = JSON.parse(localStorage.getItem("skaikru_user"));
            if (user) {
                user.profilResmi = yeniResimYolu;
                localStorage.setItem("skaikru_user", JSON.stringify(user));
                alert("Sistem Güncellendi: Profil fotoğrafı Ark-OS veritabanına işlendi.");
            }
        };

        okuyucu.readAsDataURL(input.files[0]); 
    }
}