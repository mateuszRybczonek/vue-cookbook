module.exports = {
  title: 'Vue cookbook', // Page title
  description: 'Live e-book with recipes for making cool stuff with Vue',
  theme: 'live-ebook', // Important! This is the name of this theme
  base: '/', // Base URL, leave as is if you don't serve the book from a folder
  head: [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'google-site-verification', content: 'xE_sAhe0GDMuRjcF5uaBVCG_hheknz5hGiT6xD8P2O4' }],
  ],
  themeConfig: {
    bookTitle: 'Vue cookbook', // Book title
    baseUrl: 'https://github.com/mateuszRybczonek', // Used for sharing in social media and for meta tags
    exitUrl: 'https://github.com/mateuszRybczonek',
    company: {
      name: 'Mateusz Rybczonek',
      url: 'https://github.com/mateuszRybczonek/vue-cookbook',
      logo: '/images/github.svg'
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