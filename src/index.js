const options = {

  moduleCache: {
    vue: Vue
  },

  async getFile(url) {
    console.log(url);
    const res = await fetch(url);
    if ( !res.ok ) { throw Object.assign(new Error(url + ' ' + res.statusText), { res }); }
    return await res.text();
  },

  addStyle(textContent) {

    const style = Object.assign(document.createElement('style'), { textContent });
    const ref = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ref);
  }
};

const { loadModule } = window['vue3-sfc-loader'];

window.loadSFC = function (path) {
  return Vue.defineAsyncComponent( () => loadModule(path, options) );
};

const app = Vue.createApp({
  template: '<App />',
  components: {
    App: window.loadSFC('src/components/app.vue')
  }
});

app.mount('#app');
