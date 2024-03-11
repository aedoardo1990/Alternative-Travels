import axios from "axios";

axios.defaults.baseURL = "https://alternative-travels-debb28d8ca03.herokuapp.com/"
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true; 