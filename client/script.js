async function login(event) {
    event.preventDefault();
    try {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let body = { email, password };
        let str_body = JSON.stringify(body);
        console.log("str_body : ", str_body);
        
        let response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: str_body
        });
        console.log("response : ",response);
        let parsed_response = await response.json();
        console.log("parsed response : ",parsed_response);
        let data = parsed_response.data;
        let token = data.token;
        console.log("token : ", token);
        let token_key = data.id;
        console.log("token_key : ", token_key);
        localStorage.setItem(token_key, token);
        let user_id = data.id;

        console.log("flag : ",data.flag);
        if(data.flag === 1){
            window.location = `pReset.html?user_id=${user_id}&id=${token_key}&user_type=${data.user_type}`;
        }else {
            if (data.user_type === "Admin") {
                window.location = `admin.html?id=${token_key}`;
            } else if (data.user_type === 'Employee') {
                window.location = `employee.html?user_id=${user_id}&id=${token_key}`
            } else {
                alert(parsed_response.message);
            }
        }
    } catch (error) {
        console.log("error : ", error);
    }
}

function fReset() {
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let user_type = url_params.get("user_type");
    let token_key = url_params.get("id");
    let user_id = url_params.get("user_id");

    if (user_type === "Admin") {
        window.location = `admin.html?id=${token_key}`;
    } else if (user_type === 'Employee') {
        window.location = `employee.html?user_id=${user_id}&id=${token_key}`
    } else {
        alert("something went wrong");
    }
}

async function getAllUsers() {
    document.getElementById('addForm').style.display = "none";
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let token_key = url_params.get("id");
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
            rows = rows + `
            <div class="d-flex justify-content-between align-items-center rounded-pill p-2 bg-lightblue">
                <div class="d-flex align-items-center gap-2 col">
                    <img onclick="getSingleUserPage('${data[i]._id}','${token_key}')" src="${data[i].image}" alt="User Image" class="img-width rounded text-center rounded-circle"> <!-- Replace with actual image -->
                    <div class="fw-bold">${data[i].name}</div>
                </div>
                <div class="col text-center">${data[i].email}</div>
                <div class="col text-center">${data[i].user_type.user_type}</div>
                <div class="col text-end"><button onclick="deleteUser('${data[i]._id}','${token_key}')" class="px-3 py-2 bg-danger text-light border border-danger rounded-pill">Delete</button></div>
            </div>
            `;
            document.getElementById("users").innerHTML = rows;
        }
    } catch (error) {
        console.log("error : ",error);
    }
}

let formdisplay = 0;
function addform(){
    formdisplay = formdisplay+1;
    if(formdisplay%2 == !0) {
        document.getElementById('addForm').style.display = "block";
    }else{
        document.getElementById('addForm').style.display = "none";
    }
}

async function createUser(event) {
    event.preventDefault();

    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let token_key = url_params.get("id");
    let token = localStorage.getItem(token_key);

    let body;

    if (document.getElementById('image').files[0] === undefined) {
        // No image file, create body object without the image
        body = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            user_type: document.getElementById('user_type').value,
        };
    } else {
        // If image is present, read it asynchronously
        let file = document.getElementById('image').files[0];

        // Use a Promise to wait for FileReader to finish reading the file
        body = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                resolve({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    user_type: document.getElementById('user_type').value,
                    image: e.target.result // DataURL of the image
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    try {
        let str_body = JSON.stringify(body);
        console.log("str_body:", str_body);

        let response = await fetch('/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: str_body
        });

        if (response.status === 200) {
            alert("User created successfully");
            window.location = `admin.html?id=${token_key}`;
        } else {
            alert("Something went wrong");
        }
    } catch (error) {
        console.log("error:", error);
    }
}

function employeePage(user_id,token_key) {
    window.location = `employee.html?user_id=${user_id}&id=${token_key}`
}

function getSingleUserPage(user_id,token_key) {
    window.location = `singleView.html?user_id=${user_id}&id=${token_key}`
}

async function getUser() {
    document.getElementById("updateForm").style.display = "none";
    document.getElementById('resetForm').style.display = "none";
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let token_key = url_params.get("id");
    let token = localStorage.getItem(token_key);
    let user_id = url_params.get("user_id");
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
        let struser = JSON.stringify(user)
        document.getElementById('user').innerHTML = `
            <div class="d-flex align-items-center justify-content-center gap-5">
                <div class="col">
                    <img src="${user.image}" class="rounded img-width" alt="">
                </div>
                <div class="col gap-2 d-flex flex-column">
                    <div class="fs-1 fw-bolder">
                        ${user.name}
                    </div>
                    <div class="fs-3 fw-bold">
                        ${user.email}
                    </div>
                    <div class="fs-3 fw-bold">
                        ${user.user_type.user_type}
                    </div>
                    <div class="fs-3 fw-bold">
                        age : ${user.age}
                    </div>
                    <div class="fs-3 fw-bold">
                        ${user.description}
                    </div>
                </div>
            </div>
            <div class="pt-5 d-flex gap-3 justify-content-center">
                <button onclick="editform('${user_id}')" class="bg-darkblue rounded text-light px-3 py-2">edit details</button>
                <button onclick="passwordForm()" class="bg-dark rounded text-light px-3 py-2">reset Password</button>
            </div>
            `;
    } catch (error) {
        console.log("error : ",error);
    }
}

