import React, {useEffect, useState} from "react";
import "./style.scss"
import MyAppBar from "../appBar/appBar";

const MainPage = () => {

    const [data, setData] = useState(null);

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <div>
            <MyAppBar setData={setData}/>
        </div>

    )
}

export default MainPage