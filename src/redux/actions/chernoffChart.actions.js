function showChernoffFaces(country, year) {
    return {
        country,
        year,
        type: "SHOW_CHERNOFF_FACES"
    }
}

function hideChernoffFaces() {
    return {
        type: "HIDE_CHERNOFF_FACES"
    }
}

export const chernoffFacesActions = {
    showChernoffFaces,
    hideChernoffFaces
}