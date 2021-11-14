sudo mkdir /srv/www
pushd /srv/www
sudo git clone https://github.com/ecc521/mahjong.git

echo "Is the server already set up for multiple sites? If No, setup will be performed. "
select yn in "Yes" "No"; do
    case $yn in
        No ) ./server-setup.sh; break;;
        Yes ) break;;
    esac
done

pushd mahjong

sudo docker build -t mahjong .
sudo docker-compose up -d
