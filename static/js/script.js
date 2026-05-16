// ==========================================
// TVOJ KOD ZA AUDIO GLAS (ZADRŽAN)
// ==========================================
let germanVoice = null;

function loadVoices() {
    let voices = window.speechSynthesis.getVoices();
    germanVoice = voices.find(v => v.lang === 'de-DE' || v.lang.includes('de_DE'));
    if (!germanVoice) germanVoice = voices.find(v => v.lang.includes('de'));
}

window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

function speak(word) {
    window.speechSynthesis.cancel();
    if (!word) return;
    let msg = new SpeechSynthesisUtterance(word);
    msg.lang = 'de-DE';
    msg.rate = 0.85;
    if (germanVoice) msg.voice = germanVoice;

    const btn = document.getElementById('audioBtn');
    if (btn) {
        btn.style.transform = "scale(1.2)";
        setTimeout(() => btn.style.transform = "scale(1)", 200);
    }
    window.speechSynthesis.speak(msg);
}

document.body.addEventListener('click', function() {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
}, { once: true });


// ==========================================
// ASINHRONO SLANJE SLIKE NA SERVER I PRIKAZ
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const slikaFile = document.getElementById('slikaFile');
    const imeSlike = document.getElementById('imeSlike');

    if (slikaFile && imeSlike) {
        slikaFile.addEventListener('change', function() {
            imeSlike.textContent = this.files[0] ? this.files[0].name : "Nije izabrana slika";
        });
    }
});

function pokreniPrevodjenje() {
    const forma = document.getElementById('univerzalniForm');
    const formData = new FormData(forma);

    const rezultatBox = document.getElementById('rezultatBox');
    const poljeOriginal = document.getElementById('tekstOriginal');
    const poljePrevedeno = document.getElementById('tekstPrevedeno');

    poljePrevedeno.textContent = "Skeniram slova i prevodim tekst sa slike, sačekaj sekundu...";
    poljeOriginal.textContent = "";
    rezultatBox.style.display = "block";

    fetch('/univerzalni_prevod', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            poljePrevedeno.textContent = data.error;
            poljeOriginal.textContent = "";
        } else {
            poljeOriginal.textContent = data.original;
            poljePrevedeno.textContent = data.prevod;
        }
    })
    .catch(err => {
        poljePrevedeno.textContent = "Greška u mrežnom povezivanju sa serverom.";
        console.error(err);
    });
}
// Ako korisnik počne da kuca tekst, poništi izabranu sliku
document.getElementById('tekstZaPrevod').addEventListener('input', function() {
    if (this.value.trim() !== "") {
        document.getElementById('slikaFile').value = ""; // Prazni fajl
        document.getElementById('imeSlike').textContent = "Nije izabrana slika";
    }
});

// Ako korisnik izabere sliku, isprazni tekstualno polje
document.getElementById('slikaFile').addEventListener('change', function() {
    if (this.files.length > 0) {
        document.getElementById('tekstZaPrevod').value = "";
    }
});
