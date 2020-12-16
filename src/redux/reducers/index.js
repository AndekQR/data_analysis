import {progressBar} from "./progressBar.reducer";

const { combineReducers } = require("redux");

const rootReducer = combineReducers({
    progressBar
})

export default rootReducer