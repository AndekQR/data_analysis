import React, {useEffect, useState} from "react";
import "./style.scss"
import MyAppBar from "../appBar/appBar";
import AreaAgeChart from "../chartOne/areaAgeChart";
import {Grid} from "@material-ui/core";
import MapChart from "../mapChart/mapChart";
import DataUtils from "../../services/dataUtils.service";
import {useDispatch} from "react-redux";
import {progressBarActions} from "../../redux/actions/progressBar.actions";
import ChernoffsFacesChart from "../chernoffsFacesChart/chernoffsFacesChart";
import MyBarChart from "../barChart/myBarChart"
import PopulationPyramidChart from "../populationPyramidChart/populationPyramidChart";

const MainPage = () => {

    const [data, setData] = useState(null);
    const [dataUtils, setDataUtils] = useState(null)

    const dispatch = useDispatch()

    useEffect(() => {
        if (data != null) {
            dispatch(progressBarActions.showProgressBar())
            let dataUtilsTmp = new DataUtils(data)
            setDataUtils(dataUtilsTmp)
        }
    }, [data])

    useEffect(() => {
        dispatch(progressBarActions.hideProgressBar())
    }, [dataUtils])

    return (
        <div>
            <MyAppBar setData={setData}/>
            {dataUtils &&
            <Grid container spacing={3} alignItems={"center"} justify={"center"}>
                <Grid item xs={12} md={6} xl={4}>
                    <AreaAgeChart dataUtils={dataUtils}/>
                </Grid>
                <Grid item xs={12} md={8}>
                    <MapChart dataUtils={dataUtils}/>
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    <ChernoffsFacesChart dataUtils={dataUtils}/>
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    <MyBarChart dataUtils={dataUtils}/>
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    <PopulationPyramidChart dataUtils={dataUtils}/>
                </Grid>
            </Grid>
            }
        </div>

    )
}

export default MainPage