class DataUtils {
    #countries = null
    #years = null

    constructor(data) {
        this.data = data;
    }

    /**
     * zwraca wsystkie unikalne kraje zawarte w danych
     * @returns {Promise<null>}
     */
    async getDistinctsAllCountires() {
        if (this.#countries == null) {
            let tmp = this.data.filter((object, index, array) => {
                let firstIndex = array.findIndex((t) => (
                    t.country === object.country
                ))
                return index === firstIndex
            }).map(async (filteredObject) => {
                return filteredObject.country
            })
            this.#countries = await Promise.all(tmp)
            return this.#countries
        } else {
            return this.#countries
        }
    }

    /**
     * zwraca wszystkie unikalne lata
     * @returns {Promise<null>}
     */
    async getYears() {
        if (this.#years == null) {
            let tmp = this.data.filter((object, index, array) => {
                let firstIndex = array.findIndex((t) => (
                    t.year === object.year
                ))
                return index === firstIndex
            }).map(async (filteredObject) => {
                return filteredObject.year
            })
            this.#years = await Promise.all(tmp)
            return this.#years
        } else {
            return this.#years
        }
    }

    /**
     * zwraca liczbę wszystkich zgonów w danym kraju i roku
     * @param countryName
     * @param year
     * @returns {number}
     */
     getAllDeaths(countryName, year) {
        let filteredData = this.data.filter(object => object.country === countryName && object.year == year)
        let result = 0;
        filteredData.forEach(object => {
            result = result + Number(object.suicides_no)
        })
        return result
    }

    /**
     * zwraca liczbę zgonów w danym roku i kraju, z podziałem na meżczyzny i kobiety
     * @param countryName
     * @param year
     * @returns {{female: number, male: number}}
     */
    getDeathsByGender(countryName, year) {
        let filteredData = this.data.filter(object => object.country === countryName && object.year == year)
        let manDeaths = 0;
        let womenDeaths = 0;
        filteredData.forEach(element => {
            if(element.sex === "male") {
                manDeaths = manDeaths + Number(element.suicides_no)
            }
            else {
                womenDeaths = womenDeaths + Number(element.suicides_no)
            }
        })
        return {
            "male": manDeaths,
            "female": womenDeaths
        }
    }

    /**
     * zwraca maksymalną liczbę zgonów zawartą w danych w całm roku
     */
    async getDeathsRange() {
        let countries = await this.getDistinctsAllCountires()
        let yearsList = await this.getYears()
        let mappedObjects = countries.map(country => {
            let objects = []
            for (let i of yearsList) {
                objects.push({country, "year":i})
            }
            return objects
        }).flat()

        let max = Math.max.apply(Math, mappedObjects.map(object => {
            let tmp = this.getAllDeaths(object.country, object.year)
            // console.log(`${object.country} ${object.year} = ${tmp}`)
            return tmp
        }))

        let min = Math.min.apply(Math, mappedObjects.map(object => {
            return this.getAllDeaths(object.country, object.year)
        }))

        return [min,max]
    }

}


export default DataUtils