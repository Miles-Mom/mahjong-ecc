pushd /srv/www
#TODO: This needs to be cloned for install scripts to be accessed - do we want to redo scripts? One for setup if server setup,
#one for setup if server not setup?
sudo git clone https://github.com/ecc521/mahjong.git
#sudo git checkbox express
pushd mahjong

sudo docker build -t mahjong .
sudo docker-compose up -d
