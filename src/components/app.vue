<template>
  <div
    id="main"
    :style="{ backgroundColor: getColor(currentKey.toUpperCase(), false) }"
  >
    <img
      :src="`src/assets/fullscreen${inFullscreenMode ? '-exit' : ''}.svg`"
      width="35"
      class="fullscreen-btn" @click="toggleFullscreen"
    >
    <svg v-if="currentKey" id="key" xmlns="http://www.w3.org/2000/svg" :style="{ fill: getColor(currentKey.toUpperCase(), true) }">
      <text textLength="100%" dominant-baseline="central" text-anchor="middle" x="50%" y="50%">
        {{ currentKey }}
      </text>
    </svg>
    <img v-else src="src/assets/keyboard.svg" width="150" style="filter: invert(1);" alt="Press a key">
    <input
      type="password"
      :name="Date.now()"
      :value="currentKey"
      class="offscreen"
      autocomplete="new-password"
      autocapitalize="off"
      spellcheck="false"
      @input="currentKey = $event.target.value"
    >
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentKey: '',
      repetition: 1,
      isKeyBeingPressed: false,
      inFullscreenMode: false
    };
  },
  watch: {
    currentKey(to, from) {
      this.currentKey = to.substr(-1);
    }
  },
  mounted() {
    document.querySelector('html').addEventListener('keydown', (ev) => {
      if (ev.altKey || ev.ctrlKey) {
        return false;
      }
      if (ev.key.length === 1) {
        if (this.currentKey !== ev.key) {
          this.currentKey = ev.key;
          this.repetition = 1;
        } else if (!this.isKeyBeingPressed) {
          ++this.repetition;
        }
        this.isKeyBeingPressed = true;
      }
      ev.preventDefault();
      return false;
    });
    document.querySelector('html').addEventListener('keyup', (ev) => {
      this.isKeyBeingPressed = false;
      ev.preventDefault();
      return false;
    });
    document.addEventListener('fullscreenchange', (event) => {
      this.inFullscreenMode = !!document.fullscreenElement;
    });
    document.oncontextmenu = function () {
      return false;
    };
    document.ondragstart = function () {
      return false;
    };
    document.addEventListener('click', () => {
      this.focusOnInputField();
    });
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
      inputField.click();
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
    }
  }
};
</script>

<style scoped>
#main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100vw;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  transition: background 0.2s ease 0s;
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
  width: 0;
  height: 0;
  position: absolute;
  top: -100vh;
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
