const fs = require("fs")
const { parse } = require("path")

require("dotenv").config()

const postDir = process.env.POSTDIR
const parsedDir = process.env.PARSEDDIR

const h1 = /^#{1}(?!#).*$/
const h2 = /^#{2}(?!#).*$/
const h3 = /^#{3}(?!#).*$/
const h4 = /^#{4}(?!#).*$/
const h5 = /^#{5}(?!#).*$/

module.exports = function() {
    fs.mkdir(parsedDir, {recursive: true}, err => {
        console.error(err)
    })
    fs.readdir(postDir, (err, files) => {
        files.forEach(file => {
            fs.readFile(`${postDir}/${file}`, "utf-8", (err, data) => {
                if(err) {
                    console.error(err)
                } else {
                    let output = []
                    let lines = data.split("\n")
                    lines.forEach(line => {
                        line = isHeading(line)
                        line = BIU(line)
                        output.push(line + "<br>")
                    })
                    output = output.join("")
                    fs.writeFile(`${parsedDir}/${file}`, output, writeErr => {
                        if(writeErr) {
                            console.error(writeErr)
                        }
                    })
                }
            })
        })
    })
}

function BIU(text) {
    let bold = false
    let italic = false
    let underline = false

    let output = []

    let charArr = text.split("")

    charArr.forEach(elem => {
        if(elem == "_") {
            if(underline) {
                elem = "</underline>"
            } else {
                elem = "<underline style=\"text-decoration: underline\">"
            }
            underline = !underline
        }
        if(elem == "*") {
            if(italic) {
                elem = "</italic>"
            } else {
                elem = "<italic style=\"font-style: italic\">"
            }
            italic = !italic
        }

        output.push(elem)
    })

    if(bold) {
        output.push("</bold>")
    }
    if(italic) {
        output.push("</italic>")
    }
    if(underline) {
        output.push("</underline>")
    }

    output = output.join("")
    return(output)
}

function isHeading(text) {
    if(h1.test(text)) {
        text = text.replace("#", "")
        text = `<h1>${text}</h1>`
    }
    if(h2.test(text)) {
        text = text.replace("##", "")
        text = `<h2>${text}</h2>`
    }
    if(h3.test(text)) {
        text = text.replace("###", "")
        text = `<h3>${text}</h3>`
    }
    if(h4.test(text)) {
        text = text.replace("####", "")
        text = `<h4>${text}</h4>`
    }
    if(h5.test(text)) {
        text = text.replace("#####", "")
        text = `<h5>${text}</h5>`
    }
    return text
}