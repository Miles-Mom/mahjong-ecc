npx cap add ios
npx cordova-res ios --copy
npx cordova-res android --copy

echo "Remember to set version codes in XCode"
echo "Also add deep link support:"
echo "https://capacitorjs.com/docs/guides/deep-links"

echo "Also, limit orientation to landscape, and hide status bar."
