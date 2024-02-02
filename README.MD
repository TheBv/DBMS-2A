# DBMS Project 2-B

Project that aims to create a full stack solution that allows the user to report various
behaviors about themselves.

## Setup

The project consists of three main directories.

The `native` directory contains all the code to run the React Native app. That allows a 
user to create an account and answer questions.

The `dashboard` directory contains all the code to run a dashboard that allows **anyone** to create, delete and post notifications.

The `backend` directory contains all the code to run a REST service to manage the answers, users and questions that are saved in a postgres database.

## Technologies
The `backend` is built on node.js alongside drizzle and fastify.

The `dashboard` uses react alongside vite and leverages components from shadcn.

The react `native` mobile app is built with react-native alongside expo to handle push notifications. 

---
This project was part of a course at the Goethe University Frankfurt and was developed by
Patrick Schrottenbacher and Amina Felic