async function getSingleUser() {
    document.getElementById("updateForm").style.display = "none";
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let token_key = url_params.get("id");
    let token = localStorage.getItem(token_key);
    let user_id = url_params.get("user_id");
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
        let struser = JSON.stringify(user)
        document.getElementById('user').innerHTML = `
            <div class="d-flex align-items-center justify-content-center gap-5">
                <div class="col">
                    <img src="${user.image}" class="rounded img-width" alt="">
                </div>
                <div class="col gap-2 d-flex flex-column">
                    <div class="fs-1 fw-bolder">
                        ${user.name}
                    </div>
                    <div class="fs-3 fw-bold">
                        ${user.email}
                    </div>
                    <div class="fs-3 fw-bold">
                        ${user.user_type.user_type}
                    </div>
                    <div class="fs-3 fw-bold">
                        age : ${user.age}
                    </div>
                </div>
            </div>
            <div class="fs-5 fw-bold p-5">
                        ${user.description}
            </div>
            <div class="pt-5 d-flex gap-3 justify-content-center">
                <button onclick="editform('${user_id}')" class="bg-darkblue rounded text-light px-3 py-2">edit details</button>
            </div>
            `;
    } catch (error) {
        console.log("error : ",error);
    }
}

async function editform(){
    formdisplay = formdisplay+1;
    if(formdisplay%2 == !0) {
        document.getElementById('updateForm').style.display = "block";
    }else{
        document.getElementById('updateForm').style.display = "none";
    }
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let token_key = url_params.get("id");
    let token = localStorage.getItem(token_key);
    let user_id = url_params.get("user_id");
    let response = await fetch(`user/${user_id}`,{
        method : 'GET',
        headers : {
            'Authorization' : `Bearer ${token}`
        }
    });
    let parsed_response = await response.json();
    let user = parsed_response.data;
    console.log("user : ",user);
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('user_type').value = user.user_type.user_type;
}

async function updateUser(event) {
    event.preventDefault();

    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let user_id = url_params.get("user_id");
    let token_key = url_params.get("id");
    let token = localStorage.getItem(token_key);

    let body;

    if(document.getElementById('image').files[0] === undefined){
        body = {
            name : document.getElementById('name').value,
            email : document.getElementById('email').value,
            user_type : document.getElementById('user_type').value,
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
                    user_type: document.getElementById('user_type').value,
                    image: e.target.result // DataURL of the image
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    try {
        let str_body = JSON.stringify(body);
        console.log("str_body:", str_body);
        let response = await fetch(`/user/${user_id}`,{
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
            window.location = `employee.html?user_id=${user_id}&id=${token_key}`;
        }else{
            alert("user updation failed");
        }
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
            window.location = `admin.html?id=${token_key}`;
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
    let user_id = url_params.get("user_id");
    let token_key = url_params.get("id");
    let token = localStorage.getItem(token_key);

    let body = {
        currentPassword : document.getElementById('currentPassword').value,
        newPassword : document.getElementById('newPassword').value
    }

    let str_body = JSON.stringify(body);
    console.log("str_body : ",str_body);
    let response = await fetch(`/resetPassword/${user_id}`,{
        method : 'PUT',
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
    body : str_body
    });
    let parsed_response = await response.json();
    if(response === 200) {
        alert(parsed_response.message);
        window.location = `employee.html?user_id=${user_id}&id=${token_key}`;
    }else{
        alert(parsed_response.message);
    }
}

async function signOut() {
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let token_key = url_params.get("id");

    localStorage.removeItem(token_key);
    window.location = `index.html`;
}

function homeBtn() {
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let token_key = url_params.get("id");
    window.location = `admin.html?id=${token_key}`;
}