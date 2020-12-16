
function showProgressBar() {
    return {
        visible: true,
        type: 'SHOW_PROGRESS_BAR'
    }
}

function hideProgressBar() {
    return {
        visible: false,
        type:'HIDE_PROGRESS_BAR'
    }
}

export const progressBarActions = {
    showProgressBar,
    hideProgressBar
}