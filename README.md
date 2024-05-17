# SS2023 SSC GROUP_1

**This project was done by:**

- [Miriam Beer](mailto:cc221021@fhstp.ac.at)
- [Maria-Michaela Marinova](mailto:cc221031@fhstp.ac.at)
- [Felix Teutsch 221036](mailto:cc221036@fhstp.ac.at)

## Setup

### 1. Cloning the Project

To set this project, you will have to clone it from the [FH GitLab](https://git.nwt.fhstp.ac.at/cc221036/ss2023-ssc-group_1/). The main Branch should always have a stable version.

### 2. Running the Project

Ensure that the host machine has Node (and npm) installed! Open a command line, navigate to the project folder and type:

```console
npm install
```

This might take some time. It installs all the necessary node modules that the project needs to run. After the installation is finished, you will have to create a [.env](.env) file. Read [Point 4](#4-accessing-the-database) for more information.

After everything has been installed, start the server with the following command:

```console
node app.js
```

This executes the [app.js](app.js) file, which internally starts the server. The console prompts then the following message:

```console
App listening at http://localhost:3000
Connected
```

_Keep in mind that the port (:3000) may vary. It can be configured in the [app.js](app.js) file under the variable 'port'._

The line **connected** confirms that the server connected to the database correctly.

### 3. Accessing the Web App

If you are running the application on the same machine as you are hosting it, simply open a browser and type in the following URL:

```console
http://localhost:3000
```

_Again, the port may vary._

If you are running the application on a different machine, you will have to type in the IP address of the host machine instead of localhost.

```console
http://<IP address of the host machine>:<configured port>
```

#### 3.1. Web Sockets

The Web sockets also run on a different port. The default port is 8080. If you want to change it, you can do so in the [services/websockets.js](/services/websockets.js) file under the variable 'wsPort'.

Additionally, ensure that the port is open on the host machine. If you are accessing the Web App from a different machine, change the address the web socket is accessed from the client in the file [chat.js](/public/javascript/chat.js) under the variable 'wsAddress'. Also change the port if you changed it in the [websockets.js](/services/websockets.js) file.

### 4. Accessing the Database

The database credentials are stored in the [.env](.env) file. The file is not included in the repository. If you want to access the database, you will have to create the file yourself. The file should look like this:

```console
DB_USERNAME=<database username>
DB_PASSWORD=<database password>
DB_NAME=<database name>
ACCESS_TOKEN_SECRET=<access token secret>
```

The access token secret is used to sign the JWTs. It can be any string you want. A template database can be accessed with the following credentials:

```console
DB_USERNAME=cc221036
DB_PASSWORD=xU5@Xf6oJhK.
DB_NAME=cc221036
```

## Features

Here is a list of most of the features that are implemented in the WebApp (the links are only available if the server is running on the client machine):
| Feature | Description | Link |
| --- | --- | --- |
| Landing Page | Login, Register Or Search a User | [Landing](http://localhost:3000/) |
| Login | Login with username and password | [Login](http://localhost:3000/login/) |
| Register | Register with username, first name, last name, status and password | [Register](http://localhost:3000/register/) |
| All Users | View all Users (search to only see specific ones) | [Users](http://localhost:3000/users/) |
| Chat | Chat with other users | [Chat](http://localhost:3000/chat/) |
| Only available if logged in | | |
| Logout | Logout from the WebApp | [Logout](http://localhost:3000/logout/) |
| Post | Create a Post | [Post](http://localhost:3000/post/) |
| Feed | View all posts of the people you follow | [Feed](http://localhost:3000/feed/) |
| Profile | View your own profile (Felix in this case) | [Profile](http://localhost:3000/users/Felix) |
| Only Available if user or admin | | |
| Edit Profile | Edit your own profile | [Edit Profile](http://localhost:3000/users/Felix/edit) |
| Edit Profile Picture | Edit your own profile picture | [Edit Profile Picture](http://localhost:3000/users/Felix/edit/picture) |
| Edit Profile Password | Edit your own profile password | [Edit Profile Password](http://localhost:3000/users/Felix/edit/password) |

### Recommendations

We recommend doing the following steps to test the WebApp:

- Register a new user
- Logout
- Login with the new user
- Search for other users
- Follow some users
- Create a post
- View your own profile
- View your feed
- Edit your profile
     - Change Your password
     - Change your profile picture
     - Request Admin rights
          - Edit someone else's profile
- View the Chat
     - Start a conversation with another user
          - View the chat history
          - Send messages
     - Enter open a group chat
          - Send messages
               - Group chat messages are only visible to users that are in the group and don't get saved!
          - Admire the beautiful user colors, that get generated based on their usernames
          - Open a new incognito tab, open the chat and join the group without logging in (bam. You are a guest user).
- Delete your account
- Play around with the website a bit and accept the color palette! It's not that bad!

_(If you give yourself admin rights, you can change use's password, without having to know their previous ones. This way you can log into other profiles. Nevertheless, the default password should be 'a' for most users.)_

## Database

If you want to host your own database, make sure to update the [database.js](/services/database.js) (host & port) and [.env](.env) (Credentials & db name) files with the correct credentials. The database structure can be found in the [database.sql](/database/database.sql) (Readable version [database_structure.pdf](/database/database_structure.pdf)).

## Problems & Missing Data

### 1. Problematic Images

During testing, some unresolved problems occurred with screenshotted images. Please don't use them. If you want to test the profile picture upload, please use the [guest_profile.png](/public/user/guest_profile.jpg) file.

### 2. Missing Data

If some users have posts, but they can't be accessed (represented by the [placeholder image](/post/unavailable.svg)) it might be because there are entrances in the database, that are missing from the local files. This can be fixed by deleting the user and creating a new one with the same username. This will delete all the posts. The user will have to upload a new profile picture and create new posts.

## Criteria Fulfillment

### 1. Pitch of the WebApp

Are you tired of getting hated on social media, just because you post too many pictures of your bread? Don't worry, we have the solution! Introducing Breaddit! Breaddit is a social media platform, where you can share your bread with other bread enthusiasts. You can also chat with other users and and discuss baked topics in groups! Breadid is the future of social media! So use the app, before Elon Musk buys it, and makes it a paid service!

### 2. What is it?

Breadit is a platform for users to post images with captions, follow eachother, like posts and chat with eachother. A detailed list of functions can be found [here](#features).

### 3. Assessment Criteria and To-Dos?

#### 3.1. What your submission must be capable of: (60p)

- [x] Users can be: displayed, added, updated & deleted (10p)
- [x] Nice overall design that is consistent throughout all views and appealing to a user (5p)
- [x] New users can register themselves and the password is saved encrypted in the database (5p)
- [x] Users can log in and log out (using JWT) (5p)
- [x] Only users with the role "Administrator" can change data. Users can only edit their own profile. (5p)
     - Admin users are able to change the password of other users without knowing their previous password.
- [x] There are at least 3 other tables in correspondence with the users that also have their own model, controller and views implemented. (10p) - User - Post - Chat - ...
- [x] There is a chat with different rooms and users can switch between rooms. (5p)
     - Users can join rooms, where messages don't get stored, and write others in chats, where messages get stored.
- [x] Everything works as expected and there are no unhandled errors or blank pages (5p)
     - Some issues with fileuploads that can't be handled due to corrupt / faulty images.
- [x] Project is hosted online (e.g. via UAS Node.js Hosting Service) (10p)
     - Link to the [WebApp](https://cc221036-10065.node.fhstp.io/)
     - If you want me to start it, [let me know](mailto:felix@teutsch.it)

#### 3.2. Optional Criteria: (55p)

- [x] User experience: The project should have a user-friendly interface that is easy to navigate and understand (self-explaining!). Design should be visually appealing, creative, and functional. (5p)
     - Colors might not be everyone's cup of tea, but we choose a design that is different from traditional social media platforms.
- [x] Documentation: functions have comments that explain what the function does so that you still know it what your code does if you read it in one year (5p)
     - We tried to comment as much as possible, but some functions are self-explanatory.
     - We also tried to use self-explanatory variable names.
- [x] All errors are handled with proper error handling capabilities and users get at least a nice/funny "404 not found" page (5p)
     - We tried to handle all errors, but some errors are not catchable.
     - The Logo does a funny spinn if you hover it ;)
- [x] Code follows naming conventions, is tidied up, clean and self-explanatory even when someone else reads it (5p)
     - We tried to use lowerCameCase for JS varaibles and name_separation_with_underscores for css classes.
          - In some cases we vary from this convention, but only if it makes sense.
- [x] Picture upload works and uses UUID (5p)
     - We use UUIDs for the filenames of the uploaded posts.
     - Profile pictures & Banners are saved as the username of the user.
     - We use uuidv5 with a namespace, the username of the user, and the current time to generate a unique filename, that is still in relation to the user.
- [x] Users can upload/update their profile pictures. (5p)
     - Also banners ;)
- [x] The chat uses the name of the user when logged in and else „guest” (5p)
- [x] JWT passed in the HTTP header and not in cookies (5p)
     - JWT is passed in a special element inside the HTTP header (this element is called cookies and is passed inside the header on requests ;)).
- [x] Only administrators can view all user data. Users can only see which other users exist as well as their "public" profiles (5p)
     - Users only see information of eachother if they follow one another.
     - Admins see this information regardless of following & are able to change it (Userdata, Profile Picture & Banner, Passwords).
- [x] Users can delete their own profile (5p)
     - Users can delete their own profile, but not their own posts.
          - Once on the Internet, it stays there forever!!!
     - Users can also delete messages they send
- [x] Everything was submitted correctly (no node_modules, easy but detailed enough description for the lecturer how to start the project and test it, credentials for your database for the submission are included, etc) (5p)
     - This README should be enough to get the project up and running.
     - Might be a bit too much though... sorry :/
