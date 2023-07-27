function parseLyrics(code) {
    target = `JSON.parse('\\"`;
    endTarget = `<iframe`;
    start = code.indexOf(target) + target.length;
    end = code.indexOf(endTarget)

    return code.slice(start, end);
}

function loadLyricsPage(lyrics, song_ftitle, song_art, song_artists, song_title) {
    window.location.href = "lyricsPage.html";
    const html = `<p>${song_ftitle}</p><div style="padding-bottom: 25px"></div>` + lyrics + `<button id="back" style="margin-top: 5px;">Go back</button>`;
    document.write(html);
    document.scrollingElement.scrollTop = 0;
    
    const body = document.body;
    const lines = document.querySelectorAll("p, a");
    lines.forEach((line) => {
        line.style["background-color"] = "whitesmoke";
        line.style["display"] = "inline";
    });

    const footer_div = document.getElementsByClassName("song_title");
    footer_div[0].remove();

    const footer = document.getElementsByClassName("rg_embed_footer");
    footer[0].style["padding-top"] = "25px";
    
    const footer_link = footer[0].querySelector("a");
    footer_link.textContent = song_title + ", " + song_artists;

    body.style["font-size"] = "medium";
    body.style["background-color"] = "#0f202a";
    body.style["background-image"] = `url(${song_art})`;
    body.style["background-attachment"] = "fixed";
    body.style.opacity = 0.9;
    
    const backBtn = document.getElementById("back");
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = "popup.html";
            localStorage.clear();
            localStorage.scrollTop = 0;
            document.scrollingElement.scrollTop = localStorage.scrollTop;
        });
    }
    addEventListener('scroll', () => {
        localStorage.scrollTop = document.scrollingElement.scrollTop;
    });
    document.addEventListener('click', link => {
        const a = link.target.closest('a[href]');
        if (a) {
          link.preventDefault();
          chrome.tabs.create({url: a.href, active: false});
        }
    });
}

function fetchLyrics(song_id) {
    return fetch(`https://genius.com/songs/${song_id}/embed.js`).then(r => r.text()).then(result => {
        const htmlString = parseLyrics(result);

        const lyrics = htmlString.replace(/\\n|\\/g, "");
        // console.log(lyrics);
        return lyrics;
    });
}

async function loadStorage() {
    if (localStorage.getItem("song_id")) {
        const song_id = localStorage.getItem("song_id");
        const song_ftitle = localStorage.getItem("song_ftitle");
        const song_art = localStorage.getItem("song_art");
        const song_artists = localStorage.getItem("song_artists");
        const song_title = localStorage.getItem("song_title");

        const lyrics = await fetchLyrics(song_id);

        loadLyricsPage(lyrics, song_ftitle, song_art, song_artists, song_title);
        document.scrollingElement.scrollTop = localStorage.scrollTop;
    }
}


if (typeof window !== "undefined") {
    window.onload = () => {
        loadStorage();
        const searchBtn = document.getElementById('search');
        if (searchBtn) {
            const search_input = document.getElementById('searchterm');
            search_input.addEventListener('keypress', (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    searchBtn.click();
                }
            })
            searchBtn.addEventListener('click', () => {
                const loader = document.querySelector(".loading");
                loader.style.visibility = "visible";
                const search_term = encodeURIComponent(document.getElementById('searchterm').value);
                fetch("https://lyricsfinder-api.onrender.com/api_req", {
                    headers: {
                        search_term: search_term,
                    }
                }).then(r => r.json()).then(async res => {
                    if (res.message) {
                        throw Error(res.message);
                    }
                    
                    const song_id = res.song_id;
                    const song_ftitle = res.song_ftitle;
                    const song_art = res.song_art;
                    const song_artists = res.song_artists;
                    const song_title = res.song_title;

                    localStorage.setItem("song_id", song_id);
                    localStorage.setItem("song_ftitle", song_ftitle);
                    localStorage.setItem("song_art", song_art);
                    localStorage.setItem("song_artists", song_artists);
                    localStorage.setItem("song_title", song_title);
                    
                    const lyrics = await fetchLyrics(song_id);

                    loadLyricsPage(lyrics, song_ftitle, song_art, song_artists, song_title);
                }).catch((err) => {
                    loader.style.visibility = "hidden";
                    const errmsg = document.createTextNode(`${err.message}`);
                    const errDiv = document.getElementById("err");
                    errDiv.innerText = errmsg.textContent;
                });
            });
        }
    }   
}
