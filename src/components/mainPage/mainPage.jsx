import React, {useEffect, useState} from "react";
import "./style.scss"
import MyAppBar from "../appBar/appBar";
import ChartOne from "../chartOne/chartOne";
import {Container, Grid} from "@material-ui/core";
import MapChart from "../mapChart/mapChart";
import DataUtils from "../../services/dataUtils.service";
import {useDispatch} from "react-redux";
import {progressBarActions} from "../../redux/actions/progressBar.actions";
import ChernoffsFacesChart from "../chernoffsFacesChart/chernoffsFacesChart";

const MainPage = () => {

    const [data, setData] = useState(null);
    const [dataUtils, setDataUtils] = useState(null)

    // useEffect(() => {
    //     console.log("progress updated: "+progress)
    // },[progress])

    const dispatch = useDispatch()

    useEffect(() => {
        if (data != null) {
            dispatch(progressBarActions.showProgressBar())
            setDataUtils(new DataUtils(data))
        }
    },[data])

    useEffect(() => {
        dispatch(progressBarActions.hideProgressBar())
    }, [dataUtils])

    return (
        <div>
            <MyAppBar setData={setData} />
            <Container fixed>
                {dataUtils &&
                <Grid container spacing={3} align={"center"} >
                    {/*<Grid item xs={12} >*/}
                    {/*    <ChartOne dataUtils={dataUtils}/>*/}
                    {/*</Grid>*/}
                    {/*<Grid item xs={12}>*/}
                    {/*    <MapChart dataUtils={dataUtils}/>*/}
                    {/*</Grid>*/}
                    <Grid item xs={12}>
                        <ChernoffsFacesChart dataUtils={dataUtils}/>
                    </Grid>
                </Grid>
                }
            </Container>
        </div>

    )
}

export default MainPage