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

                fetch(`https://genius.com/songs/${song_id}/embed.js`).then(r => r.text()).then(result => {
                    document.write(result);
                })
                
            })
        })
    }

    


   
}