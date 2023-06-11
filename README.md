```diff
!{           VERSION : BETA 2           }!
#{--------------------------------------}#
#{                                      }#
#{   Only one channel can be recorded   }#
#{                                      }#
#{    Can record with twitch account    }#
#{                                      }#
#{--------------------------------------}#
```

# Requirement
- [streamlink](https://streamlink.github.io/)
- [ffmpeg](https://ffmpeg.org/)
- [nodejs](https://nodejs.org/)

# Config
- Get token and clienID. You can with a token generator ([here for example](https://twitchtokengenerator.com/))
- Edit yout twitch.json file
```json
{
    "twitch": {
        "clientID": "",
        "token": "",
        "refreshToken": "",
        "date": "",
        "website": "https://twitchtokengenerator.com",
        "OAuth": ""
    }
}
```
Put your clientID here 
```json
        "clientID": "",
```
Put your token here 
```json
        "token": "",
```
(optional) You can save your refresh token
```json
        "refreshToken": "",
```
(optional) Date of your token
```json
        "date": "",
```
(optional) Token for record with account
```json
        "OAuth": "",
```
# Run
```bash
node main.js -c gotaga
```
or 
```bash
node main.js -channel gotaga
```
or 
```bash
node main.js --channel gotaga
```
