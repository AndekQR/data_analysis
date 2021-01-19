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

    /**
     * zwraca lata bez powtórzeń które są przyporządkowane do danego kraju
     * @param country
     * @returns {Promise<string[]>}
     */
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
     * @returns {Promise<string[]>}
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
            return this.getAllDeaths(object.country, object.year)
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
     * zwraca uśrednione dane dla wybranego kraju i roku z pozdiałem
     * na mężczyzny i kobiety
     * @param country {string}
     * @param year {string}
     * @returns {Promise<{}>}
     */
    async getAverageMaleFemaleData(country, year) {
        let data = await this.getFilteredData(country, year);
        let maleRecordNumber = 0;
        let femaleRecordNumber = 0;
        let result = {
            male: {
                sex: "male",
                suicides_no: 0.0,
                population: 0.0,
                suicides_k_pop: 0.0,
                age: 0.0
            },
            female: {
                sex: "female",
                suicides_no: 0.0,
                population: 0.0,
                suicides_k_pop: 0.0,
                age: 0.0
            }
        }
        if (data.length > 0) {
            for (let i = 0; i < data.length - 1; i++) {
                let record = data[i]
                let parsedAge = this.parseAge(record.age)
                if (record.sex === "male") {
                    maleRecordNumber++
                    result.male.age += (parsedAge.length === 2 ? ((Number(parsedAge[1]) + Number(parsedAge[0])) / 2) : Number(parsedAge[0]))
                    result.male.suicides_k_pop += Number(record.suicides_k_pop)
                    result.male.population += Number(record.population)
                    result.male.suicides_no += Number(record.suicides_no)
                } else if (record.sex === "female") {
                    femaleRecordNumber++
                    result.female.age += (parsedAge.length === 2 ? ((Number(parsedAge[1]) + Number(parsedAge[0])) / 2) : Number(parsedAge[0]))
                    result.female.suicides_k_pop += Number(record.suicides_k_pop)
                    result.female.population += Number(record.population)
                    result.female.suicides_no += Number(record.suicides_no)
                }
            }

            result.male.age = result.male.age / maleRecordNumber
            result.male.suicides_k_pop = result.male.suicides_k_pop / maleRecordNumber
            result.male.population = result.male.population / maleRecordNumber
            result.male.suicides_no = result.male.suicides_no / maleRecordNumber

            result.female.age = result.female.age / femaleRecordNumber
            result.female.suicides_k_pop = result.female.suicides_k_pop / femaleRecordNumber
            result.female.population = result.female.population / femaleRecordNumber
            result.female.suicides_no = result.female.suicides_no / femaleRecordNumber

            return result
        }
        return null;
    }

    /**
     * zwraca średnie światowe wszystkich współczynników dla mężczyzn i kobiet
     * @param year
     * @returns {Promise<{female: {suicides_no: number, sex: string, age: number, population: number, suicides_k_pop: number}, male: {suicides_no: number, sex: string, age: number, population: number, suicides_k_pop: number}}>}
     */
    async getAverageMaleFemaleDataForAllCountries(year) {
        let countries = await this.getDistinctsAllCountires();
        let result = {
            male: {
                sex: "male",
                suicides_no: 0,
                population: 0,
                suicides_k_pop: 0,
                age: 0
            },
            female: {
                sex: "female",
                suicides_no: 0,
                population: 0,
                suicides_k_pop: 0,
                age: 0
            }
        }
        for (const country of countries) {
            let countryData = await this.getAverageMaleFemaleData(country, year);
            if (countryData != null) {
                result.male.age += countryData.male.age
                result.male.suicides_k_pop += countryData.male.suicides_k_pop
                result.male.population += countryData.male.population
                result.male.suicides_no += countryData.male.suicides_no

                result.female.age += countryData.female.age
                result.female.suicides_k_pop += countryData.female.suicides_k_pop
                result.female.population += countryData.female.population
                result.female.suicides_no += countryData.female.suicides_no
            }
        }

        result.male.age = result.male.age / countries.length
        result.male.suicides_k_pop = result.male.suicides_k_pop / countries.length
        result.male.population = result.male.population / countries.length
        result.male.suicides_no = result.male.suicides_no / countries.length

        result.female.age = result.female.age / countries.length
        result.female.suicides_k_pop = result.female.suicides_k_pop / countries.length
        result.female.population = result.female.population / countries.length
        result.female.suicides_no = result.female.suicides_no / countries.length

        return result;
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
        let tmpData = this.data.filter((element, index, array) => {
            let firstIndex = array.findIndex(t => (t.age === element.age))
            return firstIndex === index
        }).map((element) => element.age)
        tmpData.sort((a, b) => {
            const firstNumberRegex = /\d+/g
            let firstNumberFromA = Number([...a.matchAll(firstNumberRegex)][0][0])
            let firstNumberFromB = Number([...b.matchAll(firstNumberRegex)][0][0])

            if (firstNumberFromA > firstNumberFromB) return 1
            else if (firstNumberFromA < firstNumberFromB) return -1
            else return 0
        })
        return tmpData
    }

    /**
     * zwraca populację
     * @param country {string}
     * @param year {number}
     * @param sex {string}
     * @param age {string} w formacie z danych
     */
    getPopulation(country, year, sex, age) {
        return this.data.filter(element => {
            return element.country === country &&
                element.year == year &&
                element.sex === sex &&
                element.age === age
        }).map((element) => element.population)[0]
    }

}


export default DataUtils