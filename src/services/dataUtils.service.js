class DataUtils {
    #countries = null
    #years = null

    constructor(data) {
        this.data = data;
    }

    /**
     * zwraca wsystkie unikalne kraje zawarte w danych
     * @returns {Promise<[]>}
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

    async getDistinctAllYearsByCountry(country) {
        if (this.#years == null) await this.getYears()
        return this.data.filter(element => (
            element.country === country
        )).filter((element, index, array) => {
            let firstIndex = array.findIndex((t) => (
                t.year === element.year
            ))
            return index === firstIndex
        }).map(element => element.year)
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
     * zwraca populację w wybranym kraju i roku
     * @param country
     * @param year
     * @returns {number}
     */
    getPopulationByCountryAndYear(country, year) {
        let filteredData = this.data.filter(object => object.country === country && object.year == year)
        let result = 0;
        filteredData.forEach(object => {
            result = result + Number(object.population)
        })
        return result
    }

    getSuicides_100k_population(country, year) {
        let filteredData = this.data.filter(object => object.country === country && object.year == year)
        let result = 0;
        filteredData.forEach(object => {
            result = result + Number(object.suicides_k_pop)
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
            if (element.sex === "male") {
                manDeaths = manDeaths + Number(element.suicides_no)
            } else {
                womenDeaths = womenDeaths + Number(element.suicides_no)
            }
        })
        return {
            "male": manDeaths,
            "female": womenDeaths
        }
    }

    /**
     * zwraca minimalną i maksymalną liczbę zgonów zawartą w danych w całm roku
     */
    async getDeathsRange() {
        let countries = await this.getDistinctsAllCountires()
        let yearsList = await this.getYears()
        let mappedObjects = countries.map(country => {
            let objects = []
            for (let i of yearsList) {
                objects.push({country, "year": i})
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

        return [min, max]
    }

    /**
     * zwraca tylko takie dane które posiadają wybrany kraj oraz rok
     * @param country
     * @param year
     * @returns {Promise<[]>}
     */
    async getFilteredData(country, year) {
        return this.data.filter(element => element.country === country && element.year == year)
    }

    /**
     * parsuje wiek podany w danych na tablicę typu [starAge, endAge]
     * gdzie drugiej komórki może nie być
     * lub zwraca null gdy nieprawidłowe ageString
     * @param ageString
     * @returns [starAge, endAge]
     */
    parseAge(ageString) {
        const regex = /\d+/g
        let matches = [...ageString.matchAll(regex)]
        return matches.map((element) => element[0])
    }

    /**
     * zwraca wszystkie unikalne przedziały wiekowe
     * @returns {string[]}
     */
    getAllAgeRangesAsString() {
        return this.data.filter((element, index, array) => {
            let firstIndex = array.findIndex(t => (t.age === element.age))
            return firstIndex === index
        }).map((element) => element.age).sort()
    }

}


export default DataUtils