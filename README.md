

<!-- PROJECT LOGO -->
<br />
<p align="center">
    <img src="https://avatars.githubusercontent.com/u/73503432?v=4" alt="Logo" width="80" height="80" />
    <h3 align="center"><a href="https://learnwithsumit.com">React Redux chat application</a></h3>
</p>

# Project Plan - Chat Application with RTK Query

## Requirement Analysis

1. user can register. after registering, user will be automatically logged in, we will store login info to localStorage (for login persistance) and redirected to inbox page

2. user can login and after login we will save the login information in localStorage (for login persistance) and redirect user to inbox

3. load sidebar messages from conversation API and implement load more feature

4. load specific conversation messages when user clicks on it and implement load more feature

5. when user sends message,
   a) if conversation id is present, update conversation table and also inserts into messages table
   b) if conversation id is missing, get conversation id using filter
   _ if conversation id exists, then update that conversation and add to messages table
   _ if conversation id is missing, insert that conversation and add to messages table

6. sidebar conversation list scroll - sort by latest first and when user loads more, bring previous "10 conversations sorted by latest first" and pushed into the conversations array

7. messages list scroll - bring "10 latest messages per request sorted by oldest first". when user loads more, "bring previous 10 messages sorted again by oldest first" and unshift into the array

## Required APIs

1. register
2. login
3. get list of users other than requesting user
4. update conversation
5. insert conversation
6. find conversation
7. list conversation
8. list messages by conversation id
9. send message (insert messages into messages table)

<!-- TABLE OF CONTENTS -->

## ![tableOfContent][tableofcontent-shield] Table of Contents

| HTML TEMPLATE                            | SERVER TEMPLATE                              | CODE RUN                   | CONTACT                    |
| ---------------------------------------- | -------------------------------------------- | -------------------------- | -------------------------- |
| [Get HTML template](#-get-html-template) | [Get SERVER template](#-get-server-template) | [How to run](#-how-to-run) | [Contact us](#-contact-us) |

<br>
<!-- GET HTML TEMPLATE -->

## ![htmlIcon][htmlicon-shield] Get HTML Template

You can find the raw HTML template of the Chat Application with RTK Query from the "html_template" folder.

<!-- GET SERVER TEMPLATE -->

## ![serverIcon][servericon-shield] Get SERVER Template

You can find the raw SERVER template of the Chat Application with RTK Query from the "server" folder.

<!-- HOW TO RUN -->

## ![rocketIcon][rocketicon-shield] How to run

Please follow the below instructions to run this branch in your machine:

1. Login to the GitHub account on which you have been granted access to this repository. If you have purchased the course but didn't get the access to this repository, please contact our support team. You will find contact details below.

2. Clone this repository -
   ```sh
   git clone https://github.com/Learn-with-Sumit/think-in-a-redux-way.git
   ```
3. Go to the cloned project directory
   ```sh
   cd think-in-a-redux-way
   ```
4. Checkout/switch to branch 9.1
   ```sh
   git checkout 9.1
   ```
5. Install dependencies
   ```sh
   npm i
   ```
6. Install VS Code [Live Server plugin](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) & start the server.
   ```sh
   npm start
   ```
7. Your app should be available in http://localhost:3000

<br>

Please follow the below instructions to run server in your machine:

1. Go to the server directory
   ```sh
   cd server
   ```
2. Install dependencies
   ```sh
   npm i
   ```
3. Start the server
   ```sh
   npm start
   ```

<br>

<!-- CONTACT  -->

# chat-application-rtk
