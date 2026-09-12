// ---------------------------------------------
// Confetti: a brief, tasteful burst — not a storm
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

  const colors = ['#AFDCEB', '#ADD8E6', '#86C5D8', '#FFB6C1', '#EF93A6', '#FBF8F4'];

  function makePiece(xRatio, yRatio) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.5 + Math.random() * 5;
    const life = 55 + Math.random() * 25;
    return {
      x: W * xRatio + (Math.random() - 0.5) * 60,
      y: H * yRatio + (Math.random() - 0.5) * 30,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.5,
      size: 5 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      long: Math.random() > 0.5,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      life: life,
      maxLife: life,
    };
  }

  let pieces = [];

  function drawPiece(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(p.life / p.maxLife, 0);
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
      p.vy += 0.2;
      p.vx *= 0.98;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= 1;
      drawPiece(p);
    });
    pieces = pieces.filter((p) => p.life > 0);
    requestAnimationFrame(tick);
  }
  tick();

  window.confettiBurst = function (xRatio, yRatio, count) {
    for (let i = 0; i < (count || 50); i++) {
      pieces.push(makePiece(xRatio, yRatio));
    }
  };

  window.addEventListener('load', () => {
    window.confettiBurst(0.5, 0.28, 90);
  });
})();

// ---------------------------------------------
// Photo upload placeholders (saved in localStorage)
// ---------------------------------------------
(function () {
  document.querySelectorAll('.photo-card').forEach((card) => {
    const input = card.querySelector('.photo-input');
    const img = card.querySelector('.photo-img');
    const slot = card.dataset.slot;
    const key = 'grace-bday-photo-' + slot;

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
})();

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
    window.confettiBurst(rect.left / window.innerWidth, rect.top / window.innerHeight, lit ? 40 : 6);

    if (lit) {
      const smoke = document.createElement('span');
      smoke.className = 'smoke';
      candle.appendChild(smoke);
      setTimeout(() => smoke.remove(), 1300);
      wishLine.textContent = 'Wish made.';
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
        50
      );
    }
  });
})();
