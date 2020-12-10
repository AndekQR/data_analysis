import "./style.scss"
import React, {useEffect, useState} from "react";
import {ComposableMap, Geographies, Geography, Graticule, Sphere} from "react-simple-maps";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ReactTooltip from "react-tooltip";
import {scaleLinear} from "d3-scale";

const geoURL = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"


const MapChart = ({dataUtils, setProgress}) => {

    const [allCountries, setAllCountries] = useState(null)
    const [years, setYears] = useState(null)
    const [yearInput, setYearInput] = useState()
    const [tooltipContent, setTooltipContent] = useState("")
    const [colorScale, setColorScale] = useState(null)

    useEffect(() => {
        dataUtils.getDistinctsAllCountires().then(data => {
            setAllCountries(data)
        })
        dataUtils.getYears().then(data => {
            setYears(data)
            setYearInput(data[0])
        })
        getColorScale().then(scale => {
            setColorScale({scale})
        })
    }, [])


    async function getColorScale() {
        let range = await dataUtils.getDeathsRange()
        return scaleLinear().domain(range).range(["#ffedea", "#ff5233"])
    }



    return (
        <div >
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
                    <span className={"title"}>Liczba samobójstw w krajach</span>
                </div>
                <ComposableMap height={400} data-tip="" projectionConfig={{scale: 140}}>
                    <Sphere stroke="#E4E5E6" strokeWidth={0.5}/>
                    <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
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
                                            console.log("on mouse enter")
                                            console.log(female)
                                            setTooltipContent(`${NAME_LONG}: \n
                                            women: ${female} \n
                                            men: ${male} \n
                                            all: ${dataUtils.getAllDeaths(NAME_LONG, yearInput)}`);
                                        }}
                                        onMouseLeave={() => {
                                            setTooltipContent("");
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