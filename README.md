# React exchange network app

This React app is themed around the idea of exchange: users can post messages in an "Exchange" section to exchange languages, skills, or services with other people. Users can decide wether their posts should be visible to
all the users (public) or only visible to their friends (private).

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

**Stack**: HTML, CSS, JavaScript, Node with Express.js, PostgreSQL, socket.io <br />
**Protection**: CSURF <br />
**Storage**: AWS in dev | Cloudinary in prod <br />
**Testing**: React Testing Library + Jest <br />
**Framework**: React | **Deployment**: Heroku

## Future improvements

- Use Nodemailer to automate sending of emails so that users can change their password.

## Visuals

![screenshot](screenshot-socialnetwork.png)
![screenshot](screenshot2-network.png)
![screenshot](screenshot3-network.png)
