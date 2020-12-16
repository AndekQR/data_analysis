import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";

const { createStore } = require("redux");
const composeEnhancers = composeWithDevTools({
    trace: true,
    traceLimit: 25
})

const store = createStore(
    rootReducer,
    composeEnhancers()
    )
export default store