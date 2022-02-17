function fetchUsers(url, method = 'GET') {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.onload = () => {
            if (xhr.status == '200') {
                resolve(xhr.response)
            } else {
                reject(xhr.status + ' ' + xhr.statusText)
            }
        }
        xhr.onerror = () => {
            reject(xhr.status + ' ' + xhr.statusText)
        }
        xhr.send()
    })
}
class Weather {
    constructor() {
        this.pogoda = document.querySelector(".weather__forecast")
        this.pogodas = document.querySelector(".weather__forecasts")
        this.key = '1354067d4c5e5ba7d6625f68d153937b'
        this.urlWetherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${this.key}`
        this.urlWetherByDays = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${this.key}`
        this.initFoo()
        this.initFooOne()
    }
    initFooOne() {
        fetchUsers(this.urlWetherCurrent)
            .then((response) => {
                const data = JSON.parse(response)
                console.log(data)
                const temp = Math.round(data.main.temp) - 273 + " °C"
                const feels_like = Math.round(data.main.feels_like) - 273 + " °C"
                const windDeg = this.getDirection(data.wind.deg)
                const windSpeed = Math.round(data.wind.speed) + "m/s"
                const city = data.name
                const date = new Date(data.dt * 1000)
                const countryCode = data.sys.country
                const iconSrc = ` http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                let result = ""
                let tomplate = this.templatePogoda(city, windDeg, windSpeed, date, temp, countryCode, iconSrc, feels_like)
                result = result + tomplate
                this.pogoda.innerHTML = result
            })
            .catch((error) => {
                console.error(error)
            })
    }
    templatePogoda(city, windDeg, windSpeed, date, temp, countryCode, iconSrc, feels_like) {
        return `
        <div class="nav">
            <div>
                <span>${city}</span>
                <span>${countryCode}</span>
            </div>
            <span>${date.getHours()}.${date.getUTCMinutes()}</span>
        </div>
        <div class="title">
            <div>
               <img class="img" src="${iconSrc}">
            </div>
            <div>
                <span class="temp">${temp}</span>
            </div>
           <div>
               <span>feels like ${feels_like}</span>
           </div>
        </div>
        <div class="footer">
            <div>
                <span>${windDeg}</span>
            </div>
            <div>
                <span>${windSpeed}</span>
            </div>
        </div>
    `
    }
    initFoo() {
        fetchUsers(this.urlWetherByDays)
            .then((response) => {
                const data = JSON.parse(response)
                let result = ""
                data.list.forEach((item, index) => {
                    if ((index + 5) % 8 == 0) {
                        let template = this.pogodaas(item)
                        result = result + template
                    }
                    this.pogodas.innerHTML = result
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }
    pogodaas(item) {
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        const date = new Date(item.dt * 1000)
        const dateMonth = date.getMonth()
        const dateden = date.getDate()
        let mes = month[dateMonth]
        const description = item.weather[0].description
        const iconSrc = ` http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
        return `
        <div class="two">
            <div class="day">
                <span>${dateden}  ${mes}</span>
            </div>
            <div class="day">
                <img src="${iconSrc}">
            </div>
            <div class="day">
                <span>${Math.round(item.main.temp)-273+" °C" }</span>
            </div>
        </div>
    `
    }
    getDirection(item) {
        console.log(item)
        if (item == 0) {
            return 'North'
        } else if (90 > item || item > 0) {
            return 'North-East'
        } else if (item == 90) {
            return 'East'
        } else if (180 > item || item > 90) {
            return 'South-East'
        } else if (item == 180) {
            return 'South'
        } else if (270 > item || item > 180) {
            return 'South-West'
        } else if (item == 270) {
            return 'West'
        } else if (360 > item || item > 270) {
            return 'North-West'
        }
    }
}
let info = new Weather()