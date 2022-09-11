import axios from '../../../axios';


export async function request(url = '/users',method = 'POST', data = null, headers = null) {
    try {
        const response = await axios({url, method, data, headers})
        return response.data
    } catch (error) {
        throw error
    }
}