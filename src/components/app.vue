<template>
  <div
    id="main"
    :style="{ backgroundColor: getColor(currentKey.toUpperCase(), false) }"
  >
    <img
      v-if="!isInStandaloneMode()"
      :src="`src/assets/fullscreen${inFullscreenMode ? '-exit' : ''}.svg`"
      width="35" class="fullscreen-btn"
      @click="toggleFullscreen"
    >
    <img v-if="isPaused"
         src="src/assets/play.svg"
         width="100"
         style="filter: invert(1); position: absolute; cursor: pointer;"
         alt="Press to play"
    >
    <img v-if="isPaused || userNeverTypedSomething"
         src="src/assets/keyboard.svg"
         width="150"
         style="filter: invert(1); width: 50vw; max-width: 250px; pointer-events: none;"
         :style="{ opacity: (isPaused) ? 0.3 : 1}"
         alt="Press a key"
    >
    <svg v-else-if="currentKey" id="key" xmlns="http://www.w3.org/2000/svg" :style="{ fill: getColor(currentKey.toUpperCase(), true) }">
      <text textLength="100%" dominant-baseline="central" text-anchor="middle" x="50%" y="50%">
        {{ currentKey }}
      </text>
    </svg>
    <input
      ref="input"
      type="text"
      :name="Date.now()"
      :value="/* the following value prevents auto complete and clears the field on keydown: */
        `_${repetition}_${currentKey}`"
      class="offscreen"
      autocomplete="off"
      autocapitalize="off"
      autofocus="true"
      browser-autocomplete="false"
      aria-autocomplete="false"
      spellcheck="false"
      @input="inputFieldValue = $event.target.value"
    >
  </div>
</template>

<script>

const
  isTouchDevice = () => ('ontouchstart' in window),
  isInStandaloneMode = () => {
    const mqStandAlone = '(display-mode: fullscreen)';
    if (navigator.standalone || window.matchMedia(mqStandAlone).matches) {
      return true;
    }
    return false;
  },
  isMobileDevice = () => (isTouchDevice() && window.matchMedia('(max-width: 767px)').matches);

export default {
  name: 'App',
  data() {
    return {
      inputFieldValue: '_',
      currentKey: '',
      previousKey: null,
      repetition: 0,
      isKeyBeingPressed: false,
      inFullscreenMode: false,
      isPaused: isMobileDevice()
    };
  },
  computed: {
    userNeverTypedSomething() {
      return this.repetition === 0;
    }
  },
  watch: {
    inputFieldValue(to, from) {
      this.currentKey = to.substr(-1);
      this.previousKey = from.substr(-1);
      this.isPaused = false;
      if (this.currentKey !== this.previousKey) {
        this.repetition = 1;
      } else if (!this.isKeyBeingPressed) {
        ++this.repetition;
      }
    }
  },
  mounted() {
    const $html = document.querySelector('html');
    $html.addEventListener('keydown', (ev) => {
      if (!this.isKeyBeingPressed) {
        setTimeout(() => { // prioritize inputFieldValue()
          this.isKeyBeingPressed = true;
        });
      }

      // ignore non single character keys (F1, Enter, TAB, etc.)
      if (ev.altKey || ev.ctrlKey || ev.shiftKey || ev.key?.length !== 1) {
        ev.preventDefault();
        return false;
      }
    });
    $html.addEventListener('keyup', () => {
      setTimeout(() => { // prioritize inputFieldValue()
        this.isKeyBeingPressed = false;
      });
    });
    document.addEventListener('fullscreenchange', (event) => {
      this.inFullscreenMode = !!document.fullscreenElement;
    });
    document.oncontextmenu = function () { return false; };
    document.ondragstart = function () { return false; };
    document.addEventListener('click', () => {
      this.focusOnInputField();
      this.isPaused = false;
    });
    const initialHeightDiff = (window.screen.availHeight - window.innerHeight);
    let maxHeightDiff = initialHeightDiff;

    if (isMobileDevice()) {
      window.addEventListener('resize', debounce(() => {
        // if height changed enough, virtual keyboard is probably visible
        const currentHeightDiff = (window.screen.availHeight - window.innerHeight);
        maxHeightDiff = Math.max(maxHeightDiff, currentHeightDiff);
        this.isPaused = (maxHeightDiff !== initialHeightDiff) && ((currentHeightDiff - initialHeightDiff) < 100);
        console.log(initialHeightDiff, currentHeightDiff, (currentHeightDiff - initialHeightDiff));
      }));
    }
    this.focusOnInputField();
  },
  methods: {
    toggleFullscreen() {
      if (!this.inFullscreenMode) {
        document.querySelector('body').requestFullscreen().catch(err => false);
      } else {
        document.exitFullscreen();
      }
    },
    focusOnInputField() {
      const inputField = document.getElementsByTagName('input')[0];
      inputField.focus();
    },
    getColor(txt, isBright) {
      const charCode = txt.charCodeAt(0);
      const h = parseInt((140 * ((charCode % 20 /* without mod, 'w' & 'e' look similar */) + this.repetition)) % 360, 10);
      const s = parseInt(92 + (8 * Math.abs(Math.sin((2 * charCode) / this.repetition))), 10);
      const l = parseInt(
        (isBright ? 30 : 10) + (15 * Math.abs(Math.sin((3 * charCode) / this.repetition))),
        10
      );
      return `hsl(${h}, ${s}%, ${l}%)`;
    },
    isInStandaloneMode,
    isMobileDevice
  }
};

function debounce(func, timeout = 120) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

</script>

<style scoped>
#main {
  display: flex;
  min-width: 100%;
  min-height: 100%;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  transition: background 0.2s ease 0s;
  user-select: none;
  color: white;
}

#key {
  font-size: 45vmin;
  height: 100vmin;
  width: 100%;
  -webkit-text-stroke: white 1vmin;
  stroke: white;
  stroke-width: 2vmin;
  paint-order: stroke fill;
}

.offscreen {
  position: absolute;
  top: -100vh;
  left: -100vw;
}

.fullscreen-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 2em;
  padding: 1em;
  cursor: pointer;
  opacity: 0.4;
}
</style>
