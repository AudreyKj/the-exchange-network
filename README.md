# React exchange network app

This React app is themed around the idea of exchange: users can post messages in an "Exchange" section to exchange languages, skills, or services with other people. Users can decide wether their posts should be visible to
all the users (public) or only visible to their friends (private).

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

**Stack**: HTML, CSS, JavaScript, Node with Express.js, PostgreSQL, socket.io <br />
**Protection**: CSURF <br />
**Storage**: AWS in dev | Cloudinary in prod <br />
**Testing**: React Testing Library + Jest <br />
**Framework**: React | **Deployment**: Heroku

## Future improvements

- Use Nodemailer to automate sending of emails so that users can change their password.

##Design - color palette

![screenshot](palette.jpg)
--> black #333333, blue #00909e, grey #d6d6d6, white #ffffff

## Visuals

![screenshot](screenshot_1.png)
![screenshot](screenshot_3.png)
![screenshot](screenshot_4.png)
![screenshot](screenshot_5.png)
