import axios from "axios";


const BACKEND_URL = "http://localhost:3000"

// describe blocks
describe("Authentication",()=>{
    test('User is able to sign up only once', async () => {
        const username = "sandip" + Math.random();
        const password = "123456";
        const type = "admin";
        const response  = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type
        })
        expect(response.statusCode).toBe(200)

        const Updatedresponse  = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type
        })
        expect(Updatedresponse.statusCode).toBe(400)
    });

    test('Signup request fails if the username is empty', async () => {
        const username = `sandip+${Math.random()}`
        const passsword = "123456"

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            passsword
        })

        expect(response.statusCode).toBe(400)
    })

    test('Signin succeds if the username and password are correct', async () => {
        const username = `Sandip-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBeDefined()

    })

    test('Signin fails if the username and password are incorrect', async () => {
        const username = `Sandip-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username: "Wrongusername",
            password
        })

        expect(response.statusCode).toBe(403)
    })
})


describe("User Information endpoints", () => {
    
})