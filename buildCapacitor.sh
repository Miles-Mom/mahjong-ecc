echo "Remember to run npx cap update if you installed any new native plugins"

rm -rf capacitorDir #Purge the current capacitorDir directory so that junk can't accumulate.
mkdir capacitorDir
cp -r *.html capacitorDir/
node copyCapacitorAssets.js

npx cap copy

echo "Run npx cap open ios or npx cap open android to open the projects. "
