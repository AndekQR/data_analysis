import React, {useEffect, useState} from "react";
import "./style.scss"
import MyAppBar from "../appBar/appBar";
import AreaAgeChart from "../chartOne/areaAgeChart";
import {Grid, GridList, GridListTile, isWidthUp} from "@material-ui/core";
import MapChart from "../mapChart/mapChart";
import DataUtils from "../../services/dataUtils.service";
import {useDispatch} from "react-redux";
import {progressBarActions} from "../../redux/actions/progressBar.actions";
import ChernoffsFacesChart from "../chernoffsFacesChart/chernoffsFacesChart";
import MyBarChart from "../barChart/myBarChart"
import PopulationPyramidChart from "../populationPyramidChart/populationPyramidChart";

const MainPage = (props) => {

    const [data, setData] = useState(null);
    const [dataUtils, setDataUtils] = useState(null)

    const dispatch = useDispatch()

    const getGridListCols = () => {
        if (isWidthUp('xl', props.width)) {
            return 3;
        }

        if (isWidthUp('lg', props.width)) {
            return 2;
        }

        if (isWidthUp('md', props.width)) {
            return 1;
        }

        return 1;
    }

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
        <div className={"mainPage"}>
            <MyAppBar setData={setData}/>
            {dataUtils &&
            <Grid container spacing={3}  justify={"center"} className={"itemContainer"}>
                <Grid item xs={12} md={8}>
                    <MapChart dataUtils={dataUtils}/>
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    <AreaAgeChart dataUtils={dataUtils}/>
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    <MyBarChart dataUtils={dataUtils}/>
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    <ChernoffsFacesChart dataUtils={dataUtils}/>
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    <PopulationPyramidChart dataUtils={dataUtils}/>
                </Grid>
            </Grid>
            //     <GridList cellHeight={300} spacing={4} cols={() => getGridListCols()} className={"gridList"} >
            //         <GridListTile cols={0} rows={2.5}>
            //             <MapChart dataUtils={dataUtils}/>
            //         </GridListTile>
            //         <GridListTile cols={1} rows={2}>
            //             <AreaAgeChart dataUtils={dataUtils}/>
            //         </GridListTile>
            //         <GridListTile cols={1} rows={2}>
            //             <MyBarChart dataUtils={dataUtils}/>
            //         </GridListTile>
            //         <GridListTile cols={1} rows={2}>
            //             <ChernoffsFacesChart dataUtils={dataUtils}/>
            //         </GridListTile>
            //         <GridListTile cols={1} rows={2}>
            //             <PopulationPyramidChart dataUtils={dataUtils}/>
            //         </GridListTile>
            //
            //     </GridList>
            }
        </div>

    )
}

export default MainPage