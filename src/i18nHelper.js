//i18n side helper - note the locales are imported statically
/* decided to keep client & server side the same code.
  - some of the code are used for both server and client side, client for example.
  - therefore, same approach, static catalog,  has to be used for both the server and client.
  - same set of locale files for server and client - easier upkeep.

  - global single instance in either case.

  Issues noticed with npm i18n library:
  - needs a locale to be set, default not-standing.
  - namedArg adds encoding, problemantic if it has html code, say, link.
  - does not support standard printf %(name)s %(name2)d like format.
  - i18n.__n() works if count is the only param. suffers from namedArg problem otherwise.
  - therefore, we opt to set locale early/bootstrap, and to avoid namedArg, and avoid __n() unless single var.
*/

const {I18n} = require('i18n')

const i18n = new I18n({
  defaultLocale: 'en',
  locales:['en', 'zh'],

  // use static catalog for the client side since file ops won't be there
  staticCatalog: {
    zh: require('../assets/locales/zh.json'),
    en: require('../assets/locales/en.json')
  },
  directory: ""     // this is to avoid i18n to demand path-browserify, it should not, given staticCatalog.
})

// ------------------------------------------------
// below functions only make sense from client side

// bootstrap i18n to browser locale
function initToBrowserLocale() {
  // chinese is the only non-default language we currently support
  // if the browser is of chinese locale (any region), we use it, otherwise we default to english
  let locale = 'zh'
  if (!navigator.language.includes(locale)) {
    locale = 'en'
  }

  i18n.setLocale(locale)
  return locale
}

function initToClientLocale() {

  let locale = window.settings.locale.value
  if (locale) {
    i18n.setLocale(locale)
  }
}

module.exports = {i18n, initToBrowserLocale, initToClientLocale}
