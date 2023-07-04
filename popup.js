function parseLyrics(code) {
    target = `JSON.parse('\\"`;
    endTarget = `<iframe`;
    start = code.indexOf(target) + target.length;
    end = code.indexOf(endTarget)
    return code.slice(start, end);
}

if (typeof window !== "undefined") {
    
    // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    //     let url = tabs[0].url;
    //     console.log(url);
    // });
    const api_key = "YSGqbhtU5A2jQFDfi1a1CttugMy00R_dp1Q1J3ZkqXuuxEZ3coXZ2tjX2nprgv4p"

    window.onload = () =>{        
        var searchBtn = document.getElementById('search');
        searchBtn.addEventListener('click', () => {
            const search_term = document.getElementById('searchterm').value;
            
            fetch(`https://api.genius.com/search?q=${search_term}&access_token=${api_key}`).then(r => r.json()).then(result => {
                const top_hit = result["response"]["hits"][0].result;
                // console.log(top_hit);

                const song_id = top_hit.id;
                // console.log(song_id);

                const song_ftitle = top_hit.full_title;
                const song_art = top_hit.song_art_image_url;
                const song_artists = top_hit.primary_artist.name;
                const song_title = top_hit.title;

                fetch(`https://genius.com/songs/${song_id}/embed.js`).then(r => r.text()).then(result => {
                    const htmlString = parseLyrics(result);
    
                    const lyrics = htmlString.replace(/\\n|\\/g, "");
                    // console.log(lyrics);
                    const html = `<p>${song_ftitle}</p><div style="padding-bottom: 25px"></div>` + lyrics
                    document.write(html);
                    
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
                    body.style["background-image"] = `url(${song_art})`;
                    body.style["background-attachment"] = "fixed";
                    body.style.opacity = 0.8;                     
                });
            });
        });
    }
}