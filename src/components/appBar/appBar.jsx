import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import {CloudUpload} from "@material-ui/icons";
import DataLoaderService from "../../services/DataLoader.service.";
import "./style.scss"
import progressBarImage from "../../assets/progress.gif"
import {useDispatch, useSelector} from "react-redux";
import {progressBarActions} from "../../redux/actions/progressBar.actions";

const MyAppBar = ({setData}) => {

    let dataLoader = new DataLoaderService()
    const [file, setFile] = useState(null)
    const progressBarState = useSelector(state => state.progressBar)
    const dispatch = useDispatch()

    useEffect(() => {
        if (file != null) {
            dispatch(progressBarActions.showProgressBar())
            dataLoader.loadData(file)
                .then((value) => {
                    setData(value)
                    dispatch(progressBarActions.hideProgressBar())
                })
                .catch(error => {
                    console.log(error.message)
                    dispatch(progressBarActions.hideProgressBar())
                })
        }
    }, [file])

    const selectFile = event => {
        dispatch(progressBarActions.showProgressBar())
        setFile(event.target.files[0])
        dispatch(progressBarActions.hideProgressBar())
    }

    const onCancelInputWindow = () => {
        window.removeEventListener('focus', onCancelInputWindow)
        dispatch(progressBarActions.hideProgressBar())
    }


    return (
        <div className={"root"}>
            <AppBar color={"secondary"} position="static">
                <Toolbar className={"toolbar"}>
                    {(progressBarState.visible === true) &&
                    <img className={"progressBar"} src={progressBarImage} alt={"progress..."}/>}
                    <div className={"buttons_container"}>
                        <input
                            accept=".csv"
                            className={"input"}
                            id="contained-button-file"
                            type="file"
                            style={{display: "none"}}
                            onChange={selectFile}
                        />
                        <label htmlFor="contained-button-file">
                            {file && <span className={"fileName"}>{file.name}</span>}
                            <Button onClick={() => {
                                dispatch(progressBarActions.showProgressBar())
                                // window.addEventListener('focus', onCancelInputWindow)
                            }} className={"button"} startIcon={<CloudUpload/>} variant="contained"
                                    color={"primary"} component="span">
                                Choose data file
                            </Button>
                        </label>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default MyAppBar