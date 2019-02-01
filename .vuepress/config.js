module.exports = {
  title: 'Vue cookbook', // Page title
  description: 'Live e-book with recipes for making cool stuff with Vue',
  theme: 'live-ebook', // Important! This is the name of this theme
  base: '/', // Base URL, leave as is if you don't serve the book from a folder
  head: [
    ['meta', { property: 'og:type', content: 'website' }],
  ],
  themeConfig: {
    bookTitle: 'Vue cookbook', // Book title
    baseUrl: 'https://github.com/mateuszRybczonek', // Used for sharing in social media and for meta tags
    exitUrl: 'https://github.com/mateuszRybczonek',
    company: {
      name: 'Mateusz Rybczonek',
      url: 'https://github.com/mateuszRybczonek',
      logo: '/images/netguru.svg'
    }
  },

  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  }
}