# Develop a CRUD app
During your [Basic Node and Express course](https://www.freecodecamp.org/learn/back-end-development-and-apis/#basic-node-and-express) on freeCodeCamp you got an introduction into express. Your goal now, is to develop a CRUD application with node.js and express.js.
## Preparation
* Make sure you have docker installed and running inside of your WSL.
* Clone this repository into your WSL.
## Start
Your first step will be to initialize your node project with the following command. Additionally you will need to create an **index.js** file.
```
npm init 
```
## Data structure
You will be creating a CRUD app, where you will be creating, updating and deleting books. The structure of the data is described [here](https://docs.appsteam.swisscom.com/getting-started/training/backend.html#crud-app)

## Help 
Check for internet ressources, courses you already did (FreeCodeCamp) or you can ask your PA.
### JWT ressources
- [JWT.io website](https://jwt.io/)
- [What Is JWT and Why Should You Use JWT](https://youtu.be/7Q17ubqLfaM)
- [JWT Authentication Tutorial - Node.js](https://youtu.be/mbsmsi7l3r4)
## Checklist CRUD App
### Books
- [ ] GET works on **/books** and **/books/[:id]**
- [ ] POST works on **/books**
- [ ] PUT works on **/books/[:id]**
- [ ] DELETE works on **/books/[:id]**

### Users
- [ ] GET works on **/users** and **/user/[:id]**
- [ ] POST on **/users**
- [ ] PUT on **/user/[:id]**
- [ ] DELETE on **/user/[:id]**

### Book Attributes
- ID (Should be an UUID)
- Title
- Release Year
- Author as Foreign Key

### Author Attributes
- ID (UUID)
- Full name
- Birthdate

### User Attributes
- ID (UUID)
- Username
- Password
- Name
- Surname
- Age
- Gender 