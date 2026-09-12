// ---------------------------------------------
// Confetti: big, festive bursts with a lingering fall
// ---------------------------------------------
(function () {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#AFDCEB', '#ADD8E6', '#86C5D8', '#FFB6C1', '#EF93A6', '#FBF8F4', '#F7D9E0'];

  function makePiece(xRatio, yRatio) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 5 + Math.random() * 11;
    const life = 140 + Math.random() * 90;
    return {
      x: W * xRatio + (Math.random() - 0.5) * 100,
      y: H * yRatio + (Math.random() - 0.5) * 40,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 7 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
      long: Math.random() > 0.5,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      life: life,
      maxLife: life,
    };
  }

  function makeFaller() {
    const life = 220 + Math.random() * 120;
    return {
      x: Math.random() * W,
      y: -20,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1.5 + Math.random() * 2,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      long: Math.random() > 0.5,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6,
      life: life,
      maxLife: life,
    };
  }

  let pieces = [];

  function drawPiece(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(Math.min(p.life / 40, 1), 0);
    ctx.fillStyle = p.color;
    if (p.long) {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    pieces.forEach((p) => {
      p.vy += 0.15;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= 1;
      drawPiece(p);
    });
    pieces = pieces.filter((p) => p.life > 0 && p.y < H + 40);
    requestAnimationFrame(tick);
  }
  tick();

  window.confettiBurst = function (xRatio, yRatio, count) {
    for (let i = 0; i < (count || 90); i++) {
      pieces.push(makePiece(xRatio, yRatio));
    }
  };

  // A grand multi-wave burst with a lingering shower — used on page load
  window.confettiGrand = function () {
    window.confettiBurst(0.5, 0.22, 180);
    setTimeout(() => window.confettiBurst(0.18, 0.3, 100), 150);
    setTimeout(() => window.confettiBurst(0.82, 0.3, 100), 250);
    setTimeout(() => window.confettiBurst(0.35, 0.18, 80), 400);
    setTimeout(() => window.confettiBurst(0.65, 0.18, 80), 500);

    let elapsed = 0;
    const shower = setInterval(() => {
      for (let i = 0; i < 6; i++) pieces.push(makeFaller());
      elapsed += 120;
      if (elapsed > 4000) clearInterval(shower);
    }, 120);
  };

  window.addEventListener('load', () => {
    window.confettiGrand();
  });
})();

// ---------------------------------------------
// Photo upload placeholders (saved in localStorage)
// ---------------------------------------------
function setupPhotoUpload(cardSelector, imgSelector, keyPrefix) {
  document.querySelectorAll(cardSelector).forEach((card) => {
    const input = card.querySelector('.photo-input');
    const img = card.querySelector(imgSelector);
    const slot = card.dataset.slot;
    const key = keyPrefix + slot;

    const saved = localStorage.getItem(key);
    if (saved) {
      img.src = saved;
      card.classList.add('has-photo');
    }

    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
        card.classList.add('has-photo');
        try {
          localStorage.setItem(key, e.target.result);
        } catch (err) {
          /* image too large for localStorage; still shows for this session */
        }
      };
      reader.readAsDataURL(file);
    });
  });
}

setupPhotoUpload('.photo-card', '.photo-img', 'grace-bday-photo-');
setupPhotoUpload('.polaroid', '.polaroid-img', 'grace-bday-polaroid-');

// ---------------------------------------------
// Candle: click to blow out (and relight)
// ---------------------------------------------
(function () {
  const candle = document.getElementById('candle');
  const wishLine = document.getElementById('wish-line');
  if (!candle) return;

  candle.addEventListener('click', () => {
    const lit = candle.getAttribute('data-lit') !== 'false';
    candle.setAttribute('data-lit', lit ? 'false' : 'true');

    const rect = candle.getBoundingClientRect();
    window.confettiBurst(rect.left / window.innerWidth, rect.top / window.innerHeight, lit ? 130 : 14);

    if (lit) {
      const smoke = document.createElement('span');
      smoke.className = 'smoke';
      candle.appendChild(smoke);
      setTimeout(() => smoke.remove(), 1300);
      wishLine.textContent = 'May all your wishes come true!';
    } else {
      wishLine.textContent = ' ';
    }
  });
})();

// ---------------------------------------------
// Gift box: click to open, reveal the message
// ---------------------------------------------
(function () {
  const stage = document.getElementById('gift-stage');
  if (!stage) return;

  stage.addEventListener('click', () => {
    const opening = !stage.classList.contains('open');
    stage.classList.toggle('open');
    if (opening) {
      const rect = stage.getBoundingClientRect();
      window.confettiBurst(
        (rect.left + rect.width / 2) / window.innerWidth,
        rect.top / window.innerHeight,
        160
      );
    }
  });
})();
