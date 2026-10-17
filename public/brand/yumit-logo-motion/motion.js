// public/brand/yumit-logo-motion/motion.js
//
// Orquestrador da animação do logotipo Yumit Hub.
// As keyframes vivem em styles.css; este módulo cuida de:
//   - medir o comprimento do swoosh (stroke-draw preciso);
//   - trocar o data-state do SVG e esperar as animações CSS terminarem
//     (Web Animations API: getAnimations() + Animation.finished);
//   - gerar as partículas na ponta do swoosh;
//   - loop, velocidade, atalhos de teclado e parâmetros de URL.

const STATES = Object.freeze({
  HIDDEN: "hidden",
  ENTER: "enter",
  SHOWN: "shown",
  EXIT: "exit",
});

const STATE_LABEL = {
  [STATES.HIDDEN]: "oculto",
  [STATES.ENTER]: "surgindo…",
  [STATES.SHOWN]: "visível",
  [STATES.EXIT]: "saindo…",
};

// Ponta superior direita do swoosh, em coordenadas do viewBox.
const SWOOSH_TIP = { x: 2042, y: 668 };
// Momento (em segundos, à velocidade 1×) em que o preenchimento do swoosh conclui.
const SWOOSH_FILL_END = 1.55;

export class YumitLogoMotion {
  /**
   * @param {SVGSVGElement} root  <svg class="logo">
   * @param {{speed?: number, loop?: boolean, holdMs?: number, gapMs?: number}} options
   */
  constructor(root, options = {}) {
    this.root = root;
    this.swoosh = root.querySelector(".swoosh");
    this.sparkLayer = root.querySelector(".sparks");
    this.options = { speed: 1, loop: false, holdMs: 2600, gapMs: 700, ...options };

    this.timers = new Set();
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.measure();
    this.setSpeed(this.options.speed);
    this.setState(STATES.HIDDEN);
  }

  // ---------------------------------------------------------------- estado

  get state() {
    return this.root.dataset.state;
  }

  get loop() {
    return this.options.loop;
  }

  set loop(value) {
    this.options.loop = Boolean(value);
    if (!this.options.loop) {
      this.clearTimers();
    } else if (this.state === STATES.SHOWN) {
      this.schedule(() => this.exit(), this.options.holdMs);
    } else if (this.state === STATES.HIDDEN) {
      this.schedule(() => this.enter(), this.options.gapMs);
    }
  }

  setState(state) {
    this.root.dataset.state = state;
    this.root.dispatchEvent(
      new CustomEvent("yumit:statechange", { detail: { state }, bubbles: true })
    );
  }

  setSpeed(multiplier) {
    const speed = Number(multiplier) > 0 ? Number(multiplier) : 1;
    this.options.speed = speed;
    // Com prefers-reduced-motion o CSS impõe --speed altíssimo; um valor inline venceria a media query.
    if (this.reducedMotion) {
      this.root.style.removeProperty("--speed");
      return;
    }
    this.root.style.setProperty("--speed", String(speed));
  }

  /** Mede o contorno do swoosh e injeta em --len para o stroke-draw. */
  measure() {
    const length = Math.ceil(this.swoosh.getTotalLength());
    this.swoosh.style.setProperty("--len", String(length));
  }

  // ---------------------------------------------------------------- sequências

  /** Entrada: swoosh desenha e preenche, letras sobem, HUB revela, brilho varre. */
  async enter() {
    this.clearTimers();
    if (this.state === STATES.ENTER || this.state === STATES.SHOWN) return false;

    if (!this.reducedMotion) {
      this.schedule(() => this.burstSparks(), (SWOOSH_FILL_END * 1000) / this.options.speed);
    }

    const completed = await this.runState(STATES.ENTER);
    if (!completed) return false;

    this.setState(STATES.SHOWN);
    if (this.options.loop) this.schedule(() => this.exit(), this.options.holdMs);
    return true;
  }

  /** Saída: HUB sai, letras sobem desfocando, swoosh esvazia e o traço recolhe. */
  async exit() {
    this.clearTimers();
    if (this.state === STATES.HIDDEN || this.state === STATES.EXIT) return false;

    const completed = await this.runState(STATES.EXIT);
    if (!completed) return false;

    this.setState(STATES.HIDDEN);
    if (this.options.loop) this.schedule(() => this.enter(), this.options.gapMs);
    return true;
  }

  /** Reinicia do zero, mesmo se estiver no meio de outra sequência. */
  async replay() {
    this.clearTimers();
    this.clearSparks();
    this.setState(STATES.HIDDEN);
    // Força o navegador a aplicar o estado "hidden" antes de iniciar "enter",
    // caso contrário as animações CSS não reiniciam.
    void this.root.getBoundingClientRect();
    return this.enter();
  }

  /** Mostra instantaneamente (poster frame). */
  show() {
    this.clearTimers();
    this.setState(STATES.SHOWN);
  }

  /** Esconde instantaneamente. */
  hide() {
    this.clearTimers();
    this.clearSparks();
    this.setState(STATES.HIDDEN);
  }

  /**
   * Aplica o estado e espera todas as animações CSS disparadas por ele terminarem.
   * Retorna false se a sequência foi interrompida (estado trocado no meio).
   */
  async runState(state) {
    this.setState(state);
    const animations = this.root.getAnimations({ subtree: true });
    try {
      await Promise.all(animations.map((animation) => animation.finished));
    } catch {
      return false; // Animation.finished rejeita quando a animação é cancelada
    }
    return this.state === state;
  }

