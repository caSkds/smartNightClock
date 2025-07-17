//HTML Elements
const time  = document.getElementById("Time");
const currentDate = document.getElementById("Date");
const expandedDate = document.getElementById("dateExpanded");
const progressBar = document.getElementById("progressBar");

//Date values
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//APIs
let quote;
let author;


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


const api_url ="https://quotes.rest/qod";

async function getapi(url)
{
  const response = await fetch(url);
  var data = await response.json();
  console.log(data);
}

getapi(api_url);


setInterval(updateTime, 1000);

