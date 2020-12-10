import React, {useEffect, useState} from "react";
import "./style.scss"
import MyAppBar from "../appBar/appBar";
import ChartOne from "../chartOne/chartOne";
import {Container, Grid} from "@material-ui/core";
import MapChart from "../mapChart/mapChart";
import DataUtils from "../../services/dataUtils.service";

const MainPage = () => {

    const [data, setData] = useState(null);
    const [progress, setProgress] = useState(false)
    const [dataUtils, setDataUtils] = useState(null)

    // useEffect(() => {
    //     console.log("progress updated: "+progress)
    // },[progress])

    useEffect(() => {
        if (data != null) {
            console.log("mainPage useeffect")
            setDataUtils(new DataUtils(data))
        }
    },[data])

    return (
        <div>
            <MyAppBar setData={setData} progress={progress}/>
            <Container fixed>
                {dataUtils &&
                <Grid container spacing={3} align={"center"} >
                    <Grid item xs={12} >
                        <ChartOne dataUtils={dataUtils} setProgress={setProgress}/>
                    </Grid>
                    <Grid item xs={12}>
                        <MapChart dataUtils={dataUtils} setProgress={setProgress}/>
                    </Grid>
                </Grid>
                }
            </Container>
        </div>

    )
}

export default MainPage