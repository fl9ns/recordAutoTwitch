console.clear()
/*
    ---   TWITCH TOKEN   ---

    -> run browser
    -> twitch.tv (connected)
    -> js console
    -> document.cookie.split("; ").find(item=>item.startsWith("auth-token="))?.split("=")[1]
*/

// Require
const Https = require(`https`)
const Fs = require(`fs`)
const { twitch } = require(`/home/flens/twitch.json`)
const { exec } = require(`child_process`)

// Const
const scriptStartedAt = new Date()

// Let
let user = {
    id: `165122142`,
    login: `farah`,
    display_name: `Farah`
}
let started = ``
let direc = `/run/media/flens/Twitch`

function readParameters() {

    // Need 2 arg
    if(process.argv.length == 4) {

        // Correct flag
        if(process.argv[2] == `-c`
        || process.argv[2] == `-channel`
        || process.argv[2] == `--channel`) {

            // RegEx (alphanumeric and _) 4 chars minimal
            if(/^([a-z0-9_]{4,})$/gm.test(process.argv[3])){
                user.login = process.argv[3].toLowerCase()

            // Error
            } else {
                fatalError(`Bad channel name`)
            }
        }
    }
}

function getUserInfo() {
    return new Promise((resolve) => {
        Https.get(
            {
                hostname:`api.twitch.tv`,
                path: `helix/users?login=${user.login}`,
                method: 'GET',
                headers:{
                    'Authorization':`Bearer ${twitch.token}`,
                    'Client-Id':`${twitch.clientID}`
                }
            },
            (res) => {

                // Save chunks
                let data = ''
                res.on('data', (chunk) => { data += chunk })

                // Result
                res.on('end', () => {

                    // default
                    let json = null

                    // try parse object
                    try {
                        json = JSON.parse(data)

                    // Error
                    } catch(e) {
                        fatalError(`Can't read object [ run() ]`)
                    }

                    // Check object
                    if(typeof json.data !== `undefined`
                    && typeof json.data.length !== `undefined`
                    && json.data.length > 0
                    && typeof json.data[0].id !== `undefined`
                    && typeof json.data[0].login !== `undefined`
                    && typeof json.data[0].display_name !== `undefined`
                    ) {
                        // User
                        user.id = json.data[0].id
                        user.login = json.data[0].login
                        user.display_name = json.data[0].display_name

                        console.log(`Channel : ${user.display_name} (${user.id})`)

                        // Directory to record
                        direc += `/${user.login}`
                        console.log(`Directory : ${direc}`)

                        if(!Fs.existsSync(direc)) {
                            Fs.mkdirSync(direc)
                            console.log(`Directory "${user.login}" is created !`)
                        }

                        // Ended
                        resolve(true)

                    // Error
                    } else {
                        fatalError(`Object is bad [ run() ]`)
                    }

                })
            }
        )
    })
}

function getLiveInfo() {
    return new Promise((resolve, reject) => {
        try{
            Https.get(
                {
                    hostname:`api.twitch.tv`,
                    path: `helix/streams?user_id=${user.id}`,
                    method: 'GET',
                    headers:{
                        'Authorization':`Bearer ${twitch.token}`,
                        'Client-Id':`${twitch.clientID}`
                    }
                },
                (res) => {

                    // Save chunks
                    let data = ''
                    res.on('data', (chunk) => { data += chunk })

                    // Result
                    res.on('end', () => {
                        let json = null
                        try {
                            json = JSON.parse(data)
                        } catch(e) {
                            let now = getDateHuman(new Date())
                            process.stdout.write(`# ${now.date}/${now.month}/${now.year} ${now.hour}:${now.min}:${now.sec} | ERROR getLiveInfo()` + "\r")
                        }

                        // Ended
                        resolve(json)
                    })
                }
            ).on('error', (e) => {
                resolve(null)
            })
        } catch(e) {
            resolve(null)
        }
        setTimeout(function(){reject(null)},10000)
    })
}

async function loop() {

    let n = getDateHuman(new Date())
    process.stdout.write(`  ~ ${n.date}/${n.month}/${n.year} ${n.hour}:${n.min}:${n.sec}                                          ` + "\r")
    
    let json = null
    try {
        json = await getLiveInfo()
    } catch (e) {
        let now = getDateHuman(new Date())
        process.stdout.write(`# ${now.date}/${now.month}/${now.year} ${now.hour}:${now.min}:${now.sec} | ERROR getLiveInfo()             ` + "\r")
    }

    if(json !== null) {
        if(typeof json.data !== `undefined`
        && json.data.length == 1
        && typeof json.data[0].started_at !== `undefined`
        ) {

            // New live
            if(started !== json.data[0].started_at) {

                // Update
                started = json.data[0].started_at

                // Console
                let now = getDateHuman(new Date())
                console.log(`New LIVE : ${now.date}/${now.month}/${now.year} ${now.hour}:${now.min}:${now.sec}`)
                let name = `${user.login}..${now.year}.${now.month}.${now.date}..${now.hour}.${now.min}.${now.sec}.mp4`
                // let cmd = `streamlink --stdout https://www.twitch.tv/${user.login}/ best | ffmpeg -i - -c copy ${direc}/${name}`
                let cmd = `streamlink "--twitch-api-header=Authorization=OAuth ${twitch.OAuth}" --stdout https://www.twitch.tv/${user.login}/ best | ffmpeg -i - -c copy ${direc}/${name}`
                exec(`${cmd}`)
            }
        }
    } else {
        process.stdout.write(`  ~ ${n.date}/${n.month}/${n.year} ${n.hour}:${n.min}:${n.sec} (error)                       ` + "\r")
        await sleep(5000)
    }

    // Loop
    await sleep(999)
    loop()
}

function fatalError(text) {
    console.log(`+-----------------------------`)
    console.log(`| ERROR : ${text}`)
    console.log(`+-----------------------------`)
    process.exit(1)
}

function sleep(ms) { return new Promise((resolve) => { setTimeout(resolve, ms) }) }

function getDateHuman(obj) {
    let d = obj
    let hour = d.getHours(); if(hour < 10){hour = `0${hour}`}
    let min = d.getMinutes(); if(min < 10){min = `0${min}`}
    let sec = d.getSeconds(); if(sec < 10){sec = `0${sec}`}
    let date = d.getDate(); if(date < 10){date = `0${date}`}
    let month = d.getMonth() + 1; if(month< 10){month = `0${month}`}
    let year = d.getFullYear()
    return {
        hour: `${hour}`,
        min: `${min}`,
        sec: `${sec}`,
        date: `${date}`,
        month: `${month}`,
        year: `${year}`
    }
}

async function main() {

    // Start
    let start = getDateHuman(scriptStartedAt)
    console.log(`Started : ${start.date}/${start.month}/${start.year} ${start.hour}:${start.min}:${start.sec}`)

    // Check directory
    if(!Fs.existsSync(direc)) { fatalError(`Directory not found [ main() ]`) }

    // Read channel name
    await readParameters()

    // get User ID from twitch API
    await getUserInfo()

    console.log(`________________________________________________________________________________`)

    // main loop
    loop()

}; main()
