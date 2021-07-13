npx cap add ios
npx cap add android
npx cordova-res ios --copy
npx cordova-res android --type splash --copy
echo "Create Android Assets using Android Studio Image Asset Studio with the 512x512 px Mahjong Tile and background under resources/android"

echo "Remember to set version codes in XCode"
echo "Also add deep link support:"
echo "https://capacitorjs.com/docs/guides/deep-links"
echo "Also, limit orientation to landscape, and hide status bar."


echo "On Android, lock orientation as well. Need to allow cleartext requests for development purposes. "

echo "Cleartext - App > Manifests > AndroidManifest.xml > Application"
echo "android:usesCleartextTraffic=\"true\""

echo "Orientation - App > Manifests > AndroidManifest.xml > Activity"
echo "android:screenOrientation=\"landscape\""

echo "Android also has an issue with a broken fileprovider import that appears after every npx cap sync. To fix it, simply replace"
echo "import android.support.v4.content.FileProvider;"
echo "With"
echo "import androidx.core.content.FileProvider;"
echo "This issue is caused by the email plugin being outdated - see https://github.com/katzer/cordova-plugin-email-composer/pull/353"

echo "On Android, use the Tools menu (up in the OS menu bar, and App Links Assistant to configure deeplinks) "
echo "On Android, configure icons using image assets tool - cordova-res only use for splash. "

echo "On Android, to enable zoom in app, add the following to java/com.getcapacitor/BridgeActivity load function:"
echo "May not be needed anymore. "
echo "webView.getSettings().setBuiltInZoomControls(true);"
echo "webView.getSettings().setDisplayZoomControls(false);"
