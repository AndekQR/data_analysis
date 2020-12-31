import "./style.scss"
import React, {useEffect, useRef, useState} from "react";
import {progressBarActions} from "../../redux/actions/progressBar.actions";
import {useDispatch} from "react-redux";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {ChernoffElements} from "./chernoffElements";
import ChernoffLegend from "./chernoffLegend";

const ChernoffsFacesChart = ({dataUtils}) => {

    const [yearInput, setYearInput] = useState()
    const [countryInput, setCountryInput] = useState()
    const [data, setData] = useState([])
    const [allCountries, setAllCountries] = useState([])
    const [yearsByCountry, setYearsByCountry] = useState([])
    const dispatch = useDispatch()
    const parameters = ['sex', 'age', 'suicides_no', 'population', 'suicides_k_pop']
    const canvasRef = useRef(null)
    const [dimension, setDimension] = useState([
        window.innerWidth,
        window.innerHeight,
    ]);
    const [containerDiv, setContainerDiv] = useState()

    useEffect(() => {
        dispatch(progressBarActions.showProgressBar())
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
        dataUtils.getFilteredData(countryInput, yearInput).then((elements) => {
            setData(elements)
        })
    }, [countryInput, yearInput])

    useEffect(() => {
        if (data != null && data.length > 0) drawFaces()
        setContainerDiv(document.getElementsByClassName('container')[0])
    }, [data])

    useEffect(() => {
        if (containerDiv !== undefined) {
            const debouncedResizeHandler = debounce(() => {
                setDimension([containerDiv.clientWidth, containerDiv.clientHeight]);
            }, 80);
            window.addEventListener('resize', debouncedResizeHandler);
        }

    }, [containerDiv])

    useEffect(() => {
        drawFaces()
    }, [dimension])


    function debounce(fn, ms) {
        let timer;
        return _ => {
            clearTimeout(timer);
            timer = setTimeout(_ => {
                timer = null;
                fn.apply(this, arguments);
            }, ms);
        };
    }

    /**
     * Funkcja rysująca twarz,
     * brane pod uwagę są sex, age, suiciedes_no, population, suiciedes/100k pop
     * @param data
     */
    async function drawFaces() {

        const dynamicCanvas = canvasRef.current
        if (dynamicCanvas == null) return null
        const ctx = dynamicCanvas.getContext('2d')
        dynamicCanvas.height = containerDiv.clientHeight;
        dynamicCanvas.width = containerDiv.clientWidth;

        ctx.clearRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);

        data.forEach((element, index) => {
            let coordinates = getCoordinates(index, data.length, dynamicCanvas.width, dynamicCanvas.height)
            drawFace(ctx,
                /*x*/coordinates[0], /*y*/coordinates[1],
                /*head*/getType(parameters[0], element.sex),
                /*eyebrow*/getType(parameters[1], element.age),
                /*eyes*/getType(parameters[2], element.suicides_no),
                /*nose*/getType(parameters[3], element.population),
                /*mouth*/getType(parameters[4], element.suicides_k_pop));
        })

        return ctx
    }


    /**
     * zwraca pozycje do narysowania twarzy
     * @param currentElementIndex - indeks aktualnie rysowanej twarzy
     * @param allElementsLenght - liczba wszystkich twarzy do narysowania
     * @param width - szerokość powierzchni rysowania
     * @param height - wysokość powierzchni rysowania
     * @returns {number[]}
     */
    function getCoordinates(currentElementIndex, allElementsLenght, width, height) {
        const oneElementSize = [100, 100]
        const elementsInRow = Math.round(width / (oneElementSize[0] + 20))
        const rows = Math.ceil(allElementsLenght / elementsInRow)
        let currentElement = currentElementIndex + 1
        let iteratedElements = 1
        for (let i = 1; i <= rows; i++) { //rows
            for (let j = 1; j <= elementsInRow; j++) { //columns
                if (iteratedElements === currentElement) {
                    return [j * oneElementSize[0]-50, i * oneElementSize[1] - 80]
                }
                iteratedElements++
            }
        }
        return [0, 0]
    }

    /**
     * Funkcja rysująca jedną twarz.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - Współrzędna X na mapie.
     * @param {number} y - Współrzędna Y na mapie.
     * @param {number} headType - Typ twarzy (1, 2, 3).
     * @param {number} eyebrowType - Typ brwi (1, 2, 3).
     * @param {number} eyesType - Typ oczu (1, 2, 3).
     * @param {number} noseType - Typ nosa (1, 2, 3).
     * @param {number} mouthType - Typ ust (1, 2, 3).
     */
    function drawFace(ctx, x, y, headType, eyebrowType, eyesType, noseType, mouthType) {
        ChernoffElements.drawHead(ctx, x, y, headType);
        ChernoffElements.drawEyebrow(ctx, x, y, eyebrowType);
        ChernoffElements.drawEyes(ctx, x, y, eyesType);
        ChernoffElements.drawNose(ctx, x, y, noseType);
        ChernoffElements.drawMouth(ctx, x, y, mouthType);
    }


    /**
     * funkcja wyznacza numer przedziału do któej należy @parameterValue
     * @param parameterName - nazwa kolumny ze zbioru danych
     * @param parameterValue - wartość komórki w wybranej kolumnie oraz aktualnie przetwarzanym wierszu
     */
    function getType(parameterName, parameterValue) {
        switch (parameterName) {
            case /*sex*/
            parameters[0]: {
                if (parameterValue === 'male') return 1
                else return 2
            }
            case /*age*/
            parameters[1]: {
                const age = dataUtils.parseAge(parameterValue)
                if (age != null) {
                    if (age.length === 2) {
                        if (age[0] > 0 && age[1] < 25) return 2
                        if (age[0] > 25 && age[1] < 55) return 1
                    } else {
                        return 3
                    }
                }
                return 2
            }
            case /*suicides_no*/
            parameters[2]: {
                const sortedData = [...data].sort((a, b) => {
                    if(Number(a.suicides_no) > Number(b.suicides_no)) return 1
                    if(Number(a.suicides_no) < Number(b.suicides_no)) return -1
                    else return 0
                })
                const middle = Math.ceil(sortedData.length / 2)
                const quarter = Math.ceil(middle / 2)
                if (parameterValue <= sortedData[quarter].suicides_no) return 3
                if (parameterValue > sortedData[quarter].suicides_no && parameterValue <= sortedData[middle + quarter].suicides_no) return 1
                if (parameterValue > sortedData[middle + quarter].suicides_no) return 2
                return 3
            }
            case /*population*/
            parameters[3]: {
                const sortedData = [...data].sort((a, b) => {
                    if(Number(a.population) > Number(b.population)) return 1
                    if(Number(a.population) < Number(b.population)) return -1
                    else return 0
                })
                const middle = Math.ceil(sortedData.length / 2)
                const quarter = Math.ceil(middle / 2)
                if (parameterValue <= sortedData[quarter].population) return 3
                if (parameterValue > sortedData[quarter].population && parameterValue <= sortedData[middle + quarter].population) return 1
                if (parameterValue > sortedData[middle + quarter].population) return 2
                return 3
            }
            case /*suicides_k_pop*/
            parameters[4]: {
                const sortedData = [...data].sort((a, b) => {
                    if(Number(a.suicides_k_pop) > Number(b.suicides_k_pop)) return 1
                    if(Number(a.suicides_k_pop) < Number(b.suicides_k_pop)) return -1
                    else return 0
                })
                const middle = Math.ceil(sortedData.length / 2)
                const quarter = Math.ceil(middle / 2)
                if (parameterValue <= sortedData[quarter].suicides_k_pop) return 3
                if (parameterValue > sortedData[quarter].suicides_k_pop && parameterValue <= sortedData[middle + quarter].suicides_k_pop) return 1
                if (parameterValue > sortedData[middle + quarter].suicides_k_pop) return 2
                return 3
            }
        }
    }


    return (
        <div className={"chernoff"}>
            {(allCountries && yearsByCountry && yearInput && countryInput) &&
            <div className={"container"} style={{height: '500px'}}>
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
                <canvas className={"canvas"} ref={canvasRef}/>
            </div>}
            <ChernoffLegend getCoordinates={getCoordinates}/>
        </div>
    )
}

export default ChernoffsFacesChart