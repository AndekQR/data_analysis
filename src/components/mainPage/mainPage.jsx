import React, {useEffect, useState} from "react";
import "./style.scss"
import MyAppBar from "../appBar/appBar";
import ChartOne from "../chartOne/chartOne";

const MainPage = () => {

    const [data, setData] = useState(null);
    const [progress, setProgress] = useState(false)

    useEffect(() => {
        console.log("progress updated: "+progress)
    },[progress])


    return (
        <div>
            <MyAppBar setData={setData} progress={progress}/>
            {data &&
            <ChartOne data={data} setProgress={setProgress}/>
            }
        </div>

    )
}

export default MainPage