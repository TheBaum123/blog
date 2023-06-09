const express = require("express")
const parseMd = require("./parsePosts")
const fs = require("fs")
const path = require("path")

require("dotenv").config()

const parsedDir = process.env.PARSEDDIR

parseMd()

let postsListed = []
let cleanListedPosts = []

const app = express()

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

app.get("/api", (req, res) => {
    reloadPosts()
    if(postsListed.includes(`${req.query.post}.html`)) {
        fs.readFile(`${parsedDir}/${req.query.post}.html`, "utf8", (err, data) => {
            if(err) {
                res.send(`<h1 style="font-family: "monospace"">error</h1>`)
            } else {
                res.send(data)
            }
        })
    } else {
        res.json(cleanListedPosts).send
    }
})

app.use(express.static("public"))

app.listen(3000)

setTimeout(() => {
    reloadPosts()
}, 1000);