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
        let germanVoice = null;

function loadVoices() {
    let voices = window.speechSynthesis.getVoices();
    germanVoice = voices.find(v => v.lang === 'de-DE' || v.lang.includes('de_DE'));
    if (!germanVoice) germanVoice = voices.find(v => v.lang.includes('de'));
}

window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// Audio za imenice iz kalkulatora
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


// Logika za ispis naziva izabrane slike na ekranu
document.addEventListener("DOMContentLoaded", function() {
    const slikaFile = document.getElementById('slikaFile');
    const imeSlike = document.getElementById('imeSlike');

    if (slikaFile && imeSlike) {
        slikaFile.addEventListener('change', function() {
            imeSlike.textContent = this.files[0] ? this.files[0].name : "Nije izabrana slika";
        });
    }
});

// Slanje i asinhrono preuzimanje prevoda teksta ili slike
function pokreniPrevodjenje() {
    const forma = document.getElementById('univerzalniForm');
    const formData = new FormData(forma);

    const rezultatBox = document.getElementById('rezultatBox');
    const poljeOriginal = document.getElementById('tekstOriginal');
    const poljePrevedeno = document.getElementById('tekstPrevedeno');

    poljePrevedeno.textContent = "Skeniram tekst i prevodim, sačekaj...";
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
            
            // AUTOMATSKO ČITANJE: Čim stigne prevod sa servera, robot odmah počinje da priča
            procitajPrevod();
        }
    })
    .catch(err => {
        poljePrevedeno.textContent = "Greška u povezivanju sa serverom.";
        console.error(err);
    });
}

// Funkcija koja bira pametan naglasak (srpski ili nemački) i izgovara ceo prevod rečenice/slike
// Funkcija koja bira pametan naglasak (srpski ili nemački) i izgovara ceo prevod rečenice/slike
function procitajPrevod() {
    // ISPRAVLJENO: Spojen razmak u imenu varijable
    const tekstZaCitanje = document.getElementById('tekstPrevedeno').textContent;
    const smer = document.querySelector('select[name="smer"]').value;
    
    if (!tekstZaCitanje || tekstZaCitanje.startsWith("Skeniram") || tekstZaCitanje.startsWith("Greška")) return;

    window.speechSynthesis.cancel();
    let msg = new SpeechSynthesisUtterance(tekstZaCitanje);
    
    if (smer === "de-sr") {
        msg.lang = 'sr-RS'; 
        msg.rate = 0.9; 
    } else {
        msg.lang = 'de-DE';
        msg.rate = 0.85;
        if (germanVoice) msg.voice = germanVoice;
    }

    const btn = document.getElementById('audioPrevodBtn');
    if (btn) {
        btn.style.transform = "scale(1.3)";
        setTimeout(() => btn.style.transform = "scale(1)", 200);
    }
    window.speechSynthesis.speak(msg);
}
}

// Čišćenje suprotne forme kako se keširani podaci ne bi mešali pri slanju
document.getElementById('tekstZaPrevod').addEventListener('input', function() {
    if (this.value.strip !== "") {
        document.getElementById('slikaFile').value = "";
        document.getElementById('imeSlike').textContent = "Nije izabrana slika";
    }
});

document.getElementById('slikaFile').addEventListener('change', function() {
    if (this.files.length > 0) {
        document.getElementById('tekstZaPrevod').value = "";
    }
});}
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
