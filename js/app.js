const URL = 'https://api.openweathermap.org/data/2.5'
const button = document.getElementById("sendButton")
const inputElement = document.getElementById("search")
const topCards = document.getElementsByClassName("top-cards")
const tituloCiudad = document.createElement("h2")

var respuestaClima = {
	ciudad: '',
	tempMax: 0,
	tempMin: 0,
	humedad: 0,
	nubes: 0,
	velocidaViento: 0,
	sensacionTermica: 0,
	presion: 0,
	latitud: 0,
	longitud: 0,
	clima: ''
}

if (localStorage.respuestaClima) {
	/* Si ya hubo una busqueda anteriormente se carga la pagina con la info del localStorage - 
	hasta que el usuario realice una nueva busqueda y ahi si llama a la API*/
	respuestaClima = JSON.parse(localStorage.respuestaClima)
	showWeatherInfo(respuestaClima)
}

button.addEventListener('click', () => {
	searchClima(inputElement.value);
})

//Fetch a la API de OpenWeather consultando por current y utilizando las metricas locales
function searchClima(wordToSearch) {
	const fecthPromise = fetch(`${URL}/weather?q=${wordToSearch}&appid=${API_KEY}&units=metric`);

	fecthPromise.then(response => {
		return response.json();
	}).then(result => {
		storeWeatherInfo(result)
		showWeatherInfo(respuestaClima)
	}).catch(err => {
		alert('La ciudad buscada no existe, ingresa otra!!')
	});
}

//funcion que solo se encarga de guardar la info recibida de la API de OpenWeather
function storeWeatherInfo(data) {
	respuestaClima.ciudad = data.name
	respuestaClima.tempMax = parseInt(data.main.temp_max)	
	respuestaClima.tempMin = parseInt(data.main.temp_min)
	respuestaClima.humedad = data.main.humidity
	respuestaClima.velocidaViento = data.wind.speed
	respuestaClima.sensacionTermica = parseInt(data.main.feels_like)
	respuestaClima.presion = data.main.pressure
	respuestaClima.nubes = data.clouds.all
	respuestaClima.clima = data.weather[0].main
	respuestaClima.latitud = data.coord.lat
	respuestaClima.longitud = data.coord.lon
//creo un objet en local storage para almacenar el resultado de la ultima busqueda
	localStorage.respuestaClima = JSON.stringify(respuestaClima);
}

//cargo los elementos al html
//TODO: Realizar la carga dinamica si sobra tiempo acá
function showWeatherInfo(data) {
	let tituloCiudad = document.getElementById("ciudadtitulo")
	tituloCiudad.textContent = data.ciudad

	let tempMax = document.getElementById("tempmax")
	tempMax.textContent = data.tempMax

	let tempMin = document.getElementById("tempmin")
	tempMin.textContent = data.tempMin

	let humedad = document.getElementById("humedad")
	humedad.textContent = data.humedad

	let viento = document.getElementById("viento")
	viento.textContent = data.velocidaViento

	let sensacionTermica = document.getElementById("senstermica")
	sensacionTermica.textContent = data.sensacionTermica

	let presion = document.getElementById("presion")
	presion.textContent = data.presion

	let clima = document.getElementById("imagen-clima")
	clima.src = `img/${respuestaClima.clima}.png`
	clima.alt = `${respuestaClima.clima}`

	var mapa = document.getElementById('mapa')
	mapa.style.height = '50%'
	mapa.style.width = '100%'
	mapa.src = `https://www.google.com/maps/embed/v1/view?key=${API_KEY_MAP}&center=${respuestaClima.latitud},${respuestaClima.longitud}&zoom=8`
}