let timerElement = document.querySelector('#timer');
let startButton = document.querySelector('#startBtn');
let pauseButton = document.querySelector('#pauseBtn');
let aDayChoice = document.querySelector("#aDayChoice");
let video = document.querySelector("#video");

let localStorageObject = {};
let whichDay = 0
const routineDuration = 60;
let currentRoutine = 0;
let currentBodyRegion = 0;
let isPaused = false;
let isMuted = false;
let intervalId = 0;
let done = false;
var routineObject = {}
let routineList = [];
let routineListNumber = 0;

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

const loadRoutineObject = () => {
    routineObject = JSON.parse(Get("../exercises/Beginner.json"));
    console.log("JSON obj loaded: ");
}

const populateRoutineList = () => {
    for (let i = 0; i <=routineObject.Beginner[whichDay].length - 1; i++){
        for (let j = 0; j <= routineObject.Beginner[whichDay][i].length - 1; j++){
            routineList.push(routineObject.Beginner[whichDay][i][j])
        }
    }
   console.log(`RoutineList populated with ${routineList.length} exercises for Day: ${whichDay === 0 ? "A" : "B"}`);
}

const getLocalStorage = () => {
    localStorageObject = JSON.parse(localStorage.getItem('neonHomeWorkout'));
    
    if (localStorageObject){
        console.log("localStorage object loaded")
    }
}
const createLocalStorageObject = () => {
    let currentDate = new Date().toDateString();
    let lastCompletedDayA = aDayChoice.checked;
    let howManyVictories = localStorageObject != null ? localStorageObject.howManyVictories++ : 1
    return {currentDate, lastCompletedDayA, howManyVictories}
}

const setLocalStorage = (neonWorkoutObj) => {
    localStorage.removeItem("neonHomeWorkout");
    localStorage.setItem('neonHomeWorkout', `${JSON.stringify(neonWorkoutObj)}`);
}

const updatePlaylist = () => {
    const prev = document.querySelector('#previousExercise');
    const curr = document.querySelector('#currentExercise');
    const next = document.querySelector('#nextExercise');

    if (routineListNumber > 0){
        prev.innerHTML = `${routineList[routineListNumber - 1].name}`;
    }    
    curr.innerHTML = `${routineList[routineListNumber].name}`;
    next.innerHTML = routineList[routineListNumber + 1].name;
}

const workoutDone = () => {
    let newLocalStorageObject = createLocalStorageObject();
    try {
        setLocalStorage(newLocalStorageObject);
      } catch (error) {
        console.error(error);
      }
    
    soundGameTrophy();

}
const getWhichDay = () => {    
    aDayChoice.checked ? whichDay = 0 : whichDay = 1
    return whichDay
}


// let pauseTime = pduration, pminutes, pseconds;
const togglePlayPause = () => {
    if (startButton.classList.contains('hidden')){
        startButton.classList.remove('hidden');
        pauseButton.classList.add('hidden');
    }
    else{
        startButton.classList.add('hidden');
        pauseButton.classList.remove('hidden');
    }  
}
const changeRoutineTitle = () => {
    let nameElement = document.querySelector("#routineName")
    nameElement.innerText = `Exercise: ${routineObject.Beginner[whichDay][currentBodyRegion][currentRoutine].name}`
}
const changeRoutineType = () => {
    let typeElement = document.querySelector("#routineType")
    typeElement.innerText = `Exercise Region: ${routineObject.Beginner[whichDay][currentBodyRegion][currentRoutine].type}`
}

const changeDisplay = () => {
    video.pause();
    if (document.contains(document.querySelector("#videoSource"))) {
        document.querySelector("#videoSource").setAttribute('src', `${routineObject.Beginner[whichDay][currentBodyRegion][currentRoutine].videoLink}`);
        video.load();
    }
    else{
        let newVideoSource = document.createElement('source')
        newVideoSource.setAttribute('id', 'videoSource')
        newVideoSource.setAttribute('src', `${routineObject.Beginner[whichDay][currentBodyRegion][currentRoutine].videoLink}`);
        video.appendChild(newVideoSource);
    }   
    
    video.play();
    console.log({
        src: document.querySelector("#videoSource").getAttribute('src'),
        type: document.querySelector("#videoSource").getAttribute('type'),
      });

    // Change infoSection
    changeRoutineTitle();      
    changeRoutineType();
    updatePlaylist();

      // Check if there if I can increment to the next routine
      if ((currentBodyRegion === routineObject.Beginner[whichDay].length - 1) && currentRoutine === routineObject.Beginner[whichDay][currentBodyRegion].length - 1){
        //done
        done = true;
        workoutDone()
        console.log("Exercise finished")
      }
      else if (currentRoutine === routineObject.Beginner[whichDay][currentBodyRegion].length - 1){
        currentBodyRegion++;
        currentRoutine = 0;
      }
      else {
        currentRoutine++
      }

      routineListNumber++;

}
function soundGameOverSound(){
    let audio = new Audio('../sounds/mixkit-arcade-retro-game-over-213.wav');
    audio.play();
}

function soundGameTrophy(){
    let audio = new Audio("../sounds/mixkit-magic-sweep-game-trophy-257.wav");
    audio.play();
}

function beep() {
    let snd = new  Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}
function soundStartTheRace() {
    let snd = new  Audio("../sounds/mixkit-arcade-race-game-countdown-1952.wav");  
    snd.play();
}

const startTimer = (duration, display) => {
    isPaused = false;
    // Toggle the play and pause button hidden class
    togglePlayPause();
    let timer = duration, minutes, seconds;
    changeDisplay();
    intervalId = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = `${minutes} : ${seconds}`;

        if (isPaused === false && timer - 1 < 0 && done == true) {
            clearInterval(intervalId);
        }
        else if (isPaused === false && --timer < 0) {
            
            soundStartTheRace()
            changeDisplay();
            timer = duration;
        }

    }, 1000);
}
const startRoutine = () => {
    if (document.querySelector("#videoSource") != null && video.paused == true){
        isPaused = false;
        video.play();
        togglePlayPause();
    }
    else{
        getWhichDay();
        try {
            populateRoutineList();
        } catch (error) {
            console.error(error);
          }
        startTimer(routineDuration, timerElement);
    }
    
}

const pauseRoutine = () => {
    isPaused = true;
    video.pause();
    
    togglePlayPause();
}

// After website loads
window.onload = function() {
    try {
        loadRoutineObject();
      } catch (error) {
        console.error(error);
      }
    
    
    
    try {
        getLocalStorage();
      } catch (error) {
        console.error(error);
      }
};

// Event listeners

startButton.addEventListener('click', startRoutine);
pauseButton.addEventListener('click', pauseRoutine);
