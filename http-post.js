import http from 'k6/http';
import { check } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function () {

    const credentials = {
        username: 'test_' + randomString(8),
        password: 'secret_' + randomString(8),
    }

    //register
    http.post(
        'https://test-api.k6.io/user/register/',
        JSON.stringify(credentials),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    //login
    let res = http.post(
        'https://test-api.k6.io/auth/token/login/',
        JSON.stringify(
            {
                username: credentials.username,
                password: credentials.password
            }
        ),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    const accessToken = res.json().access;
    console.log(accessToken);

    //get all existing crocodiles
    http.get(
        'https://test-api.k6.io/my/crocodiles/',
        {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }
    );

    //create new crocodile
    let newCrocodile = http.post(
        'https://test-api.k6.io/my/crocodiles/',
        JSON.stringify(
            {
                name: 'Random croc',
                sex: 'M',
                date_of_birth: '1900-10-28'
            }
        ),
        {
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        }
    );    

    const newCrocodileId = newCrocodile.json().id;

    //get created crocodile
    let crocodile = http.get(
        `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
        {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }
    );

    // check(crocodile, {
    //     'status is 200': (c) =>  c.status === 200,
    //     'crocodile id is correct': (c) =>  c.json().id === newCrocodileId
    // });

    const updatedName = 'Updted Random croc';

    let updatedCrocodile = http.put(
        `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
        JSON.stringify(
            {
                name: updatedName,
                sex: 'M',
                date_of_birth: '1900-10-28'
            }
        ),
        {
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        }
    );  
    
    // check(updatedCrocodile, {
    //     'status is 200': (uc) =>  uc.status === 200,
    //     'crocodile id is correct': (uc) =>  uc.json().id === newCrocodileId,
    //     'crocodile name is updated': (uc) =>  uc.json().name === updatedName
    // });

    //delete
    crocodile = http.del(
        `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
        null,
        {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }
    );

    check(crocodile, {
        'status is 204': (c) =>  c.status === 204
    });
}