import "./style.scss"
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ChernoffElements} from "./chernoffElements";
import ChernoffLegend from "./chernoffLegend";

const ChernoffFace = ({dataUtils}) => {

    const upperLimit = 1.3
    const downLimit = 0.7

    const [data, setData] = useState(null)
    const dispatch = useDispatch()
    const parameters = ['sex', 'age', 'suicides_no', 'population', 'suicides_k_pop']
    const canvasRef = useRef(null)
    const [dimension, setDimension] = useState([
        window.innerWidth,
        window.innerHeight,
    ]);
    const [containerDiv, setContainerDiv] = useState()

    const chernoffState = useSelector(state => state.chernoffFaces);

    useEffect(() => {
        if (chernoffState !== undefined && chernoffState != null && chernoffState.visible === true) {
            dataUtils.getAverageMaleFemaleData(chernoffState.country, chernoffState.year).then((elements) => {
                setData(elements)
            })
        }
    }, [chernoffState.visible, chernoffState.country, chernoffState.year])

    useEffect(() => {
        if (data != null) {
            drawFaces()
        }
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
     * Funkcja rysująca twarze,
     * brane pod uwagę są sex, age, suiciedes_no, population, suiciedes/100k pop
     * @param data
     */
    async function drawFaces() {

        const dynamicCanvas = canvasRef.current
        if (dynamicCanvas == null) return null
        const ctx = dynamicCanvas.getContext('2d')
        dynamicCanvas.height = containerDiv.clientHeight
        dynamicCanvas.width = containerDiv.clientWidth

        ctx.clearRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);

        ctx.scale(5, 5)

        let maleCoordinates = getCoordinates(0, 2, dynamicCanvas.width, dynamicCanvas.height)
        drawFace(ctx,
            /*x*/maleCoordinates[0], /*y*/maleCoordinates[1],
            /*head*/await getType(parameters[0], data.male.sex, "male"),
            /*eyebrow*/await getType(parameters[1], data.male.age, "male"),
            /*eyes*/await getType(parameters[2], data.male.suicides_no, "male"),
            /*nose*/await getType(parameters[3], data.male.population, "male"),
            /*mouth*/await getType(parameters[4], data.male.suicides_k_pop, "male"));

        let femaleCoordinates = getCoordinates(1, 2, dynamicCanvas.width, dynamicCanvas.height)
        drawFace(ctx,
            /*x*/femaleCoordinates[0], /*y*/femaleCoordinates[1],
            /*head*/await getType(parameters[0], data.female.sex, "female"),
            /*eyebrow*/await getType(parameters[1], data.female.age, "female"),
            /*eyes*/await getType(parameters[2], data.female.suicides_no, "female"),
            /*nose*/await getType(parameters[3], data.female.population, "female"),
            /*mouth*/await getType(parameters[4], data.female.suicides_k_pop, "female"));


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
        const oneElementSize = [55, 100]
        const elementsInRow = Math.round(width / (oneElementSize[0] + 20))
        const rows = Math.ceil(allElementsLenght / elementsInRow)
        let currentElement = currentElementIndex + 1
        let iteratedElements = 1
        for (let i = 1; i <= rows; i++) { //rows
            for (let j = 1; j <= elementsInRow; j++) { //columns
                if (iteratedElements === currentElement) {
                    return [j * oneElementSize[0] - 50, i * oneElementSize[1] - 80]
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
    async function getType(parameterName, parameterValue, sex) {
        const worldDataAverage = await dataUtils.getAverageMaleFemaleDataForAllCountries(chernoffState.year)

        switch (parameterName) {
            case /*sex=head*/
            parameters[0]: {
                if (parameterValue === 'male') return 1
                else return 2
            }
            case /*age=eyebrow*/
            parameters[1]: {
                // const age = dataUtils.parseAge(parameterValue)
                const age = parameterValue
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
            case /*suicides_no=eyes*/
            parameters[2]: {
                let localToWorldSuicides = 0
                if (sex === "male") {
                    localToWorldSuicides = data.male.suicides_no / worldDataAverage.male.suicides_no
                } else {
                    localToWorldSuicides = data.male.suicides_no / worldDataAverage.female.suicides_no
                }
                if (localToWorldSuicides < downLimit) return 3
                if (localToWorldSuicides >= downLimit && localToWorldSuicides < upperLimit) return 1
                if (localToWorldSuicides >= upperLimit) return 2
                return 3

            }
            case /*population=nose*/
            parameters[3]: {
                let localToWorldPopulation = 0
                if (sex === "male") {
                    localToWorldPopulation = data.male.population / worldDataAverage.male.population
                } else {
                    localToWorldPopulation = data.male.population / worldDataAverage.female.population
                }
                if (localToWorldPopulation < downLimit) return 3
                if (localToWorldPopulation >= downLimit && localToWorldPopulation < upperLimit) return 1
                if (localToWorldPopulation >= upperLimit) return 2
                return 3

            }
            case /*suicides_k_pop=mouth*/
            parameters[4]: {
                let localToWorldSuicides_k_pop = 0
                if (sex === "male") {
                    localToWorldSuicides_k_pop = data.male.suicides_k_pop / worldDataAverage.male.suicides_k_pop
                } else {
                    localToWorldSuicides_k_pop = data.male.suicides_k_pop / worldDataAverage.female.suicides_k_pop
                }

                if (localToWorldSuicides_k_pop < downLimit) return 3
                if (localToWorldSuicides_k_pop >= downLimit && localToWorldSuicides_k_pop < upperLimit) return 1
                if (localToWorldSuicides_k_pop >= upperLimit) return 2
                return 3
            }
        }
    }


    return (
        <div className={"chernoff"}>
            {(data) &&
            <div className={"container"} style={{height: '500px'}}>
                <canvas className={"canvas"} ref={canvasRef}/>
            </div>}
            <ChernoffLegend getCoordinates={getCoordinates}/>
        </div>
    )
}

export default ChernoffFace