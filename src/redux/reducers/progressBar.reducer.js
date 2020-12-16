const initialState = {
    visible: false
}

export function progressBar(state = initialState, action) {
    switch (action.type) {
        case 'SHOW_PROGRESS_BAR': {
            return {
                visible: action.visible
            }
        }
        case 'HIDE_PROGRESS_BAR' : {
            return {
                visible: action.visible
            }
        }
        default:
            return state
    }
}