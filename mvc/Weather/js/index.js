// fetch the data from https://ipinfo.io

function fe(){
  const getLocByIp = () => {
   $.getJSON('https://ipinfo.io' , (data ) => {
    make_link(data.city)
   })
  }
 
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((pos) => {
     make_link(`${pos.coords.latitude},${pos.coords.longitude}`)
    }, getLocByIp)
   }
     
  }
const hr = new Date().getHours();
//získá hodiny denně ve formátu 24 (0-24)




function make_link(loc){

// získá odkaz s proměnnými
const link = `https://api.apixu.com/v1/current
.json?key=9271121b5c3d4c36ad322336172809&q=${loc}`
 $.getJSON(link , 
   function (data) {
     $('.container').show()
         $('.error').css('display' , 'none')
     

    updateUI(data)
 }).fail(function() { 
    $('.container').hide()
    $('.error').css('display' , 'block')
    document.querySelector('.container').classList.remove('load')
 })
  }

//získá data z api
function updateUI({location , current , }){
 let unitToggle = 1
 const name = location.name
 const country = location.country
 const time= location.localtime.split(' ')[1].split(':')[0]
 
if( time >= 6 &&  time <= 12){
  var d = document.querySelector('.day')
  d.innerText = 'Morning'
  }
else if( time > 12 &&  time <= 18){
  var d = document.querySelector('.day')
  d.innerText = 'Day'
  }
 else if( time > 18 &&  time < 22){
  var d = document.querySelector('.day')
  d.innerText = 'Evening'
  }
else{
   var d = document.querySelector('.day')
   d.innerText = 'Night'
 }

 
 document.querySelector('.location').innerText = name + ', '+ country
 
 const weather_c = current.temp_c
 const weather_f = current.temp_f
  document.querySelector('.celsius').innerText = weather_c + '°' + ' C'
 
 const cond = current.condition.text
 const win = current.wind_mph
 const hum = current.humidity
 
 document.querySelector('.moisture').innerText = cond
 document.querySelector('.c').innerText = win + 'mph'
 document.querySelector('.h').innerText = hum+ '%'
 
 const img = current.condition.icon
 document.querySelector('.cat').src = 'http:/' + img
 document.querySelector('.container').classList.remove('load')
 
 // changing celsius into franhiet
 $('.celsius').click(function(){
  if (unitToggle) {
   document.querySelector('.celsius').innerText = weather_f + '°' + ' F'
   unitToggle = 0
  } else {
    document.querySelector('.celsius').innerText = weather_c + '°' + ' C'
    unitToggle = 1
  }
 })
  

 
}
// zavoláme si hlavní funkci
fe()

document.querySelector('#search')
 .addEventListener('submit', (e) => {
   e.preventDefault()
  document.querySelector('.container').classList.add('load')
  const searchText = e.target[0].value
  if(searchText === ''){
   fe()
  } else {
   make_link(searchText)  
  }
 
})