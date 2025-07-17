//HTML Elements
const time  = document.getElementById("Time");
const currentDate = document.getElementById("Date");
const expandedDate = document.getElementById("dateExpanded");
const progressBar = document.getElementById("progressBar");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const body = document.body;
    //Weather elements
const zamoraWeatherIcon = document.getElementById("zamoraIcon");
const zamoraTime = document.getElementById("zamoraTime");
const guadalajaraWeatherIcon = document.getElementById("guadalajaraIcon");
const guadalajaraTime = document.getElementById("guadalajaraTime");




//Date values
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//APIs
let quote;
let author;
const api_url ="https://api.quotable.io/random";
zamoraURL = "http://api.weatherapi.com/v1/current.json?key=4dd9dc5d1414467ab0034643251707&q=Zamora&aqi=no";
guadalajaraURL = "http://api.weatherapi.com/v1/current.json?key=4dd9dc5d1414467ab0034643251707&q=Guadalajara&aqi=no";

//program specific variables
dimmed = false;

function updateExpandedDate(){
    /*
    Returns an array with the remaining days of the year and days in the year
    [currentDays, daysInYear]
      */
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    let isLeap = false;
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        isLeap = true;
    }
    if (isLeap){
        daysInMonth[1] = 29; // February has 29 days in a leap year
    }
    
    let daysInYear = isLeap ? 366 : 365;
    let currentDays = date.getDate();
    for(let i= 0; i< month; i++){
        currentDays+= daysInMonth[i];
    }

    return [currentDays, daysInYear];

    
}

function updateTime(){
    console.log(currentDate.textContent);
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const weekDay = weekDays[date.getDay()];
    const day = date.getDate().toString();
    const month = months[date.getMonth()];   
    let expandedTime = [0,1]
    expandedTime = updateExpandedDate();
    const currDays = expandedTime[0];
    const yearDays = expandedTime[1];

    expandedDate.textContent = `Day ${currDays} of ${yearDays} Days left: ${yearDays - currDays}`;
    time.textContent = `${hours}:${minutes}:${seconds}`;
    currentDate.textContent = `${weekDay}, ${month} ${day}`;
    progressBar.style.width = `${(currDays / yearDays) * 100}%`;
    
    
    
}




async function getapi(url){
    const response = await fetch(url);
    var data = await response.json();
    quote = data.content;
    author = data.author;
}


async function updateQuote() {
    await getapi(api_url);
    quoteText.textContent = `"${quote}"`;
    quoteAuthor.textContent = `- ${author}`;
   
}

async function getWeather(url){
    const response = await fetch(url);
    const data = await response.json();
    const temp = data.current.temp_c;
    const icon = data.current.condition.icon;
    const iconURL = `https:${icon}`; // Weather API returns icons with a leading https://
    console.log(iconURL)
    return [temp, iconURL];

}

async function updateTemp(){
    const zamoraWeather = await getWeather(zamoraURL);
    const guadalajaraWeather = await getWeather(guadalajaraURL);
    
    zamoraTime.textContent = `${zamoraWeather[0]}°C Zam`;
    guadalajaraTime.textContent = `${guadalajaraWeather[0]}°C Gdl`;
    
    zamoraWeatherIcon.src = `${zamoraWeather[1]}`;
    guadalajaraWeatherIcon.src = `${guadalajaraWeather[1]}`;

}

function dimElements(dimFactor){
    body.style.filter = `brightness(${dimFactor}%)`;
    body.style.transition = "filter 0.5s ease-in-out";
}

function resetDimElements(){
    body.style.filter = "brightness(100%)";
    body.style.transition = "filter 0.5s ease-in-out";
    dimmed = false
}

function turnOffElements(){
    dimElements(0);
}

function nightDim(){
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 20 || hours < 6  ) { // Between 8 PM and 6 AM
        if (!dimmed) { // If already dimmed, do nothing
        function dogShit(
        ){console.log("Dimming elements...");}
        setTimeout(dogShit, 3000); // Prevents the function from being called immediately
        setTimeout(dimElements(50),3000);
        setTimeout(turnOffElements, 3000); // Dim for 5 seconds
        dimmed = true;
    }
    } 
    else {
        resetDimElements();
        dimmed = false;
    }
}

body.addEventListener("click",resetDimElements)

updateQuote();
updateTemp();
setInterval(updateTime, 1000);
nightDim();

setInterval(updateQuote, 86400000); // Update quote every 24 hours
setInterval(updateTemp, 60000); // Update weather every minute
setInterval(nightDim, 90000); // Check for night dimming every minute
