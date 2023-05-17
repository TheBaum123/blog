const express = require("express")
const parseMd = require("./parsePosts")
const fs = require("fs")

require("dotenv").config()

const parsedDir = process.env.PARSEDDIR


const app = express()

parseMd()

function reloadPosts() {
    fs.readdir(parsedDir, (err, files) => {
        postsListed = files
    })
}

reloadPosts()

app.get("*", (req, res) => {
    if(postsListed.includes(req.query.post)) {
        reloadPosts()
        fs.readFile(`${parsedDir}/${req.query.post}`, "utf8", (err, data) => {
            res.send(data)
        })
    } else {
        reloadPosts()
        res.json(postsListed).send
    }
})

app.listen(3000)