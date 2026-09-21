
// Real-Time WebSocket Client & Soundbox Synthesizer
class HospitalityClient {
  constructor(onStateChange) {
    this.onStateChange = onStateChange;
    this.ws = null;
    this.state = null;
    this.connected = false;
    this.initAudio();
    this.connect();
  }

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    this.ws = new WebSocket(`${protocol}//${host}/ws`);

    this.ws.onopen = () => {
      this.connected = true;
      console.log('⚡ Connected to Hospitality SaaS Event Bus');
      this.updateConnectionUI(true);
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'INIT_STATE' || msg.type === 'STATE_UPDATE') {
          this.state = msg.state;
          if (msg.action) {
            this.handleSoundEffects(msg.action);
          }
          if (this.onStateChange) {
            this.onStateChange(this.state, msg.action);
          }
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
      this.updateConnectionUI(false);
      console.warn('WS Disconnected. Reconnecting in 1.5s...');
      setTimeout(() => this.connect(), 1500);
    };

    this.ws.onerror = (err) => {
      console.error('WS Error:', err);
    };
  }

  dispatch(actionType, payload = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: { type: actionType, payload } }));
    } else {
      // Fallback REST POST
      fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: actionType, payload })
      }).catch(e => console.error('REST fallback failed:', e));
    }
  }

  updateConnectionUI(isOnline) {
    const badge = document.getElementById('ws-status-badge');
    if (badge) {
      badge.textContent = isOnline ? '● REALTIME SYNC (ONLINE)' : '○ DISCONNECTED (RETRYING)';
      badge.className = isOnline ? 'badge badge-green' : 'badge badge-red';
    }
  }

  // ==========================================
  // Web Audio Sound Effects & Soundbox
  // ==========================================
  initAudio() {
    this.audioCtx = null;
    const unlockAudio = () => {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
  }

  getAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  handleSoundEffects(action) {
    switch (action.type) {
      case 'FIRE_KOT':
        if (action.payload && action.payload.isGaramRoti) {
          this.playGaramRotiChime();
        } else {
          this.playBeep(440, 0.15, 'triangle');
        }
        break;
      case 'SETTLE_PAYMENT':
        this.playPaymentSoundboxChime(action.payload ? action.payload.amount : 1940);
        break;
      case 'SUBMIT_RATING':
        if (action.payload && action.payload.rating <= 2) {
          this.playEmergencyPagerAlert();
        }
        break;
      case 'TRIGGER_86':
        this.playBeep(260, 0.3, 'sawtooth');
        break;
    }
  }

  playBeep(freq = 520, duration = 0.15, type = 'sine') {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted yet
    }
  }

  playGaramRotiChime() {
    try {
      const ctx = this.getAudioContext();
      [587.33, 880.00, 1174.66].forEach((f, i) => {
        setTimeout(() => this.playBeep(f, 0.18, 'sine'), i * 80);
      });
    } catch (e) {}
  }

  playPaymentSoundboxChime(amount) {
    try {
      // Two tone musical chime
      this.playBeep(523.25, 0.2, 'sine');
      setTimeout(() => this.playBeep(659.25, 0.2, 'sine'), 120);
      setTimeout(() => this.playBeep(783.99, 0.35, 'sine'), 240);

      // Voice Synthesizer: "Payment Received Rupees ... on UPI"
      if ('speechSynthesis' in window) {
        setTimeout(() => {
          const utter = new SpeechSynthesisUtterance(`Payment received, rupees ${amount} on U P I`);
          utter.rate = 1.0;
          utter.pitch = 1.1;
          window.speechSynthesis.speak(utter);
        }, 500);
      }
    } catch (e) {}
  }

  playEmergencyPagerAlert() {
    try {
      [800, 400, 800, 400].forEach((f, i) => {
        setTimeout(() => this.playBeep(f, 0.12, 'square'), i * 140);
      });
    } catch (e) {}
  }
}

window.HospitalityClient = HospitalityClient;
