<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { PetSpeciesId } from '@/data/petSpeciesData';

const props = withDefaults(defineProps<{
  species?: PetSpeciesId;
  stage?: number;
  width?: number;
  height?: number;
  scale?: number;
  isHappyTrigger?: boolean;
}>(), {
  species: 'dragon',
  stage: 1,
  width: 128,
  height: 128,
  scale: 1,
  isHappyTrigger: false
});

const emit = defineEmits<{
  (e: 'pet-click'): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

let animationFrameId: number | null = null;
let time = 0;
let blinkTimer = 0;
let isBlinking = false;
let happyTimer = 0;
const activeParticles: Array<{ x: number; y: number; vx: number; vy: number; life: number; scale: number; type: 'heart' | 'star' }> = [];

watch(() => props.isHappyTrigger, (val) => {
  if (val) triggerHappy();
});

function triggerHappy() {
  happyTimer = 1.8;
  for (let i = 0; i < 6; i++) {
    activeParticles.push({
      x: 64 + (Math.random() * 40 - 20),
      y: 70,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -1.2 - Math.random() * 1.5,
      life: 1.0,
      scale: 0.8 + Math.random() * 0.5,
      type: Math.random() > 0.5 ? 'heart' : 'star'
    });
  }
}

function updateParticles() {
  for (let i = activeParticles.length - 1; i >= 0; i--) {
    const p = activeParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.025;
    if (p.life <= 0) {
      activeParticles.splice(i, 1);
    }
  }
}

// ---------------- TIỆN ÍCH VẼ HOẠT HÌNH 2D ----------------
function drawAnimeEyes(ctx: CanvasRenderingContext2D, lx: number, rx: number, y: number, eyeR: number, blinking: boolean, happy: boolean, iris1 = '#3a090d', iris2 = '#e11d48') {
  if (blinking) {
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = '#2b0909';
    ctx.beginPath();
    ctx.arc(lx, y, eyeR, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(rx, y, eyeR, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    return;
  }
  if (happy) {
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = '#2b0909';
    ctx.beginPath();
    ctx.arc(lx, y + 2, eyeR * 0.9, 1.15 * Math.PI, 1.85 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(rx, y + 2, eyeR * 0.9, 1.15 * Math.PI, 1.85 * Math.PI);
    ctx.stroke();
    return;
  }
  [lx, rx].forEach((ex) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(ex, y, eyeR * 1.05, eyeR * 1.25, 0, 0, Math.PI * 2);
    ctx.fill();

    const irisGrad = ctx.createLinearGradient(ex, y - eyeR, ex, y + eyeR);
    irisGrad.addColorStop(0, iris1);
    irisGrad.addColorStop(0.55, iris2);
    irisGrad.addColorStop(1, '#fbbf24');
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(ex, y, eyeR * 0.85, eyeR * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1c0507';
    ctx.beginPath();
    ctx.ellipse(ex, y - 1, eyeR * 0.45, eyeR * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex - eyeR * 0.35, y - eyeR * 0.4, eyeR * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + eyeR * 0.3, y + eyeR * 0.35, eyeR * 0.18, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBlush(ctx: CanvasRenderingContext2D, lx: number, rx: number, y: number, r = 4.5) {
  ctx.fillStyle = 'rgba(255, 107, 129, 0.55)';
  ctx.beginPath();
  ctx.ellipse(lx, y, r * 1.2, r * 0.8, 0, 0, Math.PI * 2);
  ctx.ellipse(rx, y, r * 1.2, r * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------- VẼ RỒNG ----------------
function drawDragon(ctx: CanvasRenderingContext2D, st: number, isHappy: boolean) {
  const floatY = Math.sin(time * 3.5) * 3.5;
  const jumpY = isHappy ? -Math.abs(Math.sin(time * 8)) * 9 : 0;
  ctx.save();
  ctx.translate(0, floatY + jumpY);

  if (st === 1) {
    // Trứng lửa
    const wobble = Math.sin(time * 4) * (isHappy ? 0.22 : 0.08);
    ctx.rotate(wobble);
    ctx.beginPath();
    ctx.ellipse(0, 6, 27, 36, 0, 0, Math.PI * 2);
    const eggGrad = ctx.createLinearGradient(-20, -30, 20, 40);
    eggGrad.addColorStop(0, '#ff7675');
    eggGrad.addColorStop(0.35, '#e11d48');
    eggGrad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = eggGrad;
    ctx.fill();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = '#5c1313';
    ctx.stroke();

    // Vảy rồng & vết nứt
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-16, 2); ctx.lineTo(-8, -4); ctx.lineTo(0, 5); ctx.lineTo(8, -3); ctx.lineTo(16, 3);
    ctx.stroke();

    if (isHappy) {
      drawAnimeEyes(ctx, -6, 6, 1, 3.8, false, true, '#5c1313', '#f97316');
    }
  } else {
    // Thân rồng chibi
    ctx.fillStyle = '#ff6b6b';
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, 12, 17, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bụng kem
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, 13, 11, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Đầu rồng
    ctx.fillStyle = '#ff7979';
    ctx.beginPath();
    ctx.arc(0, -6, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    drawAnimeEyes(ctx, -7, 7, -7, 5.2, isBlinking, isHappy, '#4a0e17', '#e11d48');
    drawBlush(ctx, -12, 12, -2, 3.8);

    // Sừng vàng
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(-12, -20); ctx.lineTo(-8, -30); ctx.lineTo(-4, -18); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(12, -20); ctx.lineTo(8, -30); ctx.lineTo(4, -18); ctx.closePath(); ctx.fill();

    if (st >= 3) {
      // Cánh rồng
      const wingFlap = Math.sin(time * 9) * 0.45;
      ctx.save();
      ctx.translate(-14, 4); ctx.rotate(-wingFlap);
      ctx.fillStyle = '#f87171';
      ctx.beginPath(); ctx.ellipse(-6, 0, 5, 12, 0.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.translate(14, 4); ctx.rotate(wingFlap);
      ctx.fillStyle = '#f87171';
      ctx.beginPath(); ctx.ellipse(6, 0, 5, 12, -0.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    if (st === 5) {
      // Vương miện hoàng gia
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(-12, -22); ctx.lineTo(-14, -32); ctx.lineTo(-6, -26); ctx.lineTo(0, -35); ctx.lineTo(6, -26); ctx.lineTo(14, -32); ctx.lineTo(12, -22); ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

// ---------------- VẼ MÈO BÁNH BAO ----------------
function drawCat(ctx: CanvasRenderingContext2D, st: number, isHappy: boolean) {
  const floatY = Math.sin(time * 3.5) * 3.5;
  const jumpY = isHappy ? -Math.abs(Math.sin(time * 8)) * 9 : 0;
  ctx.save();
  ctx.translate(0, floatY + jumpY);

  if (st === 1) {
    ctx.beginPath();
    ctx.ellipse(0, 6, 27, 36, 0, 0, Math.PI * 2);
    const eggGrad = ctx.createLinearGradient(-20, -30, 20, 40);
    eggGrad.addColorStop(0, "#a7f3d0");
    eggGrad.addColorStop(1, "#059669");
    ctx.fillStyle = eggGrad;
    ctx.strokeStyle = "#047857";
    ctx.lineWidth = 2.4;
    ctx.fill(); ctx.stroke();

    // Tai mèo thò ra
    ctx.fillStyle = "#fffbeb";
    ctx.beginPath();
    ctx.moveTo(-16, -18); ctx.lineTo(-14, -32); ctx.lineTo(-4, -22); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(16, -18); ctx.lineTo(14, -32); ctx.lineTo(4, -22); ctx.closePath(); ctx.fill();
  } else {
    // Thân mèo
    ctx.fillStyle = "#fffbeb";
    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(0, 12, 19, 16, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Đầu mèo bánh bao
    ctx.beginPath();
    ctx.ellipse(0, -7, 21, 18, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Tai mèo
    ctx.beginPath(); ctx.moveTo(-15, -16); ctx.lineTo(-19, -30); ctx.lineTo(-3, -20); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(15, -16); ctx.lineTo(19, -30); ctx.lineTo(3, -20); ctx.closePath(); ctx.fill(); ctx.stroke();

    drawAnimeEyes(ctx, -7.5, 7.5, -8, 5.2, isBlinking, isHappy, "#065f46", "#10b981");
    drawBlush(ctx, -13, 13, -2, 4);

    // Mũi và miệng mèo
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath(); ctx.arc(0, -2, 2, 0, Math.PI * 2); ctx.fill();

    if (st >= 3) {
      // Chuông / nơ
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath(); ctx.arc(0, 7, 3.5, 0, Math.PI * 2); ctx.fill();
    }
    if (st === 5) {
      // Vương miện
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(-14, -22); ctx.lineTo(-16, -32); ctx.lineTo(-7, -26); ctx.lineTo(0, -35); ctx.lineTo(7, -26); ctx.lineTo(16, -32); ctx.lineTo(14, -22); ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

// ---------------- VẼ CÁNH CỤT ----------------
function drawPenguin(ctx: CanvasRenderingContext2D, st: number, isHappy: boolean) {
  const floatY = Math.sin(time * 3.5) * 3.5;
  const jumpY = isHappy ? -Math.abs(Math.sin(time * 8)) * 9 : 0;
  const flap = Math.sin(time * 10) * 0.35;
  ctx.save();
  ctx.translate(0, floatY + jumpY);

  if (st === 1) {
    ctx.beginPath();
    ctx.ellipse(0, 6, 27, 36, 0, 0, Math.PI * 2);
    const eggGrad = ctx.createLinearGradient(-20, -30, 20, 40);
    eggGrad.addColorStop(0, "#e0f2fe");
    eggGrad.addColorStop(1, "#0284c7");
    ctx.fillStyle = eggGrad;
    ctx.strokeStyle = "#0369a1";
    ctx.lineWidth = 2.4;
    ctx.fill(); ctx.stroke();
  } else {
    // Thân chim
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.ellipse(0, 7, 20, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bụng trắng
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(0, 9, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cánh
    ctx.save(); ctx.translate(-19, 5); ctx.rotate(flap);
    ctx.fillStyle = "#1e293b"; ctx.beginPath(); ctx.ellipse(-4, 0, 5, 12, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(19, 5); ctx.rotate(-flap);
    ctx.fillStyle = "#1e293b"; ctx.beginPath(); ctx.ellipse(4, 0, 5, 12, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.restore();

    // Chân cam
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.ellipse(-9, 29, 6, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(9, 29, 6, 3.5, 0, 0, Math.PI * 2); ctx.fill();

    drawAnimeEyes(ctx, -7, 7, -3, 4.8, isBlinking, isHappy, "#0369a1", "#38bdf8");
    // Mỏ cam
    ctx.beginPath(); ctx.moveTo(-4, 2); ctx.lineTo(4, 2); ctx.lineTo(0, 7); ctx.closePath(); ctx.fill();

    if (st >= 3) {
      // Khăn đỏ
      ctx.fillStyle = "#ef4444";
      ctx.beginPath(); ctx.ellipse(0, 8, 14, 5, 0, 0, Math.PI * 2); ctx.fill();
    }
    if (st === 5) {
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(-10, -18); ctx.lineTo(-12, -26); ctx.lineTo(-5, -22); ctx.lineTo(0, -29); ctx.lineTo(5, -22); ctx.lineTo(12, -26); ctx.lineTo(10, -18); ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

// ---------------- VẼ KỲ LÂN CẦU VỒNG ----------------
function drawUnicorn(ctx: CanvasRenderingContext2D, st: number, isHappy: boolean) {
  const floatY = Math.sin(time * 3.2) * 4.5;
  const jumpY = isHappy ? -Math.abs(Math.sin(time * 7.5)) * 10 : 0;
  const wingFlap = Math.sin(time * 9.5) * 0.45;
  const hornGlow = 0.75 + Math.sin(time * 6) * 0.25;

  ctx.save();
  ctx.translate(0, floatY + jumpY);

  if (st === 1) {
    // Trứng cầu vồng
    const eggGrad = ctx.createLinearGradient(-18, -32, 22, 38);
    eggGrad.addColorStop(0, "#fdf2f8");
    eggGrad.addColorStop(0.5, "#e9d5ff");
    eggGrad.addColorStop(1, "#bae6fd");
    ctx.fillStyle = eggGrad;
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(0, 4, 26, 35, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.arc(0, 4, 4.5, 0, Math.PI * 2); ctx.fill();
  } else {
    // Đuôi cầu vồng
    ctx.save();
    ctx.translate(14, 18);
    const colors = ["#f472b6", "#a855f7", "#38bdf8", "#fde047"];
    colors.forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, idx * 2.2);
      ctx.quadraticCurveTo(12 + idx * 2, 8 + idx * 3, 10 + idx * 3, 24 + idx * 2);
      ctx.quadraticCurveTo(4 + idx, 16, 0, idx * 2.2);
      ctx.fill();
    });
    ctx.restore();

    // Cánh tiên vẫy
    if (st >= 3) {
      ctx.save();
      ctx.translate(-15, 6); ctx.rotate(-0.35 + wingFlap);
      ctx.fillStyle = "rgba(244, 114, 182, 0.85)";
      ctx.beginPath(); ctx.ellipse(-10, -8, 8, 16, -0.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.translate(15, 6); ctx.rotate(0.35 - wingFlap);
      ctx.fillStyle = "rgba(56, 189, 248, 0.85)";
      ctx.beginPath(); ctx.ellipse(10, -8, 8, 16, 0.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // Thân trắng ngọc
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(0, 14, 19, 16, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Móng chân hồng/vàng
    ctx.fillStyle = st >= 4 ? "#fbbf24" : "#fbcfe8";
    [-9, 9].forEach(hx => {
      ctx.beginPath(); ctx.ellipse(hx, 27, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    });

    // Đầu
    ctx.beginPath();
    ctx.arc(0, -8, 20, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Sừng xoắn phát sáng
    const hornLength = st >= 4 ? 34 : 26;
    ctx.save();
    const hornGrad = ctx.createLinearGradient(0, -14, 0, -14 - hornLength);
    hornGrad.addColorStop(0, "#f59e0b");
    hornGrad.addColorStop(0.5, "#fde047");
    hornGrad.addColorStop(1, "#ffffff");
    ctx.fillStyle = hornGrad;
    ctx.beginPath();
    ctx.moveTo(-4.5, -16); ctx.lineTo(0, -16 - hornLength); ctx.lineTo(4.5, -16); ctx.closePath();
    ctx.fill();
    ctx.restore();

    drawAnimeEyes(ctx, -7, 7, -8, 5.6, isBlinking, isHappy, "#6b21a8", "#d946ef");
    drawBlush(ctx, -13, 13, -2, 4.2);

    if (st === 5) {
      // Vương miện sao
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.moveTo(-11, -22); ctx.lineTo(-13, -32); ctx.lineTo(-5, -26); ctx.lineTo(0, -35); ctx.lineTo(5, -26); ctx.lineTo(13, -32); ctx.lineTo(11, -22); ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

// ---------------- VẼ PHƯỢNG HOÀNG LỬA ----------------
function drawPhoenix(ctx: CanvasRenderingContext2D, st: number, isHappy: boolean) {
  const floatY = Math.sin(time * 4) * 4;
  const jumpY = isHappy ? -Math.abs(Math.sin(time * 8)) * 10 : 0;
  ctx.save();
  ctx.translate(0, floatY + jumpY);

  if (st === 1) {
    // Trứng Kim Cương Đỏ
    const wobble = Math.sin(time * 4.5) * (isHappy ? 0.25 : 0.09);
    ctx.rotate(wobble);
    ctx.beginPath();
    ctx.ellipse(0, 6, 27, 36, 0, 0, Math.PI * 2);
    const eggGrad = ctx.createLinearGradient(-20, -30, 20, 40);
    eggGrad.addColorStop(0, '#fde047');
    eggGrad.addColorStop(0.3, '#f97316');
    eggGrad.addColorStop(0.8, '#dc2626');
    eggGrad.addColorStop(1, '#991b1b');
    ctx.fillStyle = eggGrad;
    ctx.fill();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = '#b91c1c';
    ctx.stroke();

    // Họa tiết lông vũ lửa kim cương trên vỏ trứng
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -10); ctx.lineTo(-10, 8); ctx.lineTo(0, 20); ctx.lineTo(10, 8); ctx.closePath();
    ctx.stroke();

    if (isHappy) {
      drawAnimeEyes(ctx, -6, 6, 2, 3.8, false, true, '#7f1d1d', '#f59e0b');
    }
  } else {
    const wingFlap = Math.sin(time * 6) * 0.28;

    // Đuôi lửa phượng hoàng dài lộng lẫy
    if (st >= 3) {
      ctx.save();
      const tailWiggle = Math.sin(time * 3) * 0.15;
      ctx.rotate(tailWiggle);
      const tailColors = ['#f59e0b', '#ef4444', '#facc15'];
      [-10, 0, 10].forEach((tx, idx) => {
        ctx.fillStyle = tailColors[idx];
        ctx.beginPath();
        ctx.moveTo(tx * 0.5, 20);
        ctx.quadraticCurveTo(tx * 1.6, 38, tx * 1.2, 50 + (st >= 4 ? 12 : 0));
        ctx.quadraticCurveTo(tx * 0.8, 38, 0, 20);
        ctx.fill();
      });
      ctx.restore();
    }

    // Đôi cánh lửa rộng
    ctx.save();
    ctx.translate(-14, 6);
    ctx.rotate(-0.3 + wingFlap);
    const wingGradL = ctx.createLinearGradient(-26, 0, 0, 0);
    wingGradL.addColorStop(0, '#facc15');
    wingGradL.addColorStop(0.5, '#ea580c');
    wingGradL.addColorStop(1, '#dc2626');
    ctx.fillStyle = wingGradL;
    ctx.beginPath();
    ctx.ellipse(-14, -6, 16, 26, -0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(14, 6);
    ctx.rotate(0.3 - wingFlap);
    const wingGradR = ctx.createLinearGradient(0, 0, 26, 0);
    wingGradR.addColorStop(0, '#dc2626');
    wingGradR.addColorStop(0.5, '#ea580c');
    wingGradR.addColorStop(1, '#facc15');
    ctx.fillStyle = wingGradR;
    ctx.beginPath();
    ctx.ellipse(14, -6, 16, 26, 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Thân phượng hoàng
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(0, 10, 18, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bụng vàng óng
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, 12, 11, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Đầu
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -9, 18, 0, Math.PI * 2);
    ctx.fill();

    // Chỏm mào lửa trên đầu
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(0, -26); ctx.lineTo(-6, -38); ctx.lineTo(0, -32); ctx.lineTo(6, -38); ctx.closePath();
    ctx.fill();

    // Mỏ chim vàng
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-4, -5); ctx.lineTo(0, 0); ctx.lineTo(4, -5); ctx.closePath();
    ctx.fill();

    drawAnimeEyes(ctx, -7, 7, -10, 5.2, isBlinking, isHappy, '#7f1d1d', '#f59e0b');
    drawBlush(ctx, -12, 12, -4, 4);

    // Vương miện hoàng kim cấp 5
    if (st === 5) {
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-10, -25); ctx.lineTo(-12, -37); ctx.lineTo(-4, -30); ctx.lineTo(0, -42); ctx.lineTo(4, -30); ctx.lineTo(12, -37); ctx.lineTo(10, -25); ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
  }
  ctx.restore();
}

// ---------------- VẼ CÁO TUYẾT HỒ LY ----------------
function drawFox(ctx: CanvasRenderingContext2D, st: number, isHappy: boolean) {
  const floatY = Math.sin(time * 3.2) * 3;
  const jumpY = isHappy ? -Math.abs(Math.sin(time * 8)) * 9 : 0;
  ctx.save();
  ctx.translate(0, floatY + jumpY);

  if (st === 1) {
    // Trứng Hoa Tuyết
    const wobble = Math.sin(time * 4) * (isHappy ? 0.22 : 0.08);
    ctx.rotate(wobble);
    ctx.beginPath();
    ctx.ellipse(0, 6, 27, 36, 0, 0, Math.PI * 2);
    const eggGrad = ctx.createLinearGradient(-20, -30, 20, 40);
    eggGrad.addColorStop(0, '#fbcfe8');
    eggGrad.addColorStop(0.4, '#fb923c');
    eggGrad.addColorStop(1, '#c084fc');
    ctx.fillStyle = eggGrad;
    ctx.fill();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = '#ea580c';
    ctx.stroke();

    // Họa tiết cánh hoa đào tuyết
    ctx.fillStyle = '#ffffff';
    for (let a = 0; a < 5; a++) {
      const ang = (a * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.arc(Math.cos(ang) * 9, 8 + Math.sin(ang) * 9, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isHappy) {
      drawAnimeEyes(ctx, -6, 6, 2, 3.8, false, true, '#431407', '#fb923c');
    }
  } else {
    // Đuôi cáo xòe bồng bềnh
    const tailCount = st >= 4 ? (st === 5 ? 5 : 3) : 1;
    ctx.save();
    for (let tIdx = 0; tIdx < tailCount; tIdx++) {
      const spreadAngle = (tIdx - (tailCount - 1) / 2) * 0.32;
      const tailWiggle = Math.sin(time * 3.5 + tIdx) * 0.12;
      ctx.save();
      ctx.rotate(spreadAngle + tailWiggle);
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(0, 24, 12, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      // Chóp đuôi trắng
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 40, 7, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // Thân cam tròn đáng yêu
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, 12, 19, 17, 0, 0, Math.PI * 2);
    ctx.fill();

    // Yếm ngực lông trắng
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 14, 12, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chân trước
    ctx.fillStyle = '#ea580c';
    [-8, 8].forEach(fx => {
      ctx.beginPath(); ctx.ellipse(fx, 26, 4.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    });

    // Đầu cáo
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, -8, 22, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Má trắng 2 bên mặt cáo
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-11, -4, 9, 11, -0.2, 0, Math.PI * 2);
    ctx.ellipse(11, -4, 9, 11, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Hai tai nhọn cáo
    [-14, 14].forEach((ex, idx) => {
      const sign = idx === 0 ? -1 : 1;
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(ex - 6 * sign, -18); ctx.lineTo(ex + 2 * sign, -36); ctx.lineTo(ex + 8 * sign, -18); ctx.closePath();
      ctx.fill();
      // Trong tai trắng
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.moveTo(ex - 3 * sign, -20); ctx.lineTo(ex + 1 * sign, -31); ctx.lineTo(ex + 5 * sign, -20); ctx.closePath();
      ctx.fill();
    });

    // Mũi đen nhỏ xinh
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(0, -3, 3, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();

    drawAnimeEyes(ctx, -8, 8, -9, 5.2, isBlinking, isHappy, '#431407', '#f97316');
    drawBlush(ctx, -14, 14, -3, 4.2);

    // Kính ngố tròn cấp 3
    if (st === 3) {
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-8, -9, 7.5, 0, Math.PI * 2);
      ctx.arc(8, -9, 7.5, 0, Math.PI * 2);
      ctx.moveTo(-1, -9); ctx.lineTo(1, -9);
      ctx.stroke();
    }

    // Vương miện ngọc cấp 5
    if (st === 5) {
      ctx.fillStyle = '#a855f7';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-9, -24); ctx.lineTo(-11, -34); ctx.lineTo(-4, -28); ctx.lineTo(0, -37); ctx.lineTo(4, -28); ctx.lineTo(11, -34); ctx.lineTo(9, -24); ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
  }
  ctx.restore();
}

// ---------------- VẼ RÙA THẦN KIM QUY ----------------
function drawTurtle(ctx: CanvasRenderingContext2D, st: number, isHappy: boolean) {
  const floatY = Math.sin(time * 2.8) * 3;
  const jumpY = isHappy ? -Math.abs(Math.sin(time * 8)) * 8 : 0;
  ctx.save();
  ctx.translate(0, floatY + jumpY);

  if (st === 1) {
    // Trứng Ngọc Lục Bảo
    const wobble = Math.sin(time * 3.5) * (isHappy ? 0.22 : 0.08);
    ctx.rotate(wobble);
    ctx.beginPath();
    ctx.ellipse(0, 6, 27, 36, 0, 0, Math.PI * 2);
    const eggGrad = ctx.createLinearGradient(-20, -30, 20, 40);
    eggGrad.addColorStop(0, '#a7f3d0');
    eggGrad.addColorStop(0.5, '#10b981');
    eggGrad.addColorStop(1, '#047857');
    ctx.fillStyle = eggGrad;
    ctx.fill();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = '#065f46';
    ctx.stroke();

    // Hoa văn lục giác mai rùa trên quả trứng
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3;
      const hx = Math.cos(ang) * 9;
      const hy = 8 + Math.sin(ang) * 9;
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();

    // Vảy hoa văn nhỏ
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, 8, 3.5, 0, Math.PI * 2);
    ctx.fill();

    if (isHappy) {
      drawAnimeEyes(ctx, -7, 7, 0, 4, false, true, '#064e3b', '#10b981');
    }
  } else if (st === 2) {
    // Rùa Con Nứt Mai
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(0, -6, 17, 0, Math.PI * 2);
    ctx.fill();

    const swimL = Math.sin(time * 5) * 0.2;
    const swimR = -Math.sin(time * 5) * 0.2;
    [-18, 18].forEach((fx, idx) => {
      ctx.save();
      ctx.translate(fx, 14);
      ctx.rotate(idx === 0 ? swimL : swimR);
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 10, idx === 0 ? -0.4 : 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    drawAnimeEyes(ctx, -6, 6, -7, 5, isBlinking, isHappy, '#064e3b', '#10b981');
    drawBlush(ctx, -10, 10, -2, 3.5);

    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#065f46';
    ctx.beginPath();
    ctx.arc(0, -2, 3, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Nửa quả trứng nứt bên dưới
    ctx.beginPath();
    ctx.ellipse(0, 14, 25, 23, 0, 0, Math.PI);
    ctx.lineTo(-25, 14);
    ctx.lineTo(-18, 7);
    ctx.lineTo(-10, 14);
    ctx.lineTo(-2, 8);
    ctx.lineTo(6, 14);
    ctx.lineTo(15, 7);
    ctx.lineTo(25, 14);
    ctx.closePath();
    const eggGrad = ctx.createLinearGradient(-15, 0, 15, 30);
    eggGrad.addColorStop(0, '#a7f3d0');
    eggGrad.addColorStop(1, '#059669');
    ctx.fillStyle = eggGrad;
    ctx.fill();
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 2.2;
    ctx.stroke();
  } else {
    // st = 3, 4, 5
    const swimAng = Math.sin(time * 3.8) * 0.25;
    const fins = [
      { x: -24, y: -6, rx: 8, ry: 15, ang: -0.8 + swimAng },
      { x: 24, y: -6, rx: 8, ry: 15, ang: 0.8 - swimAng },
      { x: -18, y: 22, rx: 6, ry: 12, ang: -0.5 - swimAng },
      { x: 18, y: 22, rx: 6, ry: 12, ang: 0.5 + swimAng }
    ];
    ctx.fillStyle = st === 5 ? '#f59e0b' : '#10b981';
    fins.forEach(f => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.ang);
      ctx.beginPath();
      ctx.ellipse(0, 0, f.rx, f.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = st === 5 ? '#b45309' : '#047857';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });

    ctx.save();
    ctx.translate(0, 32);
    ctx.rotate(Math.sin(time * 4) * 0.2);
    ctx.beginPath();
    ctx.moveTo(-3, 0); ctx.lineTo(0, 8); ctx.lineTo(3, 0); ctx.closePath();
    ctx.fillStyle = st === 5 ? '#f59e0b' : '#059669';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 8, 26, 28, 0, 0, Math.PI * 2);
    const shellGrad = ctx.createRadialGradient(0, 2, 4, 0, 8, 28);
    if (st === 5) {
      shellGrad.addColorStop(0, '#fef08a');
      shellGrad.addColorStop(0.4, '#f59e0b');
      shellGrad.addColorStop(1, '#b45309');
    } else {
      shellGrad.addColorStop(0, '#6ee7b7');
      shellGrad.addColorStop(0.5, '#059669');
      shellGrad.addColorStop(1, '#064e3b');
    }
    ctx.fillStyle = shellGrad;
    ctx.fill();
    ctx.lineWidth = st === 5 ? 3 : 2.4;
    ctx.strokeStyle = st === 5 ? '#fbbf24' : '#047857';
    ctx.stroke();

    ctx.strokeStyle = st === 5 ? '#fffbeb' : '#a7f3d0';
    ctx.lineWidth = 1.8;
    const hexCenters = [{ x: 0, y: 4, r: 8 }, { x: -11, y: 14, r: 7 }, { x: 11, y: 14, r: 7 }, { x: 0, y: -8, r: 7 }];
    hexCenters.forEach(hc => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        const x = hc.x + Math.cos(ang) * hc.r;
        const y = hc.y + Math.sin(ang) * hc.r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    });
    ctx.restore();

    ctx.save();
    ctx.fillStyle = st === 5 ? '#fbbf24' : '#34d399';
    ctx.beginPath();
    ctx.arc(0, -20, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = st === 5 ? '#b45309' : '#065f46';
    ctx.stroke();

    if (st === 4) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-15, -24, 30, 7);
      const wave = Math.sin(time * 5) * 4;
      ctx.beginPath();
      ctx.moveTo(14, -22);
      ctx.quadraticCurveTo(24, -26 + wave, 32, -22 + wave);
      ctx.lineTo(31, -17 + wave);
      ctx.quadraticCurveTo(23, -20 + wave, 14, -18);
      ctx.closePath();
      ctx.fill();
    }

    drawAnimeEyes(
      ctx,
      -6, 6,
      -20,
      4.8,
      isBlinking,
      isHappy,
      st === 5 ? '#78350f' : '#064e3b',
      st === 5 ? '#f59e0b' : '#10b981'
    );
    drawBlush(ctx, -11, 11, -15, 3.6);

    if (st === 5) {
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-10, -32);
      ctx.lineTo(-12, -43);
      ctx.lineTo(-4, -36);
      ctx.lineTo(0, -46);
      ctx.lineTo(4, -36);
      ctx.lineTo(12, -43);
      ctx.lineTo(10, -32);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(0, -37, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.restore();
}

// ---------------- VẼ THỎ NGỌC BÔNG GÒN ----------------
function drawRabbit(ctx: CanvasRenderingContext2D, st: number, isHappy: boolean) {
  const floatY = Math.sin(time * 3.2) * 3;
  const jumpY = isHappy ? -Math.abs(Math.sin(time * 8)) * 10 : 0;
  ctx.save();
  ctx.translate(0, floatY + jumpY);

  if (st === 1) {
    // Trứng Cà Rốt Hồng
    const wobble = Math.sin(time * 3.8) * (isHappy ? 0.22 : 0.08);
    ctx.rotate(wobble);
    ctx.beginPath();
    ctx.ellipse(0, 6, 27, 36, 0, 0, Math.PI * 2);
    const eggGrad = ctx.createLinearGradient(-20, -30, 20, 40);
    eggGrad.addColorStop(0, '#fdf2f8');
    eggGrad.addColorStop(0.5, '#f472b6');
    eggGrad.addColorStop(1, '#db2777');
    ctx.fillStyle = eggGrad;
    ctx.fill();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = '#be185d';
    ctx.stroke();

    ctx.save();
    ctx.translate(0, 6);
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(-3, -11, 2.5, 6, -0.3, 0, Math.PI * 2);
    ctx.ellipse(3, -11, 2.5, 6, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-6, -7);
    ctx.lineTo(6, -7);
    ctx.lineTo(0, 9);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    if (isHappy) {
      drawAnimeEyes(ctx, -7, 7, 0, 4, false, true, '#831843', '#f472b6');
    }
  } else if (st === 2) {
    // Thỏ Con Tai Dài
    const earWiggle = Math.sin(time * 4) * 0.1;
    [-8, 8].forEach((ex, idx) => {
      ctx.save();
      ctx.translate(ex, -12);
      ctx.rotate(idx === 0 ? -0.15 + earWiggle : 0.15 - earWiggle);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, -14, 5.5, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.ellipse(0, -13, 3, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -4, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    drawAnimeEyes(ctx, -6, 6, -5, 5, isBlinking, isHappy, '#831843', '#f472b6');
    drawBlush(ctx, -11, 11, 0, 3.8);

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(-2, 0); ctx.lineTo(2, 0); ctx.lineTo(0, 2); ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1.2;
    [-1, 1].forEach(dir => {
      ctx.beginPath();
      ctx.moveTo(dir * 8, 0); ctx.lineTo(dir * 18, -2);
      ctx.moveTo(dir * 8, 2); ctx.lineTo(dir * 17, 4);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.ellipse(0, 15, 25, 22, 0, 0, Math.PI);
    ctx.lineTo(-25, 15);
    ctx.lineTo(-18, 8);
    ctx.lineTo(-10, 15);
    ctx.lineTo(-2, 9);
    ctx.lineTo(6, 15);
    ctx.lineTo(15, 8);
    ctx.lineTo(25, 15);
    ctx.closePath();
    const eggGrad = ctx.createLinearGradient(-15, 0, 15, 30);
    eggGrad.addColorStop(0, '#fdf2f8');
    eggGrad.addColorStop(1, '#f472b6');
    ctx.fillStyle = eggGrad;
    ctx.fill();
    ctx.strokeStyle = '#db2777';
    ctx.lineWidth = 2.2;
    ctx.stroke();
  } else {
    // st = 3, 4, 5
    if (st >= 4) {
      ctx.save();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(16, -6, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(8, -8, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(17, 18, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    if (st === 5) {
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.ellipse(0, 16, 23, 20, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 14, 19, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const earWiggle = Math.sin(time * 3.8) * 0.12;
    [-9, 9].forEach((ex, idx) => {
      ctx.save();
      ctx.translate(ex, -18);
      ctx.rotate(idx === 0 ? -0.18 + earWiggle : 0.18 - earWiggle);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, -18, 6.5, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.ellipse(0, -16, 3.5, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -10, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    drawAnimeEyes(ctx, -7, 7, -11, 5.5, isBlinking, isHappy, '#831843', '#f472b6');
    drawBlush(ctx, -13, 13, -5, 4.2);

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(-2.5, -5); ctx.lineTo(2.5, -5); ctx.lineTo(0, -2.5); ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1.2;
    [-1, 1].forEach(dir => {
      ctx.beginPath();
      ctx.moveTo(dir * 10, -5); ctx.lineTo(dir * 22, -8);
      ctx.moveTo(dir * 10, -3); ctx.lineTo(dir * 21, 0);
      ctx.stroke();
    });

    if (st === 3 || st === 4) {
      ctx.save();
      ctx.translate(0, 15);
      ctx.rotate(-0.35);
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(-12, -4, 3, 7, -0.6, 0, Math.PI * 2);
      ctx.ellipse(-10, 2, 3, 7, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(-8, -6);
      ctx.lineTo(14, -1);
      ctx.lineTo(-2, 18);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = '#ffffff';
    [-8, 8].forEach(px => {
      ctx.beginPath();
      ctx.ellipse(px, 12, 4.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    if (st === 4) {
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(-11, -30, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-11, -30, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (st === 5) {
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-9, -26);
      ctx.lineTo(-12, -37);
      ctx.lineTo(-4, -30);
      ctx.lineTo(0, -40);
      ctx.lineTo(4, -30);
      ctx.lineTo(12, -37);
      ctx.lineTo(9, -26);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, -32, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function render() {
  time += 0.04;
  updateParticles();

  blinkTimer += 0.04;
  if (blinkTimer > 3.2) {
    isBlinking = true;
    if (blinkTimer > 3.4) {
      isBlinking = false;
      blinkTimer = Math.random() * 0.8;
    }
  }

  if (happyTimer > 0) happyTimer -= 0.04;

  const canvas = canvasRef.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, props.width, props.height);
      ctx.save();
      ctx.translate(props.width / 2, props.height / 2);
      ctx.scale(props.scale, props.scale);

      const isHappy = happyTimer > 0;
      if (props.species === 'dragon') drawDragon(ctx, props.stage, isHappy);
      else if (props.species === 'cat') drawCat(ctx, props.stage, isHappy);
      else if (props.species === 'penguin') drawPenguin(ctx, props.stage, isHappy);
      else if (props.species === 'unicorn') drawUnicorn(ctx, props.stage, isHappy);
      else if (props.species === 'phoenix') drawPhoenix(ctx, props.stage, isHappy);
      else if (props.species === 'fox') drawFox(ctx, props.stage, isHappy);
      else if (props.species === 'turtle') drawTurtle(ctx, props.stage, isHappy);
      else if (props.species === 'rabbit') drawRabbit(ctx, props.stage, isHappy);

      // Vẽ các hạt tim bung ra khi chạm vào
      for (const p of activeParticles) {
        ctx.save();
        ctx.translate(p.x - 64, p.y - 64);
        ctx.scale(p.scale * p.life, p.scale * p.life);
        ctx.font = '16px "Baloo 2", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillText(p.type === 'heart' ? '💖' : '💕', 0, 0);
        ctx.restore();
      }

      ctx.restore();
    }
  }

  animationFrameId = requestAnimationFrame(render);
}

onMounted(() => {
  animationFrameId = requestAnimationFrame(render);
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});

function handleCanvasClick() {
  triggerHappy();
  emit('pet-click');
}
</script>

<template>
  <canvas
    ref="canvasRef"
    :width="width"
    :height="height"
    class="filter drop-shadow-lg cursor-pointer active:scale-95 transition-transform"
    @click="handleCanvasClick"
    title="Chạm vào để bạn ấy biểu diễn!"
  ></canvas>
</template>
