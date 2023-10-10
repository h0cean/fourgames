# summary: 
multiplayer games. Has color theme, multi language, RTL support and provide a lot of Telegram Mini App parameter and method usage. Users can choose their avatar and preferred piece color.
Also contains "four in a row", a fully built multiplayer game.


# Introduction:

a telegram mini app...this project built by react-js as fronted + nodejs as backend

in this project we made a multiplayer mini-app with the goal of developing a dynamic platform for serving multi and diffrent games.
the main data exchange in this platfom is by using socketIO-js
the app data flow begins by an inline-query 
we use inline queries to boost the intreset of users to create and share games in a any chat so any other telegram user who get accessed to the link shared through inline-query can join the game.
users can join the game directly from the chat with the help of twa-direct-links
after playing and finishing the game , users can see scroes and also they can come back and check results again by clicking on the link creator shared by them.
we also made some user-cutomization by using telegram  getProfilePicture api 

# TG-APIs we used
we almost used all of telgram webApp apis  backend api which you can find a list to them 
getUserProfilePhotos, getFile, sendMessage, and inline modes( inline-query and chosen inline query related api )


The bot contains a game platform and useful game states which allow implementation of live 
# Getting Started

You can refer to each separate back-end and front-end folder for documentation



# how to run 
client and backend both have a readme file for this purpose
