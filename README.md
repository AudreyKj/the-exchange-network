# React social network app

This React app is themed around the idea of exchange: users can post messages in an "Exchange" section to exchange languages, skills, or services with their friends.

## Features

- register/login (password hashed with bcrypt)
- search & find other users
- make friends
- chat made with socket.io
- post messages in Exchange section
- delete account and all associated info
- logout

Note: In development, I added features where the user could upload a custom image profile and reset the password through email using AWS. I've taken out both features in production to prevent the costs associated with AWS. The code for these features is commented out.

## Tech

**Stack**: HTML, CSS, JavaScript, Node with Express.js, PostgreSQL, socket.io <br />
**Protection**: CSURF <br />
**Testing**: React Testing Library + Jest <br />
**Framework**: React | **Deployment**: Heroku

## Future improvements

- At the moment, posts in the Exchange section are only visible to the users' friends. To improve user experience, I am planning on updating this section to let users choose if their posts should be private or public.
- Another nice feature would be to assign a distinctive color to each user upon registration and then let
  the users change the color in the profile section.

## Visuals

![screenshot](screenshot-socialnetwork.png)
![screenshot](screenshot2-network.png)
![screenshot](screenshot3-network.png)
