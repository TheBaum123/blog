const postListWrapper = document.getElementById("post-listing")
const postContainer = document.getElementById("post-container")
const postListHeading = document.getElementById("post-listing-heading")
const theBaumsBlogHeading = document.getElementById("the-baums-blog-heading")

const backendApiURL = "https://blog-0i4x.onrender.com/"

let posts = []

const postListRequest = new XMLHttpRequest()
postListRequest.open("GET", `${backendApiURL}api`)
postListRequest.send()
postListRequest.responseType = "json"
postListRequest.addEventListener("load", () => {
    if(postListRequest.status == 200) {
        posts = postListRequest.response
        loadPosts()
    } else {
        postListWrapper.innerHTML = `<li>Error ${postListRequest.status}</li>`
    }
})

theBaumsBlogHeading.addEventListener("click", loadPosts)

function loadPosts() {
    postListWrapper.style.display = "block"
    postListHeading.style.display = "block"
    postContainer.style.display = "none"
    postListWrapper.innerHTML = ""
    posts.forEach(post => {
        const newLink = document.createElement("li")
        newLink.innerHTML = `<button>${post.cleanName}</button>`
        newLink.id = post.fullName
        postListWrapper.appendChild(newLink)
        document.getElementById(post.fullName).addEventListener("click", e => {
            openPost(post.fullName)
        })
    })
}


function openPost(post) {
    postListWrapper.style.display = "none"
    postListHeading.style.display = "none"
    postContainer.style.display = "flex"
    const postContentRequest = new XMLHttpRequest()
    postContentRequest.open("GET", `${backendApiURL}api/?post=${post}`)
    postContentRequest.send()
    postContentRequest.responseType = "text"
    postContentRequest.addEventListener("load", () => {
        if(postContentRequest.status == 200) {
            postContainer.innerHTML = postContentRequest.response
        } else {
            postContainer.innerHTML = `<h3>Error ${postContentRequest.status}</h3>`
        }
    })
}


function copy(text) {
    navigator.clipboard.writeText(text)
    const message = document.createElement("div")
    message.innerText = `copy "${text.slice(0, 10)}..." to clipboard`
    message.classList.add("copy-message")
    document.body.appendChild(message)
    setTimeout(() => {
        document.body.removeChild(message)
    }, 2500);
}

document.querySelectorAll("code").forEach(elem => {
    elem.addEventListener("click", e => {
        copy(elem.innerText)
    })
})
