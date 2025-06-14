//JAVASCRIPT CODE 

let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSecond(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/spotify-Clone/${currFolder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let parts = element.href.split(`http://127.0.0.1:5500/spotify-Clone/${folder}/`);
            songs.push(parts[1]);
        }
    }

    let songUl = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML += `<li data-song="${song}">
            <img class="invert" src="/Spotify-Clone/images/music.svg" alt="">
            <div class="info">
                <div>${decodeURIComponent(song)}</div>
                <div> Artist </div>
            </div>
            <div class="play-now">
                <span>Play Now </span>
                <img class="invert" src="/Spotify-Clone/images/play.svg" style="width: 20px; margin-left: 4px;" alt="">
            </div>
        </li>`;
    }

    if (songs.length > 0) {
        playMusic(songs[0]);
    }

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const track = e.getAttribute("data-song");
            playMusic(track, false);
        });
    });

    return songs
}

const playMusic = (track, pause = true) => {
    currentSong.src = `/spotify-Clone/${currFolder}/${track}`;

    let title = decodeURIComponent(track).replace(".mp3", "");
    document.querySelector(".song-info").innerHTML = title;
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";

    currentSong.onloadedmetadata = () => {
        document.querySelector(".song-time").innerHTML =
            `00:00 / ${secondsToMinutesSecond(currentSong.duration)}`;
    };

    if (!pause) {
        currentSong.play();
        play.src = "images/pause.svg";
    }
};


async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/Spotify-Clone/songs`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    Array.from(anchors).forEach(e=>{
        if(e.href.startsWith("/songs")){
            console.log(e.href);
            
        }
    })
    
}
async function main() {
    let play = document.getElementById("play");

    await getSongs("songs/Satinder_Sartaaj");
    playMusic(songs[0], true)


    displayAlbums()
    

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.svg";
        } else {
            currentSong.pause();
            play.src = "images/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        if (!isNaN(currentSong.duration)) {
            document.querySelector(".song-time").innerHTML =
                `${secondsToMinutesSecond(currentSong.currentTime)} / ${secondsToMinutesSecond(currentSong.duration)}`;
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

   previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1], false);
    }
    });

next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1], false);
    }
    });
    
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100
        
    })

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item =>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })

    let isMuted = false;

    document.querySelector(".volume>img").addEventListener("click", e => {
    const img = e.target;

    if (!isMuted) {
        img.src = "images/mute.svg";
        currentSong.volume = 0;
        isMuted = true;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    } else {
        img.src = "images/volume.svg";
        currentSong.volume = 1;
        isMuted = false;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
    });
 
}

main();
