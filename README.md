
# Welcome to Chat to Api

This project is basicly to convert the open LLM chats that are publicly avilabe to a Api like interface such that they are easily automatable to test different LLMs capablities. 

# Usage

The usage is simple what you need to do is clone the project through

```cmd
git clone https://github.com/rahulsushilsharma/chat-to-api.git
``` 
## Config
Before running the code you have to you have to setup the enviroment variables and chrome profile.
run the followin commands
```cmd
cd chat-to-api
echo '' > .env
mkdir profile
```
1. Copy the data from `.example_env` to the newely created `.env` file. 
2. Create a new chrome profile, you can do that by clicking on your profile in top right corrner of google chrome and click `add`
3. after creating a profile open chrome in that profile and go to url `chrome://version/`, there you will see a profile path which usually looks like ` C:\Users\<user_name>\AppData\Local\Google\Chrome\User Data\<profile_name>` go to the path till `User Data` and copy the profile folder and paste it into the `profile` folder in `chat-to-api` folder.
4. Now that the basic config is done just need to setup the env variables 
``` .env
OPENAI_ID= <chatgpt_id>
OPENAI_PASSWORD=<chatgpt_password>
CHROME_PROFILE_PATH= --user-data-dir=<full_path_to_profile_folder>
CHROME_PROFILE_NAME= --profile-directory=<profile_name>
```

## Running application
Now you can compile and run the application
```cmd
npm install
npm run start
``` 
If everything works fine the aboue command will open a chrome window and will go to the chatgpt and will run a server through which you can connect and use the LLM's capablities.
> Note: Don't minimise the chrome tab just open your application on top of it as it will be detected as a bot.
