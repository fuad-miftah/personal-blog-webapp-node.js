# Personal Blog Webapp using Node.js

This is a personal blog web application built with Node.js and Express.js. 
It utilizes EJS as the templating engine and MongoDB as the database. 
The application also includes a convenient Google login and signup features.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Authentication:
  
  - Google OAuth login and signup.
    
  - Session management for authenticated users.
    
- Blog Management:
  
  - Create, edit, and delete personal blog posts.
    
- Database:
  
  - MongoDB is used to store user data and blog posts.
    
- Templating Engine:
  
  - EJS (Embedded JavaScript) is used to generate dynamic HTML pages.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js: Make sure Node.js is installed on your system.
  
- MongoDB: You need a running MongoDB server or a cloud-based MongoDB service.
  
- Google OAuth Credentials: You will need to set up a Google Developer Console project and obtain OAuth 2.0 client credentials.
  
- Email Configuration: Set up email authentication by providing the following environment variables:

## Installation
1. Clone the repository:

```
git clone https://github.com/your-username/your-blog-app.git
cd your-blog-app
```

2. Install the project dependencies:
   
```
npm install
```

3. Start the development server:
   
```
npm start
```

Your blog web app should now be running locally.

## Configuration

To configure the application, follow these steps:

1. Create a .env file in the project's root directory with the following environment variables:

```
MONGODB_URI=your-mongodb-connection-uri
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BASE_URL=http://localhost:3000  # Update the URL for your deployment
AUTH_EMAIL=your-email
AUTH_PASS=your-email-password
```

2. Update the .env variables with your specific credentials.
   
## Usage

Start the application as described in the "Installation" section.

Open a web browser and navigate to http://localhost:3000 (or your configured BASE_URL).

Use the Google OAuth feature to log in or sign up.

Create and manage your personal blog posts.

Enjoy your blog web application!

## Contributing

Contributions are welcome! Please follow these steps to contribute to the project:

Fork the project.

Create a new branch for your feature or bug fix: git checkout -b feature/your-feature-name.

Commit your changes: git commit -m 'Add some feature'.

Push to your branch: git push origin feature/your-feature-name.

Submit a pull request.
