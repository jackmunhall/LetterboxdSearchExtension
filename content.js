// creates searchbar
let searchbar = document.createElement("input")
searchbar.className = "user-search"
searchbar.placeholder = "Search for a movie..."

// appends searchbar after tag section if it exists; if not, appends to sidebar
let place = document.querySelector('.section > .tags')
if (!place) {
    let progress = document.querySelector('.sidebar')
    progress.appendChild(searchbar)
    searchbar.style.marginTop = "0px"
} else {
    place.appendChild(searchbar)
}

// turn strings into html
let parser = new DOMParser();

// function that returns movie DOM elements given page number i
async function getDom(i) {
   let xmlhttp = new XMLHttpRequest()
   xmlhttp.open("GET", `${window.location.href}page/${i}/`, false) 
   xmlhttp.send()
   let parsed = parser.parseFromString(xmlhttp.responseText, "text/html")
   let movies = parsed.querySelectorAll('.js-list-entries > li')
   if (movies.length == 0) return undefined
   return movies
}

// "items" = movies from first page, nodelists will contain movies from all subsequent pages
let items = document.querySelectorAll('.js-list-entries > li')
nodelists = []
getAllFilms()

// pushes all movie elements to an array
async function getAllFilms() {
    for (let i = 2; i < 101; i++) {
        let filmsFromPageI = await getDom(i)
        if (!filmsFromPageI) i=2000
        else nodelists.push(filmsFromPageI)
    }
}

// list of movies on current page
var toAppend = document.querySelector('.js-list-entries')

// when the user presses enter key on the search box
searchbar.addEventListener('keypress', e => {
    if (e.key == "Enter") {
        // searches for movies on first page, removes them if don't match user search
        items.forEach(element => {
            let name = element.childNodes[1].dataset.filmName
            if (!name) {
                element.remove()
            } else {
                name = name.toLowerCase()
                if (!name.includes(e.target.value.toLowerCase())) {
                    element.remove()
                }
            }
        })
        // searches for movies on subsequent pages, adds them to current page if matches user search
        nodelists.forEach(item => {
            item.forEach(element => {
                let name = element.querySelector('div > img').alt.toLowerCase()
                if (name.includes(e.target.value.toLowerCase())) {
                    toAppend.appendChild(element)
                } 
            })
        })
    }
})