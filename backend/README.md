# IMPORTANT: more detailed description  and apis and deploy introduction will be added FOR this repository in another one so it will be for tg contest
i will add the new details in this repo:
https://github.com/h0cean/fourgames-detailed
https://github.com/h0cean/fourgames-detailed

## Setup 
in order for this app to work properly and  receive telegram updates for chosen_inline_query you need to set rate of received updates for chosen_inline_query to 100%
this is because creation of new games depends on receiving this kind of updates
you also need to active inline mode through botfather
install node-js+ mongodb  tutorial (https://www.youtube.com/watch?v=Bcg6C0G_tAA)
In the project directory, run npm install to install the packages and get started. 
After that you have to set enviroment variable :
# enviroment variables
MONGO_ADDRESS='127.0.0.1'
MONGO_PORT='27017'
MONGO_DBNAME='devfourgames'
HTTP_ADDRESS='127.0.0.1'
HTTP_PORT='1111'
TG_TOKEN='token'
BOT_HOST_URL='somewhere.com'
BOT_PATH='the path express should listen to in order to listen to telegram updates'
PUBLIC_PICS_PATH='the file system path to server avatars and static files'
# ssl
in order to work with telegram updates which is neccessory for this app we need to set webhook or simmilar options
set webhookl for :
BOT_HOST_URL/BOT_PATH/botBOT_TOKEN/ 
#
forward all terafick to HTTP_ADDRESS:hTTP_PORT

Your app is ready to be deployed!
