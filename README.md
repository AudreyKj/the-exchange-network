# React exchange network app

<br /> React app where users can also post messages in an "Exchange" section to exchange languages, skills, or services with other people. Users can decide whether their posts should be visible to all the users (public) or only visible to their friends (private). <br />

In addition, users can update their profile picture, chat with other users, make friend requests.

[visit live app](https://the-exchange-network.herokuapp.com/)

## Features

- register/login (password hashed with bcrypt)
- change profile picture
- edit bio
- search & find other users
- make friends
- chat made with socket.io
- post messages in Exchange section (private or public option)
- logout
- delete account and all associated info

## Tech

**Stack**: SASS/SCSS, JavaScript, React, Node.js, Redux, PostgreSQL, socket.io, Three.js <br />
**Protection**: CSURF <br />
**Storage**: AWS in dev | Cloudinary in prod <br />
**Testing**: React Testing Library + Jest <br />
**Deployment**: Heroku

## Visuals

![screenshot](readMe/screenshot_1.png)
![screenshot](readMe/screenshot_2.png)
