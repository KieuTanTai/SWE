import axios from "axios";
import Account from "../interfaces/account"
async function login(): Account {
    try {
        const result = await axios.post('http:localhost:3000/api/login')
    } catch (error) {
        if (error instanceof Error)
            console.error(error.message);
    }
}