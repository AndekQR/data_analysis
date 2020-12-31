import "./style.scss"
import React, {useEffect, useState} from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {useDispatch} from "react-redux";
import {progressBarActions} from "../../redux/actions/progressBar.actions";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const PopulationPyramidChart = ({dataUtils}) => {

    const sex = ['male', 'female']
    const [categories, setCategories] = useState([])
    const [yearInput, setYearInput] = useState()
    const [countryInput, setCountryInput] = useState()
    const [allCountries, setAllCountries] = useState([])
    const [yearsByCountry, setYearsByCountry] = useState([])
    const [data, setData] = useState({
        maleData: [],
        femaleData: []
    })

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(progressBarActions.showProgressBar())
        const ranges = dataUtils.getAllAgeRangesAsString()
        console.log(ranges)
        setCategories(ranges)
        dataUtils.getDistinctsAllCountires().then(countries => {
            setAllCountries(countries)
            const firstCountry = countries[0]
            setCountryInput(firstCountry)
            dataUtils.getDistinctAllYearsByCountry(firstCountry).then(years => {
                setYearsByCountry(years)
                setYearInput(years[0]);
                dispatch(progressBarActions.hideProgressBar())
            })
        })
    }, [])



    useEffect(() => {
        let tmpMaleData = []
        let tmpFemaleData = []
        categories.forEach(category => {
            const malePopulation = dataUtils.getPopulation(countryInput, yearInput, sex[0], category)
            const femalePopulation = dataUtils.getPopulation(countryInput, yearInput, sex[1], category)
            tmpMaleData.push(-(Number(malePopulation))) //bo słupki idą w lewą stronę
            tmpFemaleData.push(Number(femalePopulation))
        })
        setData({
            maleData: tmpMaleData,
            femaleData: tmpFemaleData
        })
    }, [categories, countryInput, yearInput]);


    const options = {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Population pyramid'
        },
        xAxis: [{
            categories: categories,
            reversed: false,
            labels: {
                step: 1
            }
        }, {
            opposite: true,
            reversed: false,
            categories: categories,
            linkedTo: 0,
            labels: {
                step: 1
            }
        }],
        yAxis: {
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return Math.abs(this.value) ;
                }
            }
        },

        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                    'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 1);
            }
        },

        series: [{
            name: 'Male',
            data: data.maleData
        }, {
            name: 'Female',
            data: data.femaleData
        }]
    }


    return (
        <div className={"populationPyramidChart"}>
            {(countryInput && yearInput && data) &&
            <div className={"container"}>
                <div className={"controls"}>
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
                        <InputLabel id={"selectLabel"}>Choose year:</InputLabel>
                        <Select
                            labelId={"selectLabel"}
                            value={yearInput}
                            onChange={(event => setYearInput(event.target.value))}
                        >
                            {yearsByCountry.map(year => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className={"chart"}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                </div>
            </div>}
        </div>
    )
}

export default PopulationPyramidChart