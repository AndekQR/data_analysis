import {progressBar} from "./progressBar.reducer";
import {chernoffFaces} from "./chernoffFaces.reducer";

const { combineReducers } = require("redux");

const rootReducer = combineReducers({
    progressBar,
    chernoffFaces
})

export default rootReducer