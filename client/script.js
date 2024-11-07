async function login(event) {
    event.preventDefault();
    try {
        let body = {
            email : document.getElementById('email').value,
            password : document.getElementById('password').value,
        }
        let str_body = JSON.stringify(body);
        console.log("str_body : ",str_body);
        let response = await fetch('/login',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : str_body
        });
        let parsed_response = await response.json();
        console.log("parsed_response : ",parsed_response);
        let data = parsed_response.data;
        console.log("data : ",data);
        let token = data.token;
        let user_type = data.user_type;
        console.log("user_type:  ",user_type);
        let id = data.id;
        let token_key = id;
        let password_count = data.password_count;
        let login_count = data.login_count;
    
        localStorage.setItem(token_key, token);
        if(user_type === 'Admin') {
            alert(parsed_response.message);
            window.location = `admin.html?id=${token_key}`
        }
        else if(user_type === 'Employee'){
            if(password_count === 0 && login_count === 0 || password_count === 0 && login_count === null){
                window.location = `resetPassword.html?auth_id=${token_key}`;
            }else{
                alert(parsed_response.message);
                window.location = `employee.html?auth_id=${token_key}`;
            }
        }else{
            alert("something went wrong");
        }
    } catch (error) {
        console.log("error : ",error);
    }
}

let formdisplay = 0;
function displayAddForm(){
    formdisplay = formdisplay+1;
    if(formdisplay%2 == !0) {
        document.getElementById('addForm').style.display = "block";
    }else{
        document.getElementById('addForm').style.display = "none";
    }
}

