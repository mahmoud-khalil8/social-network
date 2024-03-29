
---

# Social Network App

This is a social network application built using Node.js, Express.js, MongoDB, and other technologies. It allows users to create accounts, post messages, follow other users, send messages, receive notifications, and more.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)


## Introduction

This social network app provides a platform for users to connect, share their thoughts, follow others, and engage in conversations. It is designed to be user-friendly, responsive, and scalable.

## Features

- **User Authentication**: Users can sign up and log in securely.
- **Posting**: Users can create posts, including text, images, and links.
- **Following/Followers**: Users can follow/unfollow other users to see their posts.
- **Messaging**: Users can send direct messages to each other.
- **Notifications**: Users receive notifications for new followers, likes, retweets, replies, and messages.
- **Profile Management**: Users can update their profile picture, cover photo, and other details.
- **Search**: Users can search for posts and other users.
- **Real-time Updates**: Chat messages and notifications are delivered in real-time using Socket.IO.
- **Responsive Design**: The application is designed to work seamlessly across various devices and screen sizes.

## Installation

To run this application locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone [https://github.com/your-username/social-network-app.git](https://github.com/mahmoud-khalil8/social-network.git)
   ```

2. Navigate to the project directory:

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up your environment variables:

   - Create a `.env` file in the root directory.
   - Add environment variables such as `DATABASE_URL`

5. Start the server:

   ```bash
   node index.js
   ```

6. Access the application at `http://localhost:3000` in your web browser.

## Usage

- Register for an account or log in if you already have one.
- Explore posts from other users on the home page.
- Follow users whose posts you find interesting.
- Create your own posts and engage with others by liking, retweeting, and replying.
- Send direct messages to other users.
- Customize your profile with a profile picture, cover photo, and bio.
- Stay updated with notifications for new activities.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Pug (formerly known as Jade)
- Bootstrap
- Socket.IO
- FontAwesome
- Cropper.js
