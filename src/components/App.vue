<template>
  <div
    id="main"
    :style="{ backgroundColor: getColor(currentKey.toUpperCase(), false) }"
  >
      <svg xmlns="http://www.w3.org/2000/svg"  id="key" v-if="currentKey" :style="{ fill: getColor(currentKey.toUpperCase(), true) }">
        <text textLength="100%" dominant-baseline="central" text-anchor="middle" x="50%" y="50%">
          {{ currentKey }}
        </text>
      </svg>
    <img v-else src="src/assets/keyboard.svg" width="150" style="filter: invert(1);" alt="Press a key">
    <input v-model="currentKey" @keyup="currentKey=currentKey[0]" class="offscreen"/>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      currentKey: "",
      repetition: 1
    };
  },
  mounted() {
    document.querySelector("html").addEventListener("keydown", (ev) => {
      if (ev.altKey || ev.ctrlKey) {
        return false;
      }
      if (ev.key.length === 1) {
        if (this.currentKey !== ev.key) {
          this.currentKey = ev.key;
          this.repetition = 1;
        } else {
          ++this.repetition;
        }
      }
      ev.preventDefault();
      return false;
    });
    document.oncontextmenu = function () {
      return false;
    };
    document.ondragstart = function () {
      return false;
    };
    document.addEventListener('click', () => {
      const inputField = document.getElementsByTagName("input")[0];
      inputField.focus();
      inputField.click();
    });

  },
  methods: {
    getColor(txt, isBright) {
      const charCode = txt.charCodeAt(0);
      const h = parseInt((360 * Math.abs(Math.cos(charCode)) + 140 * this.repetition) % 360, 10);
      const s = parseInt(92 + 8 * Math.abs(Math.sin((2 * charCode) / this.repetition)), 10);
      const l = parseInt(
        (isBright ? 10 : 0) + (isBright ? 30 : 15) * Math.abs(Math.cos((3 * charCode) / this.repetition)),
        10
      );
      console.log(`hsl(${h}, ${s}%, ${l}%)`);
      return `hsl(${h}, ${s}%, ${l}%)`;
    },
  },
};
</script>

<style>
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
  stroke-width: 3vmin;
  paint-order: stroke fill;
}

.offscreen {
  width: 0;
  height: 0;
  position: absolute;
  top: -100vh;
}
</style>
