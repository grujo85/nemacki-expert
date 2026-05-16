// ==========================================
// AUDIO GLAS (SPEECH SYNTHESIS)
// ==========================================
let germanVoice = null;

function loadVoices() {
    let voices = window.speechSynthesis.getVoices();
    germanVoice = voices.find(v => v.lang === 'de-DE' || v.lang.includes('de_DE'));
    if (!germanVoice) germanVoice = voices.find(v => v.lang.includes('de'));
}

if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
}

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
// LOGIKA ZA FORME I SLANJE NA PREVOD
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const slikaFile = document.getElementById('slikaFile');
    const imeSlike = document.getElementById('imeSlike');
    const tekstZaPrevod = document.getElementById('tekstZaPrevod');

    if (slikaFile && imeSlike) {
        slikaFile.addEventListener('change', function() {
            imeSlike.textContent = this.files[0] ? this.files[0].name : "Nije izabrana slika";
        });
    }

    if (tekstZaPrevod) {
        tekstZaPrevod.addEventListener('input', function() {
            if (this.value.trim() !== "") {
                if (slikaFile) slikaFile.value = "";
                if (imeSlike) imeSlike.textContent = "Nije izabrana slika";
            }
        });
    }

    if (slikaFile) {
        slikaFile.addEventListener('change', function() {
            if (this.files.length > 0 && tekstZaPrevod) {
                tekstZaPrevod.value = "";
            }
        });
    }
});

function pokreniPrevodjenje() {
    const forma = document.getElementById('univerzalniForm');
    if (!forma) return;

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
            procitajPrevod();
        }
    })
    .catch(err => {
        poljePrevedeno.textContent = "Greška u mrežnom povezivanju sa serverom.";
        console.error(err);
    });
}

function procitajPrevod() {
    const poljePrevedeno = document.getElementById('tekstPrevedeno');
    const smerElement = document.querySelector('select[name="smer"]');
    
    if (!poljePrevedeno || !smerElement) return;
    
    const tekstZaCitanje = poljePrevedeno.textContent;
    const smer = smerElement.value;
    
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
