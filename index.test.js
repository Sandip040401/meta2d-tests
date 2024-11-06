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

describe("User metadata endpoints", () => {
    let token = "";
    let avatarId = "";
    beforeAll(async () => {
        const username = `Sandip-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type: 'admin'
        })

        const response  = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        token = response.data.token;

        const avatarResponse  = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.clipartmax.com%2Fmiddle%2Fm2i8b1d3H7A0H7i8_customize-your-avatar-with-the-roblox-girl-and-millions-roblox-character-no%2F&psig=AOvVaw1gbolGa4biPtriujjMJnHQ&ust=1731003964841000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCnyrWqyIkDFQAAAAAdAAAAABAJ",
            "name": "Timmy"
        })

        avatarId = avatarResponse.data.avatarId;
    })

    test('User cant update there metadata with a wrong avatar id',async () =>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId: "1212121"
        },{
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(response.statusCode).toBe(400)
    })

    test('User can update there metadata with right avatar Id',async () =>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId
        },{
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(response.statusCode).toBe(200)
    })

    test('User cant update there metadata if user doesnot send token',async () =>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId
        })

        expect(response.statusCode).toBe(403)
    })
})

describe("User avatar Information", () => {
    let token = "";
    let avatarId = "";
    let userId = "";

    beforeAll(async () => {
        const username = `Sandip-${Math.random()}`
        const password = "123456"

        const signupResponse  = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type: 'admin'
        })

        userId = signupResponse.data.userId;

        const response  = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        token = response.data.token;

        const avatarResponse  = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl": "https://www.clipartmax.com/png/middle/198-1988062_customize-your-avatar-with-the-roblox-girl-and-millions-roblox-character-no.png",
            "name": "Timmy"
        })

        avatarId = avatarResponse.data.avatarId;
    })

    test('Get back avatar information for a user',async () => {
        const response  = axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);

        expect(response.data.avatars.length).toBe(1)
        expect(response.data.avatars[0].userId).toBe(userId)
    })

    test('Available avatars lists the recently created avatar',async () => {
        const response  = axios.get(`${BACKEND_URL}/api/v1/avatars`);

        expect(response.data.avatars.length).not.toBe(0)
        const currentAvatar = response.data.avatars.find(x => x.id == avatarId);

        expect(currentAvatar).toBeDefined()
    })


})

describe("Space information", () => {
    let mapId;
    let element1Id;
    let element2Id;
    let adminToken;
    let adminId;
    let userToken;
    let userId;

    beforeAll(async () => {
        const username = `Sandip-${Math.random()}`
        const password = "123456"

        const signupResponse  = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type: 'admin'
        })


        adminId = signupResponse.data.userId;

        const response  = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        adminToken = response.data.token;



        const UsersignupResponse  = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type: 'user'
        })


        userId = UsersignupResponse.data.userId;

        const Userresponse  = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        userToken = Userresponse.data.token;


        const element1 =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png",
            "width": 1,
            "height": 1,
            "static": true
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        const element2 =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png",
            "width": 1,
            "height": 1,
            "static": true
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        element1Id = element1.id
        element2Id = element2.id

        const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
            "thumbnail": "https://docs.techsoft3d.com/communicator/latest/_images/floorplan_colors.PNG",
            "dimensions": "100x200",
            "defaultElements": [{
                elementId: element1Id,
                x: 20,
                y: 20
            },{
                elementId: element1Id,
                x: 18,
                y: 20
            },{
                elementId: element2Id,
                x: 19,
                y: 20
            }]
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        mapId = map.id;
    })

    test('User is able to create a space', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(response.spaceId).toBeDefined()
    })

    test('User is able to create a space without mapId', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "Test",
            "dimensions": "100x200"
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(response.spaceId).toBeDefined()
    })

    test('User is not able to create a space without mapId and dimensions', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "Test"
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(response.statusCode).toBe(400)
    })

    test('User is not able to delete a space that doesnot exist', async () => {
        const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesnotExist`,{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(response.statusCode).toBe(400)
    })

    test('User should be able to delete a space that does exist', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "test",
            "dimensions": "100x200"
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(deleteResponse.statusCode).toBe(200)
    })


    test('User should not be able to delete a someone else space', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "test",
            "dimensions": "100x200"
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        expect(deleteResponse.statusCode).toBe(400)
    })

    test('Admin has no spaces initially', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`,{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(response.data.spaces.length).toBe(0)
    })

    test('Admin has no spaces initially', async () => {
        const spaceCreateResponse = await axios.post(`${BACKEND_URL}/api/v1/space/all`,{
            "name": 'Test',
            "dimensions": "100x200"
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`,{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        const filteredSpace = response.data.spaces.find(x => x.id == spaceCreateResponse.spaceId)

        expect(response.data.spaces.length).toBe(1)
        expect(filteredSpace).toBeDefined()
    })
    
})