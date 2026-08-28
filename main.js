// ===== 樱花飘落 =====
const canvas = document.getElementById('sakura');
const ctx = canvas.getContext('2d');
let W, H, petals = [];
// 手机端减少花瓣数量，省电流畅
const PETAL_COUNT = innerWidth < 768 ? 14 : 32;

function resize() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}
resize();
addEventListener('resize', resize);

class Petal {
  constructor() { this.reset(true); }
  reset(initial) {
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : -20;
    this.size = 6 + Math.random() * 8;
    this.speedY = 0.6 + Math.random() * 1.2;
    this.speedX = 0.3 + Math.random() * 0.8;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.03;
    this.sway = Math.random() * Math.PI * 2;
    this.swaySpeed = 0.01 + Math.random() * 0.02;
    this.opacity = 0.5 + Math.random() * 0.4;
    this.hue = 340 + Math.random() * 15;
  }
  update() {
    this.sway += this.swaySpeed;
    this.x += this.speedX * Math.sin(this.sway);
    this.y += this.speedY;
    this.angle += this.spin;
    if (this.y > H + 20 || this.x < -30 || this.x > W + 30) this.reset(false);
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = `hsl(${this.hue}, 85%, 82%)`;
    ctx.beginPath();
    // 一片小花瓣：两个贝塞尔弧
    ctx.moveTo(0, -this.size / 2);
    ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 2, this.size / 3, 0, this.size / 2);
    ctx.bezierCurveTo(-this.size / 2, this.size / 3, -this.size / 2, -this.size / 2, 0, -this.size / 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < PETAL_COUNT; i++) petals.push(new Petal());

(function loop() {
  ctx.clearRect(0, 0, W, H);
  petals.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(loop);
})();

// ===== 点击冒爱心 =====
const hearts = ['🌸', '💗', '✿', '❀', '💮', '⭐'];
document.addEventListener('click', (e) => {
  const el = document.createElement('span');
  el.className = 'click-heart';
  el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  el.style.left = e.clientX + 'px';
  el.style.top = e.clientY + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
});

// ===== 滚动渐入 =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
