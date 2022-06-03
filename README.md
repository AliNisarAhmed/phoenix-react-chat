# Chat App built with Phoenix & React

This is a chat app built with Phoenix (Elixir's amazing backend framework), and React on the frontend, using Chakra-UI component Library.

### Project board

Project board can be found [here](https://github.com/users/AliNisarAhmed/projects/14/views/2)

### Features

- [ ] Users can either sign up or use the app as a guest with a random username
- [x] Users can create a private room
- [x] Users can invite others to join their private room
- [ ] Users can kick other users from their private rooms
- [ ] Users can set a topic of discussion in their private rooms
- [ ] Users can block other users in the lobby to avoid invitation spamming
- [ ] Users can use emoji's in the chat
- [ ] Users get a notification when other users invite them, which they can either accept or reject
- [ ] Invitiations expire after some time
- [ ] Users can filter usernames in the invite view
- [ ] Private room owners can share the link of the room as well to invite users
- [ ] Users can choose dark mode
- [ ] Users can see a connectivity status icon in the lobby and private room for themselves
- [x] Users can see a list of current online users
- [ ] Users have a random avatar

### Code Organization

- Business logic lives inside `/apps/chat`
- Controller/Router logic lives inside `/apps/chat_web`
- Frontend code can be found in `/apps/chat_web/assets`

### Deployment

Todo