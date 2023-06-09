const express = require("express")
const parseMd = require("./parsePosts")
const fs = require("fs")
const path = require("path")
const cors = require("cors")

require("dotenv").config()

const parsedDir = process.env.PARSEDDIR || "parsed"
const port = process.env.PORT || 0

parseMd()

let postsListed = []
let cleanListedPosts = []

function reloadPosts() {
    fs.readdir(parsedDir, (err, files) => {
        postsListed = files
        cleanListedPosts = []
        files.forEach(file => {
            let cleanName = path.parse(file).name
            cleanListedPosts.push({
                "cleanName": cleanName,
                "fullName": cleanName
            })
        })
        cleanListedPosts.sort((a, b) => {
            return(b.cleanName.split("-----")[1] - a.cleanName.split("-----")[1])
        })
        let temp = []
        cleanListedPosts.forEach(postObj => {
            let newCleanName = postObj.cleanName.split("-----")[0]
            temp.push({
                "cleanName": newCleanName,
                "fullName": postObj.fullName
            })
        })
        cleanListedPosts = temp
    })
}
setTimeout(() => {
    reloadPosts()
}, 1000);

const app = express()

app.get("/api", (req, res) => {
    reloadPosts()
    if(req.query.post) {
        if(postsListed.includes(`${req.query.post}.html`)) {
            fs.readFile(`${parsedDir}/${req.query.post}.html`, "utf8", (err, data) => {
                if(err) {
                    res.send(`<h1 style="font-family: "monospace"">error:</h1><p style="font-family: "monospace"">${err}</p>`)
                } else {
                    res.send(data)
                }
            })
        } else {
            res.status(404).send(`<h1 style="font-family: "monospace"">error 404, post not found</h>`)
        }
    } else {
        res.json(cleanListedPosts).send
    }
})

app.get("/health", (req, res) => {
    res.json({healthy: true}).send
})

app.use(express.static("public"))
app.use(cors({
    origin: "*"
}))

let listener = app.listen(port, () => {
    console.log(`listening on port ${listener.address().port}`)
})
