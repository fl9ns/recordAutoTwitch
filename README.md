```diff
!{           VERSION : BETA 1           }!
#{--------------------------------------}#
#{                                      }#
#{   Only one channel can be recorded   }#
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
        "refreshToken": ""
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
