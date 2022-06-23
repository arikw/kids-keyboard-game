export default {
  plugins: [
    {
      name: 'vue-as-static',
      apply: 'serve',
      enforce: 'pre',
      resolveId(source, importer) {
        if (source.endsWith('.vue')) {
          return '\ufeff' + source;
        }
      },
      // HMR
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.vue')) {
          console.log((new Date()).toLocaleTimeString(), '[Static Vue] change detected');
          server.ws.send({ type: 'full-reload', path: '*' });
        }
      }
    }
  ]
};
