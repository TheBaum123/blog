const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()

let postsListed = []

compilePosts()

function compilePosts() {
    fs.readdir("./posts", (err, files) => {
        files.forEach((file) => {
            fs.readFile(`./posts/${file}`, "utf8", (err, data) => {
                let compiled = data.replace("###", "<h3>")
                compiled = compiled.replace("/###", "</h3>")
                compiled = compiled.replace("#", "<h1>")
                compiled = compiled.replace("/#", "</h1>")
                compiled = compiled.replace(/\[.+/g, "<img src=\"")
                compiled = compiled.replace(/.+\]/g, "\">")
                compiled = compiled.replace("---", "<hr>")
                compiled = compiled.replace(/\n/g, '<br>')
                compiled = compiled.replace("\`", "<code>")
                compiled = compiled.replace("/\`", "</code>")
                fs.writeFile(`./compiled_posts/${file}`, compiled, (err) => {
                    if(err) {
                        console.log(err)
                    }
                })
            })
        })
    })
    reloadPosts()
}

function reloadPosts() {
    fs.readdir("./compiled_posts", (err, files) => {
        postsListed = files
    })
}

reloadPosts()

app.get("*", (req, res) => {
    if(postsListed.includes(req.query.post)) {
        reloadPosts()
        fs.readFile(`./compiled_posts/${req.query.post}`, "utf8", (err, data) => {
            res.send(data)
        })
    } else {
        reloadPosts()
        res.json(postsListed).send
    }
})

app.listen(3000)