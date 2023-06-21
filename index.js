// fetching 
const userTab =document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

// what variable we need??
let currentTab = userTab;
const API_KEY ="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

//ek kaam aur pending hai


function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

     if(!searchForm.classList.add("active")){
    //search tab wala agar visible nahi hai toh usko visible karna hoga
       userInfoContainer.classList.remove("active");
       grantAccessContainer.classList.remove("active");
       searchForm.classList.add("active");
}
else{
    //phela main search wale pe tha ab merko your weather wala visiblee karna hai//
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    //agar your weather section visible hai toh tum weather information share karo
    // so check karo local storage kya co-ordinates saved hai ki nahi
    getfromSessionStorage();
}
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});
//checked karega ki present hai ki nahi
function getfromSessionStorage(){
   const localCoordinates = sessionStorage.getItem("user-coordinates");
   if(!localCoordinates){
    //agar localCoordinates nahi mila toh
    grantAccessContainer.classList.add("active");
   }
   else{
     const coordinates =JSON.parse(coordinates);
     fetchUserWeatherInfo(coordinates);
   }
}

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon} =coordinates;
    //make grant-acess invisible//
    grantAccessContainer.classList.remove("active");
    ///make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try{
       const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
       const data = await response.json(); 
       loadingScreen.classList.remove("active");
       userInfoContainer.classList.remove("active");
       renderWeatherInfo(data);
    }
    catch(err){
        // ??
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
     const cityName =document.querySelector("[data-cityName]");
     const countryIcon =document.querySelector("[data-countryIcon]");
     const des =document.querySelector("[data-weatherDesc]");
     const weatherIcon =document.querySelector("[data-WeatherIcon]");
     const temp =document.querySelector("[data-temp]");
     const windspeed =document.querySelector("[data-windspeed]");
     const humidity =document.querySelector("[data-humidity]");
     const cloudiness =document.querySelector("[data-cloudiness]");


     //fetch value from weatherInfo 
     cityName.innerText = weatherInfo?.name;
     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
     des.innerText = weatherInfo?.weather?.[0]?.description;
     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
     temp.innerText = weatherInfo?.main?.temp;
     windspeed.innerText = weatherInfo?.wind?.speed;
     humidity.innerText = weatherInfo?.main?.humidity;
     cloudiness.innerText = weatherInfo?.clouds?.all;

    }


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //hw -show an alert function
    }
}
  function showPosition(position){

    const userCoordinates ={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

  }
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput =document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return;
    }
    else 
      fetchSearchWeatherInfo(cityName);
})
async function  fetchSearchWeatherInfo(city){
    userInfoContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");
    try{
         const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
         );
         const data = await response.json();
         loadingScreen.classList.remove("active");
         userInfoContainer.classList.add("active");
         renderWeatherInfo(data);
    }
    catch(err){
    //hw
    }
}