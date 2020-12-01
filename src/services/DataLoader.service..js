import Papa from "papaparse/papaparse"

class DataLoaderService {

    #data
    #file

    loadData(file) {
        this.#file = file
        return new Promise(resolve => {
            Papa.parse(this.#file, {
                header: true,
                worker: true,
                complete: function (result) {
                    this.data = result.data
                    resolve(result.data)
                }.bind(this),
                error: function (error, file) {
                    resolve(error)
                }
            })
        })
    }

    get getData() {
        return this.#data
    }
}

export default DataLoaderService