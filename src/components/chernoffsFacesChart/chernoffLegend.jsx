import React, {useEffect, useRef} from 'react'
import "./style.scss"
import {ChernoffElements} from "./chernoffElements";

const ChernoffLegend = ({getCoordinates}) => {

    const numberOfProperties = Object.keys(ChernoffElements).length
    const canvasRef = useRef(null)

    useEffect(() => {
        drawLegend()
    }, []);


    function drawLegend() {
        const dynamicCanvas = canvasRef.current
        if (dynamicCanvas == null) return null
        const ctx = dynamicCanvas.getContext('2d')
        const container = document.getElementsByClassName('container')[0]
        dynamicCanvas.height = 250
        dynamicCanvas.width = 350

        ctx.clearRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);


        ctx.fillText("Number of suicides between 25% and 75% of all suicides", 10, 10)
        ChernoffElements.drawEyes(ctx, 270, -8, 1)
        ctx.fillText("More than 75% of all suicides", 10, 25)
        ChernoffElements.drawEyes(ctx, 140, 5, 2)
        ctx.fillText("Less than 25% of all suicides", 10, 40)
        ChernoffElements.drawEyes(ctx, 140, 23, 3)

        ctx.fillText("Number of population between 25% and 75% of all population", 10, 60)
        ChernoffElements.drawNose(ctx, 270, 35, 1)
        ctx.fillText("More than 75% of all population", 10, 75)
        ChernoffElements.drawNose(ctx, 140, 48, 2)
        ctx.fillText("Less than 25% of all population", 10, 90)
        ChernoffElements.drawNose(ctx, 140, 61, 3)

        ctx.fillText("Number of suicides per 100k population between 25% and 75% ", 10, 110)
        ChernoffElements.drawMouth(ctx, 290, 70, 1)
        ctx.fillText("More than 75% of all suicides per 100k population", 10, 125)
        ChernoffElements.drawMouth(ctx, 220, 83, 2)
        ctx.fillText("Less than 25% of all suicides per 100k population", 10, 140)
        ChernoffElements.drawMouth(ctx, 220, 96, 3)

        ctx.fillText("Age between 25 and 55", 10, 160)
        ChernoffElements.drawEyebrow(ctx, 120, 145, 1)
        ctx.fillText("Age between 0 and 25", 10, 175)
        ChernoffElements.drawEyebrow(ctx, 110, 165, 2)
        ctx.fillText("Age greater than 55", 10, 190)
        ChernoffElements.drawEyebrow(ctx, 100, 180, 3)

        ctx.fillText("Male", 10, 230)
        ChernoffElements.drawHead(ctx, 40, 200, 1)

        ctx.fillText("Female", 90, 230)
        ChernoffElements.drawHead(ctx, 130, 200, 2)


    }

    return (
        <div className={"chernoffLegend container"}>
            <canvas className={"canvas"} ref={canvasRef}/>
        </div>
    )
}

export default ChernoffLegend