import React, {useEffect, useState} from "react";
import {Area, AreaChart, Legend, Tooltip, XAxis, YAxis} from "recharts";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import "./style.scss"

/**
 * Wyświetla diagram prezentujący zakres wieku w jakim ludzie umierali w określonym roku
 *
 * @param data - dane pobrane z pliku
 * @param setProgress - czy wyświetlic progress bar
 * @returns {JSX.Element}
 * @constructor
 */
const ChartOne = ({data, setProgress}) => {

    const maxAge = 100

    const [allCountries, setAllCountries] = useState(getDistinctsAllCountires)
    //kraj z którego wyświetlane są statystyki w tym wykresie
    const [country, selectCountry] = useState(allCountries[0])
    const [specificData, setSpecificData] = useState()

    useEffect(() => {
        setSpecificData(getUpdatedData)
    }, [country])


    function getDistinctsAllCountires() {
        setProgress(true)
        let tmp = data.filter((object, index, array) => (
            index === array.findIndex((t) => (
                t.country === object.country
            ))
        )).map(filteredObject => filteredObject.country);
        setProgress(false)
        return tmp
    }

    /**
     * zwraca wiek od którego ludzie umierją w konkretnym roku (15-24 years, 75+ years)
     *
     * @param ageFromData - rekord z kolumny age z danych
     */
    function getStartAge(ageFromData) {
        let indexOfDash = ageFromData.indexOf('-')
        let result = 0
        if (indexOfDash === -1) {
            let indexOfAddSign = ageFromData.indexOf('+')
            result = Number(ageFromData.substring(0, indexOfAddSign))
        } else {
            result = Number(ageFromData.substring(0, indexOfDash))
        }
        return result
    }

    function getEndAge(ageFromData) {
        let indexOfDash = ageFromData.indexOf('-')
        let result = 0
        if (indexOfDash === -1) {
            result = maxAge
        } else {
            let indexOfSpace = ageFromData.indexOf(' ')
            result = Number(ageFromData.substring(indexOfDash + 1, indexOfSpace))
        }
        return result
    }


    /**
     * zwraca wartość średnią początkowej wartości wieku w którym umierali ludzie
     * z wybranego roku i kraju
     * @param year
     * @param country
     */
    function getAverageStartAge(year, country) {
        let result = 0
        const filteredData = data.filter(object => (
            object.year === year && object.country === country
        ))
        filteredData.forEach(object => {
            result = result + getStartAge(object.age)
        })
        return result / filteredData.length
    }

    function getAverageEndAge(year, country) {
        let result = 0
        const filteredData = data.filter(object => (
            object.year === year && object.country === country
        ))
        filteredData.forEach(object => {
            result = result + getEndAge(object.age)
        })
        return result / filteredData.length
    }

    function getUpdatedData() {
        setProgress(true)
        let tmp = data
            .filter(object => (
                object.country === country
            ))
            .map(object => {
                return {
                    year: object.year,
                    ageRange: [
                        getAverageStartAge(object.year, object.country),
                        getAverageEndAge(object.year, object.country)
                    ]
                }
            })
            .sort(compare);
        setProgress(false)
        return tmp
    }

    function compare(a, b) {
        if (a.year > b.year) return 1
        else if (b.year > a.year) return -1
        return 0;
    }

    async function changeCountry(country) {
        selectCountry(country)
    }


    return (
        <div>
            <div className={"selectClass"}>
                <InputLabel id={"selectLabel"}>Choose country:</InputLabel>
                <Select
                    labelId={"selectLabel"}
                    value={country}
                    onChange={(event => changeCountry(event.target.value))}
                >
                    {allCountries.map(country => (
                        <MenuItem key={country} value={country}>{country}</MenuItem>
                    ))}
                </Select>
            </div>
            <div className={"chartDiv"}>
                <span className={"chartTitle"}>Sredni wiek umieralności w wybranym kraju</span>
                <AreaChart
                    width={730}
                    height={250}
                    data={specificData}
                    margin={{
                        top: 20, right: 20, bottom: 20, left: 20,
                    }}>
                    <XAxis dataKey={"year"} label={{ value: 'Rok', angle: 0, position: 'bottom' }}/>
                    <YAxis label={{ value: 'Ilość', angle: -90, position: 'left' }} />
                    <Area dataKey="ageRange" stroke="#8884d8" fill="#8884d8"/>
                    <Tooltip/>
                    <Legend align={"left"}/>
                </AreaChart>
            </div>
        </div>
    )
}

export default ChartOne;