npx cap add ios
npx cordova-res ios --copy

echo "Remember to set version codes in XCode"
echo "Also add deep link support:"
echo "https://capacitorjs.com/docs/guides/deep-links"

echo "Also, setting orientation to landscape modes only is recommended. Shouldn't be needed due to the auto-rotate plugin (the rotate animation is cool), but there have been very occiasonal non-reproducible issues with font sizes not working properly with auto rotation, and not auto rotating is faster. "
