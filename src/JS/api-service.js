import axios from "axios"


const API_KEY = '38021332-8e9737bba173cb2c49ad632d1';
 const BASE_URL = 'https://pixabay.com/api/';
// axios.defaults.baseURL = 'https://pixabay.com/api/';

const PARAMETERS = 'per_page=40&orientation=horizontal&image_type=photo&safesearch=true';

export default class ApiServiceConstructor{
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    async fetchApiService() {
        try {
            const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&${PARAMETERS}`);

            const data = await response.data;
            this.incrementPage();
            return data;
        } catch {
            throw new Error(response.status)
        }
    }

    // Після запиту збільшуємо сторінку на 1
    incrementPage() {
        this.page += 1;
    }
    // Метод який скидує сторінку на 1
    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}


