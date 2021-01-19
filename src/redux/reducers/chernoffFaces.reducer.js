const initialState = {
    country: "",
    year: "",
    visible: false
}

export function chernoffFaces(state = initialState, action) {
    switch (action.type) {
        case 'SHOW_CHERNOFF_FACES': {
            return {
                country: action.country,
                year: action.year,
                visible: true
            }
        }
        case 'HIDE_CHERNOFF_FACES': {
            return {
                visible: false
            }
        }
        default:
            return state
    }
}