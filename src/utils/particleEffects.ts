import confetti from 'canvas-confetti';

export function triggerMiniConfetti(origin?: { x?: number; y?: number }) {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: origin || { y: 0.7 }
    });
  } catch (e) {
    // Ignore if canvas is not ready
  }
}

export function triggerBigCelebration() {
  try {
    const end = Date.now() + 2 * 1000;
    const colors = ['#f43f5e', '#fb923c', '#eab308', '#10b981', '#0ea5e9', '#a855f7'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {}
}

/**
 * Hiệu ứng bung chùm hạt sao lấp lánh và huy hiệu sao bay vút lên thanh Header
 */
export function triggerStarBurstEffect(sourceElement?: HTMLElement | null, starAmount = 1) {
  let originX = window.innerWidth / 2;
  let originY = window.innerHeight / 2;

  if (sourceElement) {
    const sourceRect = sourceElement.getBoundingClientRect();
    originX = sourceRect.left + sourceRect.width / 2;
    originY = sourceRect.top + sourceRect.height / 2;
  }

  const starBadgeBox = document.getElementById('star-badge-box');
  let targetX = window.innerWidth - 60;
  let targetY = 30;

  if (starBadgeBox) {
    const targetRect = starBadgeBox.getBoundingClientRect();
    targetX = targetRect.left + targetRect.width / 2;
    targetY = targetRect.top + targetRect.height / 2;
  }

  const deltaX = targetX - originX;
  const deltaY = targetY - originY;

  // 1. Bung hạt sao lấp lánh xung quanh nút bấm
  const particles = ['⭐', '🌟', '✨', '💛', '🎉', '⭐'];
  const fragment = document.createDocumentFragment();
  const particleElements: { element: HTMLElement; tx: number; ty: number; rot: number }[] = [];
  const count = starAmount >= 2 ? 24 : 18;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'gpu-particle text-xl sm:text-2xl select-none';
    p.textContent = particles[i % particles.length];
    p.style.left = `${originX}px`;
    p.style.top = `${originY}px`;

    const angle = (i / count) * (Math.PI * 2) + (Math.random() * 0.3 - 0.15);
    const distance = (starAmount >= 2 ? 85 : 75) + Math.random() * 95;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const rot = (Math.random() - 0.5) * 540;

    fragment.appendChild(p);
    particleElements.push({ element: p, tx, ty, rot });
  }

  document.body.appendChild(fragment);

  particleElements.forEach(({ element, tx, ty, rot }, idx) => {
    const anim = element.animate([
      { transform: 'translate3d(-50%, -50%, 0) scale(0.2) rotate(0deg)', opacity: 0 },
      { transform: `translate3d(calc(-50% + ${tx * 0.4}px), calc(-50% + ${ty * 0.4}px), 0) scale(1.25) rotate(${rot * 0.3}deg)`, opacity: 1, offset: 0.2 },
      { transform: `translate3d(calc(-50% + ${tx * 0.85}px), calc(-50% + ${ty * 0.85}px), 0) scale(1) rotate(${rot * 0.7}deg)`, opacity: 0.9, offset: 0.6 },
      { transform: `translate3d(calc(-50% + ${tx * 1.1}px), calc(-50% + ${ty + 30}px), 0) scale(0.2) rotate(${rot}deg)`, opacity: 0 }
    ], {
      duration: 1800,
      delay: idx * 10,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards'
    });

    anim.onfinish = () => {
      if (element.parentNode) element.parentNode.removeChild(element);
    };
  });

  // 2. Huy hiệu sao vàng lớn bay theo đường cung mượt mà không khựng giật
  const flyingBadge = document.createElement('div');
  flyingBadge.className = 'gpu-flying-badge font-baloo px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-2 border-yellow-100 rounded-full font-black text-amber-950 text-base sm:text-lg shadow-2xl flex items-center gap-2 select-none';
  const labelText = starAmount === 2 ? '+2 SAO!' : `+${starAmount} SAO!`;
  flyingBadge.innerHTML = `<span class="text-2xl inline-block">⭐</span><span>${labelText}</span>`;
  flyingBadge.style.left = `${originX}px`;
  flyingBadge.style.top = `${originY}px`;
  flyingBadge.style.filter = 'drop-shadow(0 8px 18px rgba(217, 119, 6, 0.6))';

  document.body.appendChild(flyingBadge);

  const arcMidX = deltaX * 0.35 - 35;
  const arcMidY = deltaY * 0.35 - 55;
  const arcLateX = deltaX * 0.75 - 15;
  const arcLateY = deltaY * 0.75 - 20;

  const badgeAnim = flyingBadge.animate([
    { transform: 'translate3d(-50%, -50%, 0) scale(0.2) rotate(-15deg)', opacity: 0 },
    { transform: 'translate3d(-50%, -50%, 0) scale(1.35) rotate(4deg)', opacity: 1, offset: 0.16 },
    { transform: 'translate3d(-50%, calc(-50% - 20px), 0) scale(1.15) rotate(-2deg)', opacity: 1, offset: 0.38 },
    { transform: `translate3d(calc(-50% + ${arcMidX}px), calc(-50% + ${arcMidY}px), 0) scale(1.05) rotate(3deg)`, opacity: 1, offset: 0.62 },
    { transform: `translate3d(calc(-50% + ${arcLateX}px), calc(-50% + ${arcLateY}px), 0) scale(0.85) rotate(-3deg)`, opacity: 0.95, offset: 0.85 },
    { transform: `translate3d(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px), 0) scale(0.3) rotate(0deg)`, opacity: 0 }
  ], {
    duration: 1950,
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    fill: 'forwards'
  });

  badgeAnim.onfinish = () => {
    if (flyingBadge.parentNode) flyingBadge.parentNode.removeChild(flyingBadge);

    if (starBadgeBox) {
      starBadgeBox.classList.remove('star-box-bump');
      void starBadgeBox.offsetWidth;
      starBadgeBox.classList.add('star-box-bump');
    }
  };
}

/**
 * Hiệu ứng trừ 0.5 sao khi bỏ qua
 */
export function triggerPenaltyEffect(sourceElement?: HTMLElement | null) {
  let originX = window.innerWidth / 2;
  let originY = window.innerHeight / 2;

  if (sourceElement) {
    const sourceRect = sourceElement.getBoundingClientRect();
    originX = sourceRect.left + sourceRect.width / 2;
    originY = sourceRect.top + sourceRect.height / 2;
  }

  const penaltyBadge = document.createElement('div');
  penaltyBadge.className = 'fixed pointer-events-none z-[9999] select-none font-baloo px-3.5 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 border-2 border-white rounded-full font-black text-white text-sm shadow-xl flex items-center gap-1.5';
  penaltyBadge.innerHTML = `<span>💔</span><span>-½⭐</span>`;
  penaltyBadge.style.left = `${originX}px`;
  penaltyBadge.style.top = `${originY}px`;

  document.body.appendChild(penaltyBadge);

  const anim = penaltyBadge.animate([
    { transform: 'translate3d(-50%, -50%, 0) scale(0.5)', opacity: 0 },
    { transform: 'translate3d(-50%, calc(-50% - 20px), 0) scale(1.15)', opacity: 1, offset: 0.3 },
    { transform: 'translate3d(-50%, calc(-50% - 45px), 0) scale(0.9)', opacity: 0 }
  ], {
    duration: 1200,
    easing: 'ease-out',
    fill: 'forwards'
  });

  anim.onfinish = () => {
    if (penaltyBadge.parentNode) penaltyBadge.parentNode.removeChild(penaltyBadge);
  };
}

/**
 * Hiệu ứng bung tim bay lơ lửng khi bé chạm vào thú cưng
 */
export function triggerHeartBurstEffect(sourceElement?: HTMLElement | null) {
  let originX = window.innerWidth / 2;
  let originY = window.innerHeight / 2;

  if (sourceElement) {
    const sourceRect = sourceElement.getBoundingClientRect();
    originX = sourceRect.left + sourceRect.width / 2;
    originY = sourceRect.top + sourceRect.height / 2;
  }

  const hearts = ['💖', '💕', '❤️', '💗', '💓', '🥰', '✨'];
  const fragment = document.createDocumentFragment();
  const count = 10;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'gpu-particle select-none pointer-events-none fixed z-[9999]';
    p.textContent = hearts[i % hearts.length];
    p.style.fontSize = `${18 + Math.random() * 16}px`;
    p.style.left = `${originX}px`;
    p.style.top = `${originY}px`;

    const angle = (i / count) * (Math.PI * 2) + (Math.random() * 0.4 - 0.2);
    const distance = 40 + Math.random() * 55;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - (35 + Math.random() * 45); // Luôn bay hướng lên trên
    const rot = (Math.random() - 0.5) * 60;

    fragment.appendChild(p);

    const anim = p.animate([
      { transform: 'translate3d(-50%, -50%, 0) scale(0.2) rotate(0deg)', opacity: 0 },
      { transform: `translate3d(calc(-50% + ${tx * 0.5}px), calc(-50% + ${ty * 0.5}px), 0) scale(1.35) rotate(${rot * 0.5}deg)`, opacity: 1, offset: 0.3 },
      { transform: `translate3d(calc(-50% + ${tx}px), calc(-50% + ${ty}px), 0) scale(1.1) rotate(${rot}deg)`, opacity: 0.85, offset: 0.7 },
      { transform: `translate3d(calc(-50% + ${tx * 1.2}px), calc(-50% + ${ty - 25}px), 0) scale(0.4) rotate(${rot * 1.2}deg)`, opacity: 0 }
    ], {
      duration: 1100 + Math.random() * 300,
      delay: i * 25,
      easing: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
      fill: 'forwards'
    });

    anim.onfinish = () => {
      if (p.parentNode) p.parentNode.removeChild(p);
    };
  }

  document.body.appendChild(fragment);
}
