# Run this script to start mongodb after a reboot
sudo killall mongod
mongod --dbpath /home/pi/leaderboard/
