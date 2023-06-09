# The first ever post on this blog
This post is meant as more of a test then an actual blog post, but i will use it to tell you about how i made this blog a bit.

### How the idea for this blog came up
Originally, I was sitting in school, when I thought to myself "wouldn't it be nice if you had a blog to get a few thoughts that are not coding related" so I jumped right into it and made a first prototype.

### The first prototype
Since this project has been going for a while now, when I first started it, I was fairly new to node.js and didnt really know anything about the available modules appart from express.js. So naturally, the first thing i did was writing some sort of api in a very simple way just to be able to list and get posts. In the progress, I also started learning about the fs module and my first prototype looked a bit like this:
```
app.get("/", (req, res) => {
    fs.readFile(`${parsedDir}/${req.query.post}.html`, "utf8", (err, data) => {
        if(err) {
            res.send(`<h1 style="font-family: "monospace"">error:</h1><style="font-family: "monospace"">${err}</style=>`)
        } else {
            res.send(data)
        }
    })
})
```
It worked by getting the users requested post from the `req.query.post` object and sending the corrosponding html file to the user.

### How would i continue?
Next, I wanted to write my posts in markdown insted of html, which is why I started using fs to read all markdown files from my posts directory, and trying to make a markdown -> html converter on my own to convert all of the files. I quickly realised, that this wasn't going to be easy and I abandoned the project for a few weeks.

### Picking it back up
Yesterday on the eighth of June 2023 I remembered this project and found out, that there is a node module called "showdown", which lets you convert markdown to html easily, so i started this project again. My first idea was to read the markdown files and send a version of them, that was converted to html back to the client on every request. I quickly realised, that this probably wouldn't scale very well. My new approach was to just convert all markdown files to html and save them, so I did using this snippet:
```
const converter = new showdown.Converter()

fs.readdir(postDir, (err, files) => {
        files.forEach(file => {
            fs.readFile(`${postDir}/${file}`, "utf-8", (err, data) => {
                const html = converter.makeHtml(data)
                let newFileName = path.parse(file).name
                fs.writeFile(`${parsedDir}/${newFileName}.html`, html)
            })
        })
    })
```
It reads all files from the posts directory when its called and saves them in the parsed directory as parsed html files. Now whenever the user wants to view a post, the server only has to read a html file and doesnt have to convert the files again. This will scale a bit better.

#### Optimization ideas
I could make the server a bit faster, by saving the converted files in memory insted of saving and reading from the drive, my budget of 0$ makes that pretty much impossible though, as I only have 512mb of RAM available, which I need to answer requests. So for now, this is most likeley the fastest and best solution for my situation.

#### Flaws
Sorting the posts is currently done manually by adding the suffix -----id to a post, where the posts with the highest id will be shown first, but I might make a post on how and why its done this way in the future. For now it is the easyest option.

# Conclusion
Writing your own blog is a nice way to learn how to use node.js, the fs module or other things. It's not the most complicated things, but it will teach you the basics. If you are really up for a challenge, you could try making your own markdown parser, even though I wouldn't try this as a beginner. I myself might try to transition to a custom markdown parser some time in the future, but for now "showdown" seems to be the best way to go. A blog is really easy to make complicated for your self, but it can also be as simple as this one, where the backend for now only consists of 120 lines of code.

---
Thanks a lot if you made it this far and have a great day.

Kind regards,

TheBaum