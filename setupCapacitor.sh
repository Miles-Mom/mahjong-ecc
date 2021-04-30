npx cap add ios
npx cordova-res ios --copy
echo "Create Android Assets using Android Studio Image Asset Studio with the 512x512 px Mahjong Tile and background under resources/android"

echo "Remember to set version codes in XCode"
echo "Also add deep link support:"
echo "https://capacitorjs.com/docs/guides/deep-links"
echo "Also, limit orientation to landscape, and hide status bar."

echo "On Android, lock orientation as well. Nothing on status bar. Need to allow cleartext requests for development purposes. "
echo "Android also has an issue with a broken fileprovider import that appears after every npx cap sync. To fix it, simply replace"
echo "import android.support.v4.content.FileProvider;"
echo "With"
echo "import androidx.core.content.FileProvider;"

echo "On Android, some things will need to be done for deep link support as well. "
