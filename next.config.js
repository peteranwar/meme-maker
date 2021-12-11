const withPlugins = require("next-compose-plugins");
const withImages = require('next-images');
const nextTranslate = require('next-translate');


const nextConfig = {
  images: {
    domains: ['']
  }
}

module.exports = withPlugins([
  withImages,
  nextTranslate
  ], nextConfig)
