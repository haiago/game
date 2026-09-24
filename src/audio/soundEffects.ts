class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, startTime = 0, gainLevel = 0.25) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(gainLevel, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    } catch (e) {
      // Fallback
    }
  }

  // Âm thanh khi chọn đúng / nhận sao (Chuông sao ma thuật / Kèn game boy / Ting Ting)
  playCorrect() {
    const mode = Math.floor(Math.random() * 3);
    if (mode === 0) {
      // Hợp âm chuông sao lấp lánh (Magic Star Chime)
      this.playTone(523.25, 'sine', 0.18, 0.00, 0.25);
      this.playTone(659.25, 'sine', 0.22, 0.08, 0.25);
      this.playTone(783.99, 'sine', 0.26, 0.16, 0.28);
      this.playTone(1046.50, 'triangle', 0.45, 0.24, 0.30);
    } else if (mode === 1) {
      // Kèn vui game boy fanfare
      this.playTone(440.00, 'square', 0.12, 0.00, 0.15);
      this.playTone(554.37, 'square', 0.12, 0.09, 0.16);
      this.playTone(659.25, 'square', 0.14, 0.18, 0.18);
      this.playTone(880.00, 'square', 0.35, 0.27, 0.20);
    } else {
      // Ting Ting vui tai
      this.playTone(987.77, 'sine', 0.15, 0.00, 0.22);
      this.playTone(1318.51, 'triangle', 0.38, 0.10, 0.28);
    }
  }

  // Âm thanh khi chạm tương tác thú cưng kêu dễ thương
  playPetCute() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.22);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.31);
    } catch (e) {}
  }

  // Âm thanh kèn mừng tiến hóa / tốt nghiệp
  playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    } catch (e) {}
  }

  // Âm thanh nút bấm nhẹ nhàng
  playTap() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  // Âm thanh làm sai: tiếng "rắc" vỡ đôi và tiếng cảnh báo trầm
  playWrongCrack() {
    if (!this.enabled) return;
    try {
      // 1. Tiếng "rắc" nứt vỏ
      this.playTone(850, 'sawtooth', 0.08, 0.00, 0.25);
      this.playTone(420, 'square', 0.12, 0.04, 0.3);
      // 2. Tiếng "boing" cảnh báo trầm buồn
      this.playTone(280, 'sine', 0.35, 0.12, 0.35);
      this.playTone(190, 'triangle', 0.45, 0.22, 0.3);
    } catch (e) {}
  }

  // Nhạc nền đếm ngược Arcade/Synthwave giai điệu vui nhộn, cuốn hút (không dùng âm gõ tốc tốc)
  // Mỗi giây phát 1 hợp âm/nốt giai điệu phong cách game 8-bit vui nhộn
  private melodyNotesNormal = [
    523.25, 659.25, 783.99, 659.25, // C5, E5, G5, E5
    587.33, 698.46, 880.00, 698.46, // D5, F5, A5, F5
    659.25, 783.99, 987.77, 783.99, // E5, G5, B5, G5
    783.99, 880.00, 1046.50, 880.00 // G5, A5, C6, A5
  ];

  private melodyNotesUrgent = [
    880.00, 987.77, 1046.50, 1174.66, 1318.51, 1174.66, 1046.50, 987.77
  ];

  playTick(isUrgent = false) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      if (!isUrgent) {
        // Giai điệu nhạc điện tử lofi/arcade vui tai, êm dịu, không gõ lách cách
        const noteIndex = Math.floor(now * 1.5) % this.melodyNotesNormal.length;
        const noteFreq = this.melodyNotesNormal[noteIndex];

        // 1. Nốt nhạc điện tử synth pop trong trẻo
        const synthOsc = ctx.createOscillator();
        const synthGain = ctx.createGain();
        synthOsc.type = 'sine';
        synthOsc.frequency.setValueAtTime(noteFreq, now);

        synthGain.gain.setValueAtTime(0.001, now);
        synthGain.gain.linearRampToValueAtTime(0.12, now + 0.04);
        synthGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        synthOsc.connect(synthGain);
        synthGain.connect(ctx.destination);
        synthOsc.start(now);
        synthOsc.stop(now + 0.36);

        // 2. Âm đệm bass synth êm phía dưới
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(noteFreq / 4, now);

        bassGain.gain.setValueAtTime(0.08, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.26);
      } else {
        // Giai đoạn gay cấn (<10s): Đoạn nhạc tăng tốc dồn dập, ngân vang kịch tính như Super Mario / Sonic sắp hết giờ
        const noteIndex = Math.floor(now * 3) % this.melodyNotesUrgent.length;
        const noteFreq = this.melodyNotesUrgent[noteIndex];

        // Nốt kèn synth chiptune dồn dập
        const leadOsc = ctx.createOscillator();
        const leadGain = ctx.createGain();
        leadOsc.type = 'triangle';
        leadOsc.frequency.setValueAtTime(noteFreq, now);
        leadOsc.frequency.setValueAtTime(noteFreq * 1.05, now + 0.08);

        leadGain.gain.setValueAtTime(0.001, now);
        leadGain.gain.linearRampToValueAtTime(0.18, now + 0.02);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        leadOsc.connect(leadGain);
        leadGain.connect(ctx.destination);
        leadOsc.start(now);
        leadOsc.stop(now + 0.23);

        // Nốt hòa âm quãng 5 kịch tính
        const harmOsc = ctx.createOscillator();
        const harmGain = ctx.createGain();
        harmOsc.type = 'sine';
        harmOsc.frequency.setValueAtTime(noteFreq * 1.5, now);

        harmGain.gain.setValueAtTime(0.001, now);
        harmGain.gain.linearRampToValueAtTime(0.1, now + 0.02);
        harmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        harmOsc.connect(harmGain);
        harmGain.connect(ctx.destination);
        harmOsc.start(now);
        harmOsc.stop(now + 0.21);
      }
    } catch (e) {}
  }

  // Âm thanh khi hết 30s đếm ngược
  playTimeout() {
    if (!this.enabled) return;
    try {
      this.playTone(350, 'sawtooth', 0.2, 0.00, 0.25);
      this.playTone(250, 'sawtooth', 0.35, 0.15, 0.3);
      this.playTone(160, 'sine', 0.5, 0.35, 0.35);
    } catch (e) {}
  }
}

export const soundManager = new SoundSynthesizer();
