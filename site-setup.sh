pushd /srv/www
git clone https://github.com/ecc521/mahjong.git

pushd mahjong

docker build -t mahjong .
docker-compose up -d
