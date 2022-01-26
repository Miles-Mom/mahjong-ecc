//i18n side helper - note the locales are imported statically
/* decided to keep client & server side the same code.  
  - some of the code are used for both server and client side, client for example. 
  - therefore, same approach, static catalog,  has to be used for both the server and client. 
  - same set of locale files for server and client - easier upkeep. 

  global single instance. 
*/

const {I18n} = require('i18n')
const {readSave, writeSave, deleteSave} = require("./SaveManager.js")
const {Setting} = require("./Settings.js")

const i18n = new I18n({      
  defaultLocale: 'en',
  locales:['en', 'zh'],

  // use static catalog for the client side since file ops won't be there
  staticCatalog: {
    zh: require('../assets/locales/zh.json'),
    en: require('../assets/locales/en.json')
  }
})

// this only makes sense from client side
async function initClientLocale() {

  // do we have an overide? 
  locale = await window.settings.locale.getValueFromDisk()  // do not use getValue as the default will mess this up
  if (locale) {
    // if the user has set something, we use it
    i18n.setLocale(locale)
    console.log("locale " + locale)
  } 
  else {
    // figure out the browser locale, and use it
    // i18n.init(req)  can't use, as this needs request object.  

    // chinese is the only non-default language we currently support
    // if the browser is of chinese locale, we use it, otherwise we default to english 
    locale = 'zh'
    if (!navigator.language.includes(locale)) {
      locale = 'en'
    }
        
    i18n.setLocale(locale);

    // we set the setting so the setting dialog behaves more natural - that the setting reflects the CURRENT locale, 
    // not necessarily what the user himself has set.
    await window.settings.locale.setValueToDisk(locale) // do not use setValue() as it will trigger the onValueSet
  }
}

module.exports = {i18n, initClientLocale}