import axios from "axios";


const BACKEND_URL = "http://localhost:3000"
const WS_URL = "ws://localhost:3001"
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
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
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
            username: username + "-user",
            password,
            type: 'user'
        })


        userId = UsersignupResponse.data.userId;

        const Userresponse  = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username: username + "-user",
            password
        })

        userToken = Userresponse.data.token;


        const element1Response =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png",
            "width": 1,
            "height": 1,
            "static": true
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        const element2Response =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png",
            "width": 1,
            "height": 1,
            "static": true
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        element1Id = element1Response.data.id
        element2Id = element2Response.data.id

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
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

        mapId = mapResponse.data.id;
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

describe('Arena Endpoints', () => {
    let mapId;
    let element1Id;
    let element2Id;
    let adminToken;
    let adminId;
    let userToken;
    let userId;
    let spaceId;

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
            username: username + "-user",
            password,
            type: 'user'
        })


        userId = UsersignupResponse.data.userId;

        const Userresponse  = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username: username + "-user",
            password
        })

        userToken = Userresponse.data.token;


        const element1Response =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png",
            "width": 1,
            "height": 1,
            "static": true
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        const element2Response =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png",
            "width": 1,
            "height": 1,
            "static": true
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        element1Id = element1Response.data.id
        element2Id = element2Response.data.id

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
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

        mapId = mapResponse.data.id;

        const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "test",
            "dimensions": "100x200",
            "mapId": "mapId"
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        spaceId = spaceResponse.data.spaceId

    })

    test('Incorrect spaceId returns a 400', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/1235454`,{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });

        expect(response.statusCode).toBe(400)
    })

    test('Correct spaceId returns all the elements', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });

        expect(response.data.dimensions).toBe("100x200")
        expect(response.data.elements.length).toBe(3)
    })

    test('delete element', async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });

        await axios.delete(`${BACKEND_URL}/api/v1/space/element`,{
            spaceId:spaceId,
            elementId: response.data.element[0].id
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });

        expect(newResponse.data.elements.length).toBe(2)
    })

    test('Adding an element fails if the element lies outside the dimensions', async () => {
        await axios.post(`${BACKEND_URL}/api/v1/space/element`,{
           "elementId": element1Id,
           "spaceId": spaceId,
           "x": 1000000,
           "y": 200000
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });

        expect(newResponse.statusCode).toBe(400)
    })

    test('Adding an element works as expected', async () => {
        await axios.post(`${BACKEND_URL}/api/v1/space/element`,{
           "elementId": element1Id,
           "spaceId": spaceId,
           "x": 50,
           "y": 20
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });

        expect(newResponse.data.elements.length).toBe(3)
    })
})

describe('Admin Endpoints', () => {
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
            username: username + "-user",
            password,
            type: 'user'
        })


        userId = UsersignupResponse.data.userId;

        const Userresponse  = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username: username + "-user",
            password
        })

        userToken = Userresponse.data.token;
    })

    test('User is not able to hit admin Endpoints', async () => {
        
        const elementResponse =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png",
            "width": 1,
            "height": 1,
            "static": true
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
            "thumbnail": "https://docs.techsoft3d.com/communicator/latest/_images/floorplan_colors.PNG",
            "dimensions": "100x200",
            "defaultElements": []
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        
        const createAvatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl": "https://www.clipartmax.com/png/middle/198-1988062_customize-your-avatar-with-the-roblox-girl-and-millions-roblox-character-no.png",
            "name": "Timmy"
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })


        const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png"
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        expect(elementResponse.statusCode).toBe(403)
        expect(mapResponse.statusCode).toBe(403)
        expect(createAvatarResponse.statusCode).toBe(403)
        expect(updateElementResponse.statusCode).toBe(403)
    })

    test('Admin is able to hit admin Endpoints', async () => {
        
        const elementResponse =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png",
            "width": 1,
            "height": 1,
            "static": true
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })
        

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
            "thumbnail": "https://docs.techsoft3d.com/communicator/latest/_images/floorplan_colors.PNG",
            "dimensions": "100x200",
            "defaultElements": []
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        
        const createAvatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl": "https://www.clipartmax.com/png/middle/198-1988062_customize-your-avatar-with-the-roblox-girl-and-millions-roblox-character-no.png",
            "name": "Timmy"
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        expect(elementResponse.statusCode).toBe(200)
        expect(mapResponse.statusCode).toBe(200)
        expect(createAvatarResponse.statusCode).toBe(200)
    })

    test('Admin is able to update the imageUrl for an element', async () => {

        const elementResponse =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png",
            "width": 1,
            "height": 1,
            "static": true
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png"
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        expect(updateElementResponse.statusCode).toBe(200)
    })
})

describe('Web Socket Tests', () => {
    let adminToken;
    let adminUserId;
    let userToken;
    let userId;
    let mapId;
    let element1Id;
    let element2Id;
    let spaceId;
    let ws1;
    let ws2;
    let ws1Messages = [];
    let ws2Messages = [];
    let userX;
    let userY;
    let adminX;
    let adminY;

    async function waitForandPopLatestMessage(messageArray) {
        return new Promise(r =>{
            if(messageArray.length > 0) {
                 resolve(messageArray.shift())
            } else {
                let interval = setInterval(() => {
                    if(messageArray.length > 0) {
                        resolve(messageArray.shift())
                        clearInterval(interval)
                    }
                },100)
            }
        })
    }

    async function setupHTTP() {
        const username = `sandip-${Math.random()}`
        const password = "123456"

        const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            role: "admin"
        })

        const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })

        adminUserId = adminSignupResponse.data.userId;
        adminToken = adminSigninResponse.data.token;




        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username: username + '-user',
            password
        })

        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username: username + '-user',
            password
        })

        userId = userSignupResponse.data.userId;
        userToken = userSigninResponse.data.token;


        const element1Response =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png",
            "width": 1,
            "height": 1,
            "static": true
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        const element2Response =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://i.pinimg.com/originals/e7/2b/a5/e72ba56b00e8b4afe762ca053c7faa6d.png",
            "width": 1,
            "height": 1,
            "static": true
        },{
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        element1Id = element1Response.data.id
        element2Id = element2Response.data.id

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
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

        mapId = mapResponse.data.id;

        const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "test",
            "dimensions": "100x200",
            "mapId": "mapId"
        },{
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        spaceId = spaceResponse.data.spaceId
    }

    async function setupWs() {
        ws1 = new WebSocket(WS_URL)

        await new Promise(r => {
            ws1.onopen = r
        })

        ws1.onmessage = (event) => {
            ws1Messages.push(JSON.parse(event.data))
        }

        ws2 = new WebSocket(WS_URL)

        await new Promise(r => {
            ws2.onopen = r
        })

        ws2.onmessage = (event) => {
            ws2Messages.push(JSON.parse(event.data))
        }
    }

    beforeAll(async () => {
        setupHTTP()
        setupWs()
    })

    test('Get back ack for joining the space',async () => {

        ws1.send(JSON.stringify({
            "type": "join",
            "payload": {
                "spaceId": spaceId,
                "token": adminToken
            }
        }))
        const message1 = await waitForandPopLatestMessage(ws1Messages)

        ws2.send(JSON.stringify({
            "type": "join",
            "payload": {
                "spaceId": spaceId,
                "token": userToken
            }
        }))

        const message2 = await waitForandPopLatestMessage(ws2Messages)
        const message3 = await waitForandPopLatestMessage(ws1Messages)

        expect(message1.type).toBe("space-joined")
        expect(message2.type).toBe("space-joined")
        expect(message1.payload.users.length).toBe(0)
        expect(message2.payload.users.length).toBe(1)
        expect(message3.type).toBe("user-join")
        expect(message3.payload.x).toBe(message2.payload.spawn.x)
        expect(message3.payload.y).toBe(message3.payload.spawn.y)
        expect(message3.payload.userId).toBe(userId)

        adminX = message1.payload.spawn.x;
        adminY = message1.payload.spawn.y;

        userX = message2.payload.spawn.x;
        userY = message2.payload.spawn.y;

    })

    test('User should not be able to move across the boundary of the wall',async () => {
        ws1.send(JSON.stringify({
            type: "movement",
            payload: {
                x: 100000,
                y: 10000
            }
        }))

        const message = await waitForandPopLatestMessage(ws1Messages)
        expect(message.type).toBe("movement-rejected")
        expect(message.payload.x).toBe(adminX)
        expect(message.payload.y).toBe(adminY)
    })

    test('User should not be able to move two blocks at the same time',async () => {
        ws1.send(JSON.stringify({
            type: "movement",
            payload: {
                x: adminX + 2,
                y: adminY
            }
        }))

        const message = await waitForandPopLatestMessage(ws1Messages)
        expect(message.type).toBe("movement-rejected")
        expect(message.payload.x).toBe(adminX)
        expect(message.payload.y).toBe(adminY)
    })

    test('User should be able to move and broadcasted to other users',async () => {
        ws1.send(JSON.stringify({
            type: "movement",
            payload: {
                x: adminX + 1,
                y: adminY,
                userId: adminUserId
            }
        }))

        const message = await waitForandPopLatestMessage(ws2Messages)
        expect(message.type).toBe("movement")
        expect(message.payload.x).toBe(adminX + 1)
        expect(message.payload.y).toBe(adminY)
    })

    test('If a user leaves it should be shown to other users',async () => {
        ws1.close()
        const message = await waitForandPopLatestMessage(ws2Messages)
        expect(message.type).toBe("user-left")
        expect(message.payload.userId).toBe(adminUserId)
    })
})