  // ---------------------------------------------------------------- partículas

  burstSparks(count = 16) {
    const svgNS = "http://www.w3.org/2000/svg";
    const speed = this.options.speed;

    for (let i = 0; i < count; i += 1) {
      const circle = document.createElementNS(svgNS, "circle");
      const radius = 5 + Math.random() * 9;
      circle.setAttribute("cx", String(SWOOSH_TIP.x));
      circle.setAttribute("cy", String(SWOOSH_TIP.y));
      circle.setAttribute("r", radius.toFixed(1));
      this.sparkLayer.appendChild(circle);

      // Leque voltado para cima/direita (direção em que o swoosh termina).
      const angle = (-120 + Math.random() * 150) * (Math.PI / 180);
      const distance = 90 + Math.random() * 220;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      const animation = circle.animate(
        [
          { transform: "translate(0, 0) scale(0.2)", opacity: 0 },
          { transform: `translate(${dx * 0.35}px, ${dy * 0.35}px) scale(1)`, opacity: 1, offset: 0.25 },
          { transform: `translate(${dx}px, ${dy + 40}px) scale(0)`, opacity: 0 },
        ],
        {
          duration: (650 + Math.random() * 450) / speed,
          delay: (Math.random() * 120) / speed,
          easing: "cubic-bezier(0.2, 0.7, 0.3, 1)",
          fill: "forwards",
        }
      );
      animation.finished.then(() => circle.remove()).catch(() => circle.remove());
    }
  }

  clearSparks() {
    this.sparkLayer.replaceChildren();
  }

  // ---------------------------------------------------------------- utilidades

  schedule(callback, delayMs) {
    const id = window.setTimeout(() => {
      this.timers.delete(id);
      callback();
    }, delayMs);
    this.timers.add(id);
    return id;
  }

  clearTimers() {
    this.timers.forEach((id) => window.clearTimeout(id));
    this.timers.clear();
  }

  destroy() {
    this.clearTimers();
    this.clearSparks();
  }
}

// -------------------------------------------------------------------- página demo

function readUrlOptions() {
  const params = new URLSearchParams(window.location.search);
  const read = (key, fallback) => (params.has(key) ? params.get(key) : fallback);
  return {
    autoplay: read("autoplay", "1") !== "0",
    loop: read("loop", "0") === "1",
    speed: Number(read("speed", "1")) || 1,
    holdMs: Number(read("hold", "2600")) || 2600,
    theme: read("theme", "dark") === "light" ? "light" : "dark",
    ui: read("ui", "1") !== "0",
  };
}

function bootstrap() {
  const root = document.querySelector(".logo");
  if (!root) return;

  const url = readUrlOptions();
  document.documentElement.dataset.theme = url.theme;
  document.body.dataset.ui = url.ui ? "on" : "off";

  const motion = new YumitLogoMotion(root, {
    speed: url.speed,
    loop: url.loop,
    holdMs: url.holdMs,
  });
  window.yumitLogo = motion; // acesso pelo console / iframes (postMessage pode ser adicionado depois)

  const status = document.querySelector("[data-status]");
  const enterButton = document.querySelector('[data-action="enter"]');
  const exitButton = document.querySelector('[data-action="exit"]');
  const replayButton = document.querySelector('[data-action="replay"]');
  const themeButton = document.querySelector('[data-action="theme"]');
  const loopInput = document.querySelector('[data-option="loop"]');
  const speedSelect = document.querySelector('[data-option="speed"]');

  const syncUi = () => {
    const { state } = motion;
    if (status) status.textContent = STATE_LABEL[state] ?? state;
    if (enterButton) enterButton.disabled = state === STATES.ENTER || state === STATES.SHOWN;
    if (exitButton) exitButton.disabled = state === STATES.HIDDEN || state === STATES.EXIT;
  };

  root.addEventListener("yumit:statechange", syncUi);

  enterButton?.addEventListener("click", () => motion.enter());
  exitButton?.addEventListener("click", () => motion.exit());
  replayButton?.addEventListener("click", () => motion.replay());

  if (loopInput) {
    loopInput.checked = motion.loop;
    loopInput.addEventListener("change", () => {
      motion.loop = loopInput.checked;
    });
  }

  if (speedSelect) {
    const hasOption = [...speedSelect.options].some((o) => Number(o.value) === motion.options.speed);
    if (hasOption) speedSelect.value = String(motion.options.speed);
    speedSelect.addEventListener("change", () => motion.setSpeed(speedSelect.value));
  }

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    if (themeButton) {
      const isLight = theme === "light";
      themeButton.textContent = isLight ? "Fundo escuro" : "Fundo claro";
      themeButton.setAttribute("aria-pressed", String(isLight));
    }
  };
  applyTheme(url.theme);
  themeButton?.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
  });

  window.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLElement && /^(input|select|textarea)$/i.test(event.target.tagName)) return;
    if (event.code === "Space") {
      event.preventDefault();
      motion.replay();
    } else if (event.key === "Escape" || event.key.toLowerCase() === "x") {
      motion.exit();
    } else if (event.key.toLowerCase() === "l" && loopInput) {
      loopInput.checked = !loopInput.checked;
      motion.loop = loopInput.checked;
    }
  });

  syncUi();
  if (url.autoplay) {
    window.setTimeout(() => motion.enter(), 350);
  }
}

bootstrap();
