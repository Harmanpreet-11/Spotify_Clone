console.log('Lets write Javascript');
let currentSong = new Audio();


function secondsToMinutesSecond(seconds){
    if(isNaN(seconds) || seconds <0){
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs() {
    
let a = await fetch("http://127.0.0.1:5500/spotify-Clone/songs/")
let response = await a.text();
let div = document.createElement("div")
div.innerHTML = response;
let as = div.getElementsByTagName("a")
let songs = []
for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
    let parts = element.href.split("http://127.0.0.1:5500/spotify-Clone/songs/");
    songs.push(parts[1]);
}
}
return songs
}

 const playMusic = (track, pause=true) => {
    currentSong.src = (`/spotify-Clone/songs/${track}`)
    if(!pause){
        currentSong.play();
        play.src = "images/pause.svg"

    }
    let title = decodeURIComponent(track).replace(".mp3", "");
    document.querySelector(".song-info").innerHTML = title;
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00"
};

async function main() {
    let play = document.getElementById("play"); // Moved to top

    let songs = await getSongs();

    let songUl = document.querySelector(".song-list").getElementsByTagName("ul")[0];
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

    // Auto-play the first song
    if (songs.length > 0) {
        playMusic(songs[0]);
    }

    // Attach event listeners to each song
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const track = e.getAttribute("data-song");
            console.log("Playing:", track);
            playMusic(track);
        });
    });

    // Play/pause button logic
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.svg";
        } else {
            currentSong.pause();
            play.src = "images/play.svg";
        }
    });

    // Update time while playing
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML =
            `${secondsToMinutesSecond(currentSong.currentTime)}/${secondsToMinutesSecond(currentSong.duration)}`;
            document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)* 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click" , e => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent +"%";
        currentSong.currentTime = ((currentSong.duration) * percent )/100
        
    });

    // Toggle sidebar open on hamburger click
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
});

// Toggle sidebar close on 'x' button click
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
});
s
}


main();



