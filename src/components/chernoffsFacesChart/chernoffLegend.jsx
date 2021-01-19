import React, {useEffect, useRef} from 'react'
import "./style.scss"
import {ChernoffElements} from "./chernoffElements";

const ChernoffLegend = ({getCoordinates}) => {

    const canvasRef = useRef(null)

    useEffect(() => {
        drawLegend()
    }, []);


    function drawLegend() {
        const dynamicCanvas = canvasRef.current
        if (dynamicCanvas == null) return null
        const ctx = dynamicCanvas.getContext('2d')
        dynamicCanvas.height = 250
        dynamicCanvas.width = 500

        ctx.clearRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);


        ctx.fillText("Ratio of the number of suicides to the world average between 0.7 and 1.3", 10, 10)
        ChernoffElements.drawEyes(ctx, 330, -8, 1)
        ctx.fillText("Ratio of the number of suicides to the world average grater than 1.3", 10, 25)
        ChernoffElements.drawEyes(ctx, 310, 5, 2)
        ctx.fillText("Ratio of the number of suicides to the world average lower than 0.7", 10, 40)
        ChernoffElements.drawEyes(ctx, 310, 23, 3)

        ctx.fillText("Ratio of the population to the world average between 0.7 and 1.3", 10, 60)
        ChernoffElements.drawNose(ctx, 290, 35, 1)
        ctx.fillText("Ratio of the population to the world average grater than 1.3", 10, 75)
        ChernoffElements.drawNose(ctx, 280, 48, 2)
        ctx.fillText("Ratio of the population to the world average lower than 0.7", 10, 90)
        ChernoffElements.drawNose(ctx, 280, 61, 3)

        ctx.fillText("Ratio of the suicides per 100k of population to the world average between 0.7 and 1.3", 10, 110)
        ChernoffElements.drawMouth(ctx, 390, 70, 1)
        ctx.fillText("Ratio of the suicides per 100k of population to the world average grater than 1.3", 10, 125)
        ChernoffElements.drawMouth(ctx, 370, 83, 2)
        ctx.fillText("Ratio of the suicides per 100k of population to the world average lower than 0.7", 10, 140)
        ChernoffElements.drawMouth(ctx, 370, 96, 3)

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