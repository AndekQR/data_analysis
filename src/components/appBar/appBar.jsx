import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import {CloudUpload} from "@material-ui/icons";
import DataLoaderService from "../../services/DataLoader.service.";
import "./style.scss"
import progressBarImage from "../../assets/progress.gif"

const MyAppBar = ({setData, progress}) => {

    let dataLoader = new DataLoaderService()
    const [file, setFile] = useState(null)
    const [progressBar, setProgressBar] = useState(progress)

    useEffect(() => {
        setProgressBar(progress)
    }, [progress])

    useEffect(() => {
        dataLoader.loadData(file)
            .then((value) => {
                setData(value)
            })
            .catch(error => {
                console.log(error.message)
            })
    }, [file])

    const selectFile = event => {
        setFile(event.target.files[0])
        event.preventDefault()
    }


    return (
        <div className={"root"}>
            <AppBar color={"secondary"} position="static">
                <Toolbar className={"toolbar"}>
                    { progressBar && <img className={"progressBar"} src={progressBarImage} alt={"progress..."}/> }
                    <div className={"buttons_container"}>
                        <input
                            accept=".csv"
                            className={"input"}
                            id="contained-button-file"
                            type="file"
                            style={{display: "none"}}
                            onChange={selectFile}
                            color={"secondary"}
                        />
                        <label htmlFor="contained-button-file">
                            {file && <span className={"fileName"}>{file.name}</span>}
                            <Button className={"button"} startIcon={<CloudUpload/>} variant="contained"
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