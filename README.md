# WordsofDeath - Backend

## Overview
The **WordsofDeath** backend is responsible for handling authentication, database interactions, and API routes that manage word and sentence entries. It uses **Express.js** for routing and **MongoDB** (native driver) for database operations. The backend is designed to support user authentication via **Discord OAuth2** and provides endpoints to store and retrieve words or sentences categorized by the users.

## Technology Stack
- **Server**: Express.js
- **Database**: MongoDB (native driver)
- **Authentication**: Discord OAuth2
- **Environment**: Node.js

## Features

### 1. **User Authentication** [(Implemention)](/src/controllers/authController.ts)
- Authentication is done via **Discord OAuth2**.
- User data is retrieved from Discord and stored in MongoDB, including:
  - **Username**
  - **Avatar** (hash)
  - **Discord ID**
  - **Join Date**

### 2. **Word/Sentence Management** [(Implemention)](/src/controllers/entryController.ts)
- Users can create entries (words or sentences) that are stored in thedatabase.
- Each entry is categorized and linked to the author’s Discord username.
- Information stored for each entry includes:
  - **Entry**: Word or sentence
  - **Categories**: List of categories
  - **Author**: Username of the creator
  - **Timestamp**: Date when the entry was created

### 3. **Whitelist Management**
Only whitelisted Discord users can access the backend. The whitelist is managed through a MongoDB [whitelist](/src/controllers/whitelistController.ts) collection. 

---

Made by [@prodbyeagle](https://prodbyeagle.vercel.app)