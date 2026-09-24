<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = withDefaults(defineProps<{
  species?: 'dragon' | 'cat' | 'penguin' | 'unicorn';
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
