import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import Button from "@material-ui/core/Button";
import {CloudUpload} from "@material-ui/icons";
import DataLoaderService from "../../services/DataLoader.service.";
import "./style.scss"

const MyAppBar = ({setData}) => {

    let dataLoader = new DataLoaderService()
    let file;

    const selectFile = event => {
        event.preventDefault()
        file = event.target.files[0];
        dataLoader.loadData(file).then((value) => {
            setData(value)
        })
    }


    return (
        <div className={"root"}>
            <AppBar color={"secondary"} position="static">
                <Toolbar className={"toolbar"}>
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