async function addUser(event) {
    event.preventDefault();

    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let id = url_params.get("auth_id");
    let token_key = id;
    let token = localStorage.getItem(token_key);

    let name = document.getElementById('name').value;
    console.log("name : ",name);
    if(!name) {
        document.getElementById('name-warning').innerHTML = "name is required";
        return;
    }
    let email = document.getElementById('email').value;
    console.log("email : ",email);
    if(!email) {
        document.getElementById('email-warning').innerHTML = "email is required";
        return;
    }
    let age = document.getElementById('age').value;
    if(!age) {
        document.getElementById('age-warning').innerHTML = "age is required";
        return;
    }
    if(document.getElementById('image').files[0] === undefined){
        body = {
            name : document.getElementById('name').value,
            email : document.getElementById('email').value,
            age : document.getElementById('age').value
        }
    }else {
        let file = document.getElementById('image').files[0];

        // Use a Promise to wait for FileReader to finish reading the file
        body = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                resolve({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    age: document.getElementById('age').value,
                    image: e.target.result // DataURL of the image
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    let str_body = JSON.stringify(body);
    let response = await fetch('/user',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : str_body
    });
    let parsed_response = await response.json();
    if(parsed_response.statusCode === 200) {
        alert(parsed_response.message);
        window.location = `admin.html?auth_id=${token_key}&id=${id}`;
    }else{
        alert(parsed_response.message);
    }
}

async function getAllUsers() {
    document.getElementById('addForm').style.display = "none";
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let token_key = url_params.get("auth_id");
    let token = localStorage.getItem(token_key);
    try {
        let response = await fetch('/users',{
            method : 'GET',
            headers : {
                'Authorization' : `Bearer ${token}`
            },
        });
        let parsed_response = await response.json();
        // console.log("parsed_response : ",parsed_response);
        let data = parsed_response.data;
        console.log("data : ",data);
        let rows = "";
        for(let i = 0; i < data.length; i++) {
            if(data[i].user_type.user_type === 'Admin'){
                document.getElementById('admin-profile').innerHTML = `
                <div class="text-end"><img class="rounded-circle profile-pic" src="${data[i].image}"></div>
                <div class="text-light">
                <div class="fs-4 fw-bold">${data[i].name}</div>
                <div>Admin</div>
                </div>
                    `;
            }else{
                rows = rows + `
                <div class="d-flex justify-content-between align-items-center p-2 bg-white rounded">
                    <div class="d-flex align-items-center gap-2 col">
                        <img src="${data[i].image}" alt="" class="w-25 rounded-circle text-center rounded">
                        <div class="fw-bold">${data[i].name}</div>
                    </div>
                    <div class="col text-center">${data[i].email}</div>
                    <div class="col text-center">${data[i].user_type.user_type}</div>
                    <div class="d-flex justify-content-end gap-3">
                    <div class="col text-end"><button onclick="deleteUser('${data[i]._id}','${token_key}')" class="px-3 py-2 bg-danger text-light border border-danger rounded"><img class="w-75" src="./images/icons8-trash-30.png"></button></div>
                    <div class="col text-end"><button onclick="getSingleUserPage('${data[i]._id}')" class="px-3 py-2 bg-primary text-light border-0 rounded">view</button></div>
                    </div>
                </div>
                `;
                document.getElementById("usersContainer").innerHTML = rows;
            }
        }
    } catch (error) {
        console.log("error : ",error);
    }
}

function getSingleUserPage(user_id) {
    window.location = `singleView.html?id=${user_id}`;
}

async function getUser() {
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let id = url_params.get("auth_id");
    let token_key = id;
    let token = localStorage.getItem(token_key);
    let user_id = url_params.get("id");
    try {
        let response = await fetch(`user/${user_id}`,{
            method : 'GET',
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        });
        let parsed_response = await response.json();
        let user = parsed_response.data;
        console.log("user : ",user);
        document.getElementById('profile-details').innerHTML = `
        <div class="row">
            <div class="col-6 p-3">
                <img src="${user.image}" class="rounded w-100" alt="image">
            </div>
            <div class="col-6 d-flex flex-column justify-content-center gap-3 p-3 align-items-start">
                <div id="userName" class="fs-1 fw-bold">${user.name}</div>
                <div id="userEmail" class="fs-3">${user.email}</div>
                <div id="userAge" class="fs-3">age : ${user.age}</div>
                <div id="userUser_type" class="fs-3">user_type : ${user.user_type.user_type}</div>
            </div>
        </div>
    `;
    } catch (error) {
        console.log("error : ",error);
    }
}

async function deleteUser(id,token_key) {
    let token = localStorage.getItem(token_key);
    try {
        let response = await fetch(`/user/${id}`,{
            method : 'DELETE',
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        });
        if(response.status === 200) {
            alert("user deleted successfully");
            window.location = `admin.html?auth_id=${token_key}`;
        }
    } catch (error) {
        console.log("error : ",error);
    }
}

async function updateUser(event) {
    event.preventDefault();
    try {
        let queryString = window.location.search;
        let url_params = new URLSearchParams(queryString);
        let id = url_params.get("auth_id");
        let token_key = id;
        let token = localStorage.getItem(token_key);
    
        let body;
    
        if(document.getElementById('image').files[0] === undefined){
            body = {
                name : document.getElementById('name').value,
                email : document.getElementById('email').value,
                age : document.getElementById('age').value,
            }
        }else {
            let file = document.getElementById('image').files[0];
    
            // Use a Promise to wait for FileReader to finish reading the file
            body = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    resolve({
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value,
                        age : document.getElementById('age').value,
                        image: e.target.result // DataURL of the image
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }
        let str_body = JSON.stringify(body);
        console.log("str_body:", str_body);
        let response = await fetch(`/user/${id}`,{
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        body : str_body
        });
        console.log("response : ",response);
        if(response.status === 200) {
            alert("user updated successfully");
            window.location = `employee.html?id=${id}&auth_id=${token_key}`;
        }else{
            alert("user updation failed");
        }
    } catch (error) {
        console.log("error : ",error);
    }
}

async function passwordForm() {
    formdisplay = formdisplay+1;
    if(formdisplay%2 == !0) {
        document.getElementById('resetForm').style.display = "block";
    }else{
        document.getElementById('resetForm').style.display = "none";
    }
}

async function resetPassword(event) {
    event.preventDefault();
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let id = url_params.get("auth_id");
    let token_key = id;
    let token = localStorage.getItem(token_key);

    let body = {
        currentPassword : document.getElementById('currentPassword').value,
        newPassword : document.getElementById('newPassword').value
    }

    let str_body = JSON.stringify(body);
    console.log("str_body : ",str_body);
    let response = await fetch(`/user/${id}`,{
        method : 'PATCH',
        headers : {
            'Content-Type' : 'application/json',
        },
    body : str_body
    });
    let parsed_response = await response.json();
    if(parsed_response.statusCode === 200) {
        let data = parsed_response.data;
        console.log("reset_password_count : ",data.reset)
        alert(parsed_response.message);
        if(data.login_count === "null" && data.reset_password_count === "null"){
            window.location = `index.html`;
        }else{
            window.location = `employee.html?id=${id}&auth_id=${token_key}`;
        }
    }else{
        alert(parsed_response.message);
    }
}

async function employee() {
    document.getElementById('pResetForm').style.display = 'none';
    document.getElementById('updateForm').style.display = 'none';

    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let id = url_params.get("auth_id");
    let token_key = id;
    let token = localStorage.getItem(token_key);
    let response = await fetch(`user/${id}`,{
        method : 'GET'
    });
    let parsed_response = await response.json();
    let user = parsed_response.data;
    console.log("user : ",user);
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('age').value = user.age;

    let row = `
        <div class="row">
            <div class="col-6 p-3">
                <img src="${user.image}" class="rounded w-100" alt="image">
            </div>
            <div class="col-6 d-flex flex-column justify-content-center gap-3 p-3 align-items-start">
                <div id="userName" class="fs-1 fw-bold">${user.name}</div>
                <div id="userEmail" class="fs-3">${user.email}</div>
                <div id="userAge" class="fs-3">age : ${user.age}</div>
                <div id="userUser_type" class="fs-3">user_type : ${user.user_type.user_type}</div>
            </div>
        </div>
    `;
    document.getElementById('profile-details').innerHTML = row;
    document.getElementById('dispayProfileName').innerHTML = `${user.name}`;
    document.getElementById("dispayProfilePic").innerHTML = `<img class="rounded-circle w-25" src="${user.image}">`;
}

function profile() {
    document.getElementById('pResetForm').style.display = 'none';
    document.getElementById('updateForm').style.display = 'none';
    document.getElementById('profile').style.display = 'block';
}

function updateForm() {
    document.getElementById('pResetForm').style.display = 'none';
    document.getElementById('profile').style.display = 'none';
    document.getElementById('updateForm').style.display = 'block';
}

function resetForm() {
    document.getElementById('updateForm').style.display = 'none';
    document.getElementById('profile').style.display = 'none';
    document.getElementById('pResetForm').style.display = 'block';
}

function logout() {
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let id = url_params.get("auth_id" || "id");
    let token_key = id;
    localStorage.removeItem(token_key);
    window.location = `index.html`;
}