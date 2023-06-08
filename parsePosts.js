const fs = require("fs")
const path = require("path")
const showdown = require("showdown")

require("dotenv").config()

const converter = new showdown.Converter()

const postDir = process.env.POSTDIR
const parsedDir = process.env.PARSEDDIR

module.exports = function() {
    fs.rmSync(parsedDir, { recursive: true, force: true }, err => {
        if(err) console.error(err)
    })
    fs.mkdir(parsedDir, {recursive: true}, err => {
        if(err) console.error(err)
    })
    fs.mkdir(postDir, {recursive: true}, err => {
        if(err) console.error(err)
    })

    fs.readdir(postDir, (err, files) => {
        if(err) {
            console.error(err)
        } else {
            files.forEach(file => {
                fs.readFile(`${postDir}/${file}`, "utf-8", (err, data) => {
                    if(err) {
                        console.error(err)
                    } else {
                        const html = converter.makeHtml(data)
                        let newFileName = path.parse(file).name
                        fs.writeFile(`${parsedDir}/${newFileName}.html`, html, err => {
                            if(err) {
                                console.error(err)
                            }
                        })
                    }
                })
            })
        }
    })
}
