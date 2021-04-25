echo "Remember to cd into directory with this script"
mkdir guaranteed
cp americanmahjongroom.server.json guaranteed/americanmahjongroom.server.json
node ../server.js --loadState americanmahjongroom --serverDataDirectory guaranteed --avoidFSWrites --runBotClientAutoPlay --simulatedGamesToRun 1000
