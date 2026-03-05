// js/sohbet.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let aktifSohbetId = null;
let unsubscribe = null; 

// 1. OTURUM KONTROLÜ
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "kullanicilar", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            if(document.getElementById("nav-user-name")) document.getElementById("nav-user-name").innerText = data.kullaniciAdi;
            if(document.getElementById("nav-avatar") && data.profilResmi) document.getElementById("nav-avatar").src = data.profilResmi;
        }
        sinyalleriYukle(user.uid);
    } else {
        window.location.href = "index.html";
    }
});

// 2. SİNYALLERİ YÜKLE (BOTLAR SİLİNDİ - SADECE GERÇEK BAĞLANTILAR)
async function sinyalleriYukle(uid) {
    const liste = document.getElementById("arkadas-slotlari");
    if(!liste) return;

    liste.innerHTML = "<p style='color:#00ff96; font-size:0.7rem; padding:10px;'>📡 Sinyaller aranıyor...</p>";

    try {
        const q = query(collection(db, "takip"), where("takipEden", "==", uid));
        const querySnapshot = await getDocs(q);
        
        let htmlIcerik = "";

        // Döngü içinde her kullanıcının güncel PP'sini çekiyoruz
        for (const tDoc of querySnapshot.docs) {
            const v = tDoc.data();
            
            // takipEdilen ID'sini kullanarak kullanicilar koleksiyonundan güncel veriyi al
            const hedefDoc = await getDoc(doc(db, "kullanicilar", v.takipEdilen));
            const hedefVeri = hedefDoc.exists() ? hedefDoc.data() : {};
            const profilResmi = hedefVeri.profilResmi || 'img/murphy.jpg'; // Yoksa default murphy kalsın

            htmlIcerik += `
                <div class="arkadas-kart" onclick="sohbetiAc('${v.takipEdilen}', '${v.takipEdilenAd}', '${profilResmi}')">
                    <div class="kart-profil-resim">
                        <img src="${profilResmi}" alt="Savaşçı"> 
                    </div>
                    <div class="kart-bilgi">
                        <span class="kart-isim">${v.takipEdilenAd.toUpperCase()}</span>
                        <span class="kart-durum">BAĞLANTI_KURULDU</span>
                    </div>
                </div>
            `;
        }
        
        liste.innerHTML = htmlIcerik || "<p style='color:#888; font-size:0.7rem; padding:10px;'>Bağlantı bulunamadı. Keşfet'e git!</p>";

    } catch (e) { 
        console.error("Sinyal hatası:", e); 
        liste.innerHTML = "Sinyal kesildi.";
    }
}

// 3. SOHBETİ AÇ
window.sohbetiAc = function(id, ad, resim) {
    aktifSohbetId = id;
    document.querySelector(".baslik-sol").innerText = `MISSION_CHAT: ${ad.toUpperCase()}`;
    
    // Mesaj alanını temizle ve şifreleme uyarısı ver
    const mesajAlani = document.getElementById("mesaj-alani");
    mesajAlani.innerHTML = `<div class="sistem
