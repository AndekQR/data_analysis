import "./style.scss"
import React, {useEffect, useRef, useState} from "react";
import {progressBarActions} from "../../redux/actions/progressBar.actions";
import {useDispatch} from "react-redux";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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
    }, [data])

    useEffect(() => {
        const elements = document.getElementsByClassName("container")
        if (elements.length > 0) {
            const element = elements[0]
            const debouncedResizeHandler = debounce(() => {
                setDimension([element.clientWidth, element.clientHeight]);
            }, 80);
            window.addEventListener('resize', debouncedResizeHandler);
            return () => window.removeEventListener('resize', debouncedResizeHandler);
        }

    }, [])

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
        const div = document.getElementsByClassName("container")
        dynamicCanvas.height = div[0].clientHeight;
        dynamicCanvas.width = div[0].clientWidth;

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
     * @param currentElementIndex - indeks ajtualnie rysowanej twarzy
     * @param allElementsLenght - liczba wszystkich twarzy do narysowania
     * @param width - szerokość powierzchni rysowania
     * @param height - wysokość powierzchni rysowania
     * @returns {number[]}
     */
    function getCoordinates(currentElementIndex, allElementsLenght, width, height) {
        const oneElementSize = [100, 100]
        const elementsInRow = Math.round(width / (oneElementSize[0] + 20))
        console.log("elements in row: " + elementsInRow)
        const rows = Math.ceil(allElementsLenght / elementsInRow)
        console.log("rows: " + rows)
        let currentElement = currentElementIndex + 1
        let iteratedElements = 1
        for (let i = 1; i <= rows; i++) { //rows
            for (let j = 1; j <= elementsInRow; j++) { //columns
                if (iteratedElements === currentElement) {
                    console.log("current element index: " + currentElement)
                    console.log("i*j: " + (i * j))
                    console.log("coord: " + (j * oneElementSize[0] - 80) + "x" + (i * oneElementSize[1] - 80))
                    return [j * oneElementSize[0] - 80, i * oneElementSize[1] - 80]
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

        drawHead(ctx, x, y, headType);
        drawEyebrow(ctx, x, y, eyebrowType);
        drawEyes(ctx, x, y, eyesType);
        drawNose(ctx, x, y, noseType);
        drawMouth(ctx, x, y, mouthType);
    }

    /**
     * Funkcja rysująca nos.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - Współrzędna X w obrębie twarzy.
     * @param {number} y - Współrzędna Y w obrębie twarzy.
     * @param {number} type - 1, 2 lub 3
     */
    function drawNose(ctx, x, y, type) {

        ctx.beginPath();
        ctx.moveTo(x + 25, y + 20);
        switch (type) {
            case 1:
                ctx.lineTo(x + 23, y + 25);
                ctx.lineTo(x + 27, y + 25);
                break;
            case 2:
                ctx.lineTo(x + 20, y + 25);
                ctx.lineTo(x + 30, y + 25);
                break;
            case 3:
                ctx.lineTo(x + 20, y + 32);
                ctx.lineTo(x + 30, y + 32);
                break;
        }
        ctx.lineTo(x + 25, y + 20);
        ctx.stroke();
    }

    /**
     * Funkcja rysująca głowę.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - Współrzędna X w obrębie twarzy.
     * @param {number} y - Współrzędna Y w obrębie twarzy.
     * @param {number} type - 1, 2 lub 3
     */
    function drawHead(ctx, x, y, type) {

        switch (type) {
            case 1:
                drawEllipse(ctx, (x - /*width*/30 / 2.0) + 25, (y - 50 / 2.0) + 25, /*width*/30, 50);
                break;
            case 2:
                drawEllipse(ctx, (x - /*width*/40 / 2.0) + 25, (y - 50 / 2.0) + 25, /*width*/40, 50);
                break;
            case 3:
                drawEllipse(ctx, (x - /*width*/50 / 2.0) + 25, (y - 50 / 2.0) + 25, /*width*/50, 50);
                break;
        }
    }

    /**
     * Funkcja rysująca oczy.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - Współrzędna X w obrębie twarzy.
     * @param {number} y - Współrzędna Y w obrębie twarzy.
     * @param {number} type - 1, 2 lub 3
     */
    function drawEyes(ctx, x, y, type) {

        var size;
        switch (type) {
            case 1:
                size = 6;
                break;
            case 2:
                size = 10;
                break;
            case 3:
                size = 15;
                break;
        }

        drawEllipseByCenter(ctx, x + 15, y + 15, size, size);
        drawEllipseByCenter(ctx, x + 35, y + 15, size, size);
        drawEllipseByCenter(ctx, x + 15, y + 15, size - 5, size - 5);
        drawEllipseByCenter(ctx, x + 35, y + 15, size - 5, size - 5);
    }

    /**
     * Funkcja rysująca usta.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - Współrzędna X w obrębie twarzy.
     * @param {number} y - Współrzędna Y w obrębie twarzy.
     * @param {number} type - 1, 2 lub 3
     */
    function drawMouth(ctx, x, y, type) {

        ctx.beginPath();
        switch (type) {
            case 3:
                ctx.arc(x + 25, y + 25, 20, 0.25 * Math.PI, 0.75 * Math.PI);
                break;
            case 2:
                ctx.moveTo(x + 15, y + 40);
                ctx.lineTo(x + 35, y + 40);
                break;
            case 1:
                ctx.arc(x + 25, y + 55, 20, 1.25 * Math.PI, 1.75 * Math.PI);
                break;
        }
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /**
     * Funkcja rysująca brwi.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - Współrzędna X w obrębie twarzy.
     * @param {number} y - Współrzędna Y w obrębie twarzy.
     * @param {number} type - 1, 2 lub 3
     */
    function drawEyebrow(ctx, x, y, type) {

        ctx.beginPath();
        switch (type) {
            case 1:
                //lewa1
                ctx.moveTo(x + 5, y + 15);
                ctx.lineTo(x + 20, y + 5);
                //prawa1
                ctx.moveTo(x + 30, y + 5);
                ctx.lineTo(x + 45, y + 15);
                break;
            case 2:
                //lewa2
                ctx.moveTo(x + 8, y + 8);
                ctx.lineTo(x + 20, y + 8);
                //prawa2
                ctx.moveTo(x + 30, y + 8);
                ctx.lineTo(x + 42, y + 8);
                break;
            case 3:
                //lewa3
                ctx.moveTo(x + 8, y + 5);
                ctx.lineTo(x + 20, y + 8);
                //prawa3
                ctx.moveTo(x + 30, y + 8);
                ctx.lineTo(x + 42, y + 5);
                break;
        }
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    /**
     * Funkcja rysująca elipsę.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - Współrzędna X środka elipsy.
     * @param {number} y - Współrzędna Y środka elipsy.
     * @param {number} w - Szerokość elipsy.
     * @param {number} h - Wysokość elipsy.
     */
    function drawEllipseByCenter(ctx, x, y, w, h) {

        drawEllipse(ctx, x - w / 2.0, y - h / 2.0, w, h);
    }

    /**
     * Funkcja rysująca elipsę.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - Współrzędna X elipsy.
     * @param {number} y - Współrzędna Y elipsy.
     * @param {number} w - Szerokość elipsy.
     * @param {number} h - Wysokość elipsy.
     */
    function drawEllipse(ctx, x, y, w, h) {

        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        ctx.lineWidth = 1;
        ctx.stroke();
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
                const sortedData = [...data].sort((a, b) => a.suicides_no > b.suicides_no)
                const middle = Math.ceil(sortedData.length / 2)
                const quarter = Math.ceil(middle / 2)
                if (parameterValue < sortedData[quarter].suicides_no) return 3
                if (parameterValue > sortedData[quarter].suicides_no && parameterValue < sortedData[middle + quarter].suicides_no) return 1
                if (parameterValue > sortedData[middle + quarter]) return 2
                return 3
            }
            case /*population*/
            parameters[3]: {
                const sortedData = [...data].sort((a, b) => a.population > b.population)
                const middle = Math.ceil(sortedData.length / 2)
                const quarter = Math.ceil(middle / 2)
                if (parameterValue < sortedData[quarter].population) return 3
                if (parameterValue > sortedData[quarter].population && parameterValue < sortedData[middle + quarter].population) return 1
                if (parameterValue > sortedData[middle + quarter].population) return 2
                return 3
            }
            case /*suicides_k_pop*/
            parameters[4]: {
                const sortedData = [...data].sort((a, b) => a.suicides_k_pop > b.suicides_k_pop)
                const middle = Math.ceil(sortedData.length / 2)
                const quarter = Math.ceil(middle / 2)
                if (parameterValue < sortedData[quarter].suicides_k_pop) return 3
                if (parameterValue > sortedData[quarter].suicides_k_pop && parameterValue < sortedData[middle + quarter].suicides_k_pop) return 1
                if (parameterValue > sortedData[middle + quarter].suicides_k_pop) return 2
                return 3
            }
        }
    }


    return (
        <div className={"chernoff"}>
            {(allCountries && yearsByCountry && yearInput && countryInput) &&
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
                <canvas className={"canvas"} ref={canvasRef}/>
            </div>}
        </div>
    )
}

export default ChernoffsFacesChart