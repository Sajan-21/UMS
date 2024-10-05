
async function login(event) {
    event.preventDefault();
    body = {
        email : document.getElementById('email').value,
        password : document.getElementById('password').value
    }
    let str_body = JSON.stringify(body);
    let response = await fetch('/login',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : str_body
    });
    console.log("response : ",response);
    let parsed_response = await response.json();
    let data = parsed_response.data;
    let parsed_data = JSON.parse(data);
    let token_key = parsed_data.email;
    let token = localStorage.setItem(token_key, parsed_data.token);
    if(parsed_data.user_type === "Admin"){
        window.location = `admin.html?email=${token_key}`;
    }else if(parsed_data.user_type === "Employee"){
        window.location = `singleView.html?id=${parsed_data.id}&email=${token_key}`;
    }else{
        alert("something went wrong");
    }
}

async function getUser() {
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let token_key = url_params.get("email");
    let id = url_params.get("id");
    let token = localStorage.getItem(token_key);

    let response = await fetch(`/user/${id}`,{
        method : 'GET',
        headers : {
            'Authorization' : `Bearer ${token}`
        }
    });
    let parsed_response = await response.json();
    let data = parsed_response.data;
    console.log("data : ",data);
}

async function fetchAllUsers() {
    document.getElementById("addForm").style.display = "none";
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let token_key = url_params.get("email");
    let token = localStorage.getItem(token_key);
    let response = await fetch('/users',{
        method : "GET",
        headers : {
            'Authorization' : `Bearer ${token}`
        },
    });
    let parsed_response = await response.json();
    let users = parsed_response.data;
    console.log(users);

}

async function showAddForm() {
    document.getElementById("addForm").style.display = "block";
}

async function imageConvertion(event) {
    event.preventDefault();
  
    try {
      let image = document.getElementById("image");
      let file = image.files[0];
  
      let dataUrl;
  
      if (file) {
        const reader = new FileReader();
  
        reader.onload = function (e) {
          dataUrl = e.target.result;
          createUser(dataUrl);
        };
  
        reader.readAsDataURL(file);
      } else {
        console.log("no file selected for image");
      }
      createUser(dataUrl);
    } catch (error) {
      console.log("error : ", error);
    }
  }


async function createUser(b64) {
    let queryString = window.location.search;
    let url_params = new URLSearchParams(queryString);
    let token_key = url_params.get("email");
    let token = localStorage.getItem(token_key);
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let user_type = document.getElementById('user_type').value;
    body = {
        name,
        email,
        password,
        user_type,
        image : b64
    }
    let str_body = JSON.stringify(body);
    let response = await fetch('/user',{
        method : 'POST',
        headers : {
            'Authorization' : `Bearer ${token}`
        },
        body : str_body
    });
    let parsed_response = await response.json();
    if(parsed_response.statusCode === 200){
        alert("employee created successfully");
        window.location = `admin.html?email=${token_key}`;
    }else{
        alert("something went wrong");
    }
}
