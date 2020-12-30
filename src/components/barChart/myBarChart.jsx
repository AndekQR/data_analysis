import "./style.scss"
import React, {useEffect, useState} from "react";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {Tooltip} from "@material-ui/core";

/**
 *
 * @param {DataUtils} dataLoader:
 * @returns {JSX.Element}
 * @constructor
 */
const MyBarChart = ({dataUtils}) => {

    const dataSubjects = ['suicides', 'population', 'suicides / 100k population']
    const [countryInput, setCountryInput] = useState(null)
    const [dataSubject, setDataSubject] = useState(dataSubjects[0])
    const [allCountries, setAllCountries] = useState([])
    const [yearsByCountry, setYearsByCountry] = useState([])
    const [data, setData] = useState([])


    useEffect(() => {
        dataUtils.getDistinctsAllCountires().then((countries) => {
            setCountryInput(countries[0])
            setAllCountries(countries)
        })
    }, [])

    useEffect(() => {
        if (countryInput != null) {
            dataUtils.getDistinctAllYearsByCountry(countryInput).then((years) => {
                setYearsByCountry(years)
            })
        }
    }, [countryInput])

    useEffect(() => {
        let tmpData = []
        switch (dataSubject) {
            case dataSubjects[0]: {
                yearsByCountry.forEach(value => {
                    let tmp = dataUtils.getAllDeaths(countryInput, value)
                    tmpData.push({
                        name: value,
                        value: tmp
                    })
                })
                setData(tmpData)
                break;
            }
            case dataSubjects[1]: {
                yearsByCountry.forEach(value => {
                    let tmp = dataUtils.getPopulationByCountryAndYear(countryInput, value)
                    tmpData.push({
                        name: value,
                        value: tmp
                    })
                })
                setData(tmpData)
                break;
            }
            case dataSubjects[2]: {
                yearsByCountry.forEach(value => {
                    let tmp = dataUtils.getSuicides_100k_population(countryInput, value)
                    tmpData.push({
                        name: value,
                        value: tmp
                    })
                })
                setData(tmpData)
                break;
            }
        }
    }, [yearsByCountry, dataSubject])


    return (
        <div className={"barChart"}>
            {(countryInput && allCountries.length > 0 && dataSubject) &&
            <div className={"container"}>
                <div className={"controls"}>
                    <div className={"header"}>
                        <div>
                            <InputLabel id={"selectLabel"}>Choose country:</InputLabel>
                            <Select
                                labelId={"selectLabel"}
                                value={countryInput}
                                onChange={(event => setCountryInput(event.target.value))}
                            >
                                {allCountries.map(country => (
                                    <MenuItem key={country} value={country}>{country}</MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <InputLabel id={"selectLabel1"}>Choose data subject:</InputLabel>
                            <Select
                                labelId={"selectLabel1"}
                                value={dataSubject}
                                onChange={(event => setDataSubject(event.target.value))}
                            >
                                {dataSubjects.map(element => (
                                    <MenuItem key={element} value={element}>{element}</MenuItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>
                <div className={"chart"}>
                    <ResponsiveContainer width={"95%"} height={500}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Bar dataKey="value" fill="#8884d8"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>}
        </div>
    )
}

export default MyBarChart