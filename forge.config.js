module.exports = {
  packagerConfig: {
    name: 'Consolide',
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "consolide"
      }
    },
    {
      name: "@electron-forge/maker-zip",
    },
    {
      name: "@electron-forge/maker-deb",
      config: {}
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {}
    }
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/index.html",
              js: "./src/renderer.js",
              name: "main_window",
              preload: {
                js: "./src/preload.js"
              }
            }
          ]
        }
      }
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'mathias-moreira',
          name: 'consolide'
        },
        prerelease: true
      }
    }
  ]
};