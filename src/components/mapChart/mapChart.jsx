import "./style.scss"
import React, {useEffect, useState} from "react";
import {ComposableMap, Geographies, Geography, Graticule, Sphere} from "react-simple-maps";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ReactTooltip from "react-tooltip";
import {scaleLinear} from "d3-scale";
import {useDispatch} from "react-redux";
import {progressBarActions} from "../../redux/actions/progressBar.actions";
import {chernoffFacesActions} from "../../redux/actions/chernoffChart.actions";

const geoURL = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"

/**
 * Wykres mapy świata
 * @param dataUtils
 * @param setProgress
 * @returns {JSX.Element}
 * @constructor
 */
const MapChart = ({dataUtils}) => {

    const [allCountries, setAllCountries] = useState(null)
    const [years, setYears] = useState(null)
    const [yearInput, setYearInput] = useState()
    const [tooltipContent, setTooltipContent] = useState("")
    const [colorScale, setColorScale] = useState(null)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(progressBarActions.showProgressBar())
        const countriesPromise = dataUtils.getDistinctsAllCountires()
        const yearsPromise = dataUtils.getYears()
        const colorScalePromise = getColorScale()
        Promise.all([countriesPromise, yearsPromise, colorScalePromise]).then((values) => {
            setAllCountries(values[0])
            setYears(values[1])
            setYearInput(values[1][0])
            setColorScale({'scale': values[2]})
            dispatch(progressBarActions.hideProgressBar())
        })
    }, [])

    async function getColorScale() {
        let range = await dataUtils.getDeathsRange()
        return scaleLinear().domain(range).range(["#ffedea", "#ff5233"])
    }

    return (
        <div className={"mapChart"}>
            {(allCountries && years && yearInput && colorScale) &&
            <div className={"container"}>
                <div className={"header"}>
                    <div className={"selectClass"}>
                        <InputLabel id={"selectLabel"}>Choose date:</InputLabel>
                        <Select
                            labelId={"selectLabel"}
                            value={yearInput}
                            onChange={(event => setYearInput(event.target.value))}
                        >
                            {years.map(year => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </div>
                    <span className={"title"}>Number of suicides in countries</span>
                </div>
                <ComposableMap height={400} data-tip="" projectionConfig={{scale: 140}}>
                    <Sphere stroke="#E4E5E6" strokeWidth={0.5}/>
                    <Graticule stroke="#E4E5E6" strokeWidth={0.5}/>
                    <Geographies geography={geoURL}>
                        {({geographies}) => (
                            geographies.map(geo => {
                                const currentCountry = allCountries.find(country => country === geo.properties.NAME_LONG)
                                const deaths = dataUtils.getAllDeaths(currentCountry, yearInput);
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={() => {
                                            let {NAME_LONG} = geo.properties;
                                            let {female, male} = dataUtils.getDeathsByGender(NAME_LONG, yearInput)
                                            setTooltipContent(`${NAME_LONG}: \n
                                            women: ${female} \n
                                            men: ${male} \n
                                            all: ${dataUtils.getAllDeaths(NAME_LONG, yearInput)}`);
                                        }}
                                        onMouseLeave={() => {
                                            setTooltipContent("");
                                        }}
                                        onClick={() => {
                                            dispatch(chernoffFacesActions.showChernoffFaces(geo.properties.NAME_LONG, yearInput))
                                        }}
                                        style={{
                                            default: {
                                                fill: currentCountry ? colorScale.scale(deaths) : "#F5F4F6",
                                                outline: "none"
                                            },
                                            hover: {
                                                fill: "rgba(77,4,4,0.8)",
                                                outline: "none"
                                            },
                                            pressed: {
                                                outline: "none"
                                            }
                                        }}
                                    />
                                );
                            })
                        )

                        }
                    </Geographies>
                </ComposableMap>
                <ReactTooltip>{tooltipContent}</ReactTooltip>
            </div>
            }

        </div>
    )
}

export default MapChart