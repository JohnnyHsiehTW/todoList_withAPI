const signUpEmail = document.getElementById('signUpEmail');
const signUpNickname = document.getElementById('signUpNickname');
const signUpPassword = document.getElementById('signUpPassword');
const signUpPasswordCheck = document.getElementById('signUpPasswordCheck');
const signUpBtn = document.getElementById('signUpBtn');

// 註冊
// aaa@gmail.com
// 123456
const apiUrl = 'https://todoo.5xcamp.us';
let token = "";
signUpBtn.addEventListener('click', signUp);

function signUp() {
  if (signUpPassword.value === signUpPasswordCheck.value) {
    axios.post(`${apiUrl}/users`,{
        "user": {
            "email": signUpEmail.value,
            "nickname": signUpNickname.value,
            "password": signUpPassword.value
        }
    })
    .then(response => {
      let responseMessage = response.data.message
      Swal.fire({
        position: "center",
        icon: "success",
        title: responseMessage,
        showConfirmButton: false,
        timer: 3000
      });
    })
    .catch(error => console.log(error.response))
  } else {
    Swal.fire({
      icon: "error",
      title: "密碼輸入錯誤囉",
      text: "請確認兩次輸入的密碼完全相同",
    });
    return
  }
}

// 註冊帳號 signUpLink
// addClass removeClass 切換畫面
const signUpLink = document.getElementById('signUpLink')
const signUpPage = document.querySelector('.signUpPage')
const loginPage = document.querySelector('.loginPage')

signUpLink.addEventListener('click', function () {
  loginPage.classList.add('displayNone');
  signUpPage.classList.remove('displayNone')
})

// 登入 loginLink
// addClass removeClass 切換畫面
const loginLink =document.getElementById('loginLink')
loginLink.addEventListener('click', function () {
  signUpPage.classList.add('displayNone')
  loginPage.classList.remove('displayNone');
})

// 登入
// 驗證axios回傳資料 > 回傳message 登入成功 > 跳轉畫面
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const todoPage = document.querySelector('.todoPage');
const header = document.querySelector('.header');
const bodyBackground = document.querySelector('body')

loginBtn.addEventListener('click', signIn)
function signIn() {
  axios.post(`${apiUrl}/users/sign_in`,{
      "user": {
          "email": loginEmail.value,
          "password": loginPassword.value
      }
  })
  .then(response =>{
    console.log(response);
    axios.defaults.headers.common['Authorization'] = AUTH_TOKEN = response.headers.authorization
    
    let responseMessage = response.data.message
    Swal.fire({
      position: "center",
      icon: "success",
      title: responseMessage,
      showConfirmButton: false,
      timer: 2000
    });
    
    // 顯示header、todoPage，隱藏其他頁面
    setTimeout(displayNone, 2100)
    function displayNone() {
      signUpPage.classList.add('displayNone');
      loginPage.classList.add('displayNone');
      todoPage.classList.remove('displayNone');
      header.classList.remove('displayNone');
    }
    
    setTimeout(clearInput, 2000)
    function clearInput() {
      loginEmail.value = '';
      loginPassword.value = '';
    }
    
      // header 顯示暱稱
      const headerNickname = document.getElementById('headerNickname');
      headerNickname.innerHTML= `${response.data.nickname}的待辦`;

      // 資料初始化渲染
      updateList();
      })

  .catch(error => {
    let errorMessage = error.response.data.message
    Swal.fire({
      icon: "error",
      title: errorMessage,
      text: "請確認帳號或密碼是否輸入錯誤",
    });
  })
  // 登入後切換背景
  setTimeout(changeBackground, 2100)
  function changeBackground() {
    bodyBackground.setAttribute('class','todolistBackground')
  }
}

// 資料初始化渲染
const list = document.getElementById('list');
function renderData(arr) {
      let str = '';
      arr.forEach(updateAll);
        function updateAll(item) {
          if (item.completed_at == null) {
            str += `
            <li>
            <label class="checkbox" for="">
            <input type="checkbox" data-id="${item.id}"/>
            <span>${item.content}</span>
            </label>
            <a href="#" class="delete"><i class="fa-solid fa-xmark" id="delete" data-id="${item.id}"></i></a>
            </li>`
          } else {
            str += `
            <li>
            <label class="checkbox" for="">
            <input type="checkbox" data-id="${item.id}" checked/>
            <span>${item.content}</span>
            </label>
            <a href="#" class="delete"><i class="fa-solid fa-xmark" id="delete" data-id="${item.id}"></i></a>
            </li>`
          }
      }
      list.innerHTML = str;
  }

loginEmail.addEventListener('keypress',function (e) {
  if (e.key === 'Enter') {
    signIn();
  }
})
loginPassword.addEventListener('keypress',function (e) {
  if (e.key === 'Enter') {
    signIn();
  }
})


// todoList Page

// 登出
const headerLogout = document.getElementById('headerLogout');
headerLogout.addEventListener('click', logout)
function logout() {
  axios.delete(`${apiUrl}/users/sign_out`)
  .then(response=>{
    axios.defaults.headers.common['Authorization'] = '';
    let logoutMessage = response.data.message
      Swal.fire({
        position: "center",
        icon: "success",
        title: logoutMessage,
        showConfirmButton: false,
        timer: 2000
      });
      
      // 顯示header、todoPage，隱藏其他頁面
      setTimeout(displayNone, 2100)
      function displayNone() {
        signUpPage.classList.add('displayNone');
        todoPage.classList.add('displayNone');
        header.classList.add('displayNone');
        loginPage.classList.remove('displayNone');
      }
      setTimeout(changeBackground, 2100)
      function changeBackground() {
        bodyBackground.setAttribute('class','backgroundColor')
      }
  })
}


// 新增待辦事項

const addList = document.querySelector('.addList');
const addTodoBtn = document.querySelector('.btn_add');

addTodoBtn.addEventListener('click', addTodo);
function addTodo() {
  if (addList.value.trim() !=='') {
    axios.post(`${apiUrl}/todos`,{
      "todo": {
        "content": addList.value
      }
    })
    .then(response=> {
      addList.value = '';
      updateList();
    })

    .catch(error=>console.log(error.response))
  } else {
    alert('請輸入待辦事項~'); //未填寫事項內容提示
  };
}
//加入kepress監聽，用enter新增待辦事項
addList.addEventListener('keypress', function(e){
  if(e.key === 'Enter') {
    addTodo();
  }
});

// 刪除待辦事項
list.addEventListener('click',deleteTodo);
function deleteTodo(e) {
  let todoID = e.target.dataset.id;
  if (e.target.id === "delete") {
    e.preventDefault();
    axios.delete(`${apiUrl}/todos/${todoID}`)
    .then(response=>{
      updateList();
    })
  } 
  else {
    //切換check狀態
    function toggleTodo(todoID) {
      axios.patch(`${apiUrl}/todos/${todoID}/toggle`,{})
      .then(response=>{
        updateList();
      })
      .catch(error=>console.log(error.response))
    }
    toggleTodo(todoID)
  }
}

//分類切換功能
const tab = document.getElementById('tab');
let toggleStatus = 'all'
tab.addEventListener('click', tabSwitch);
function tabSwitch(e) {
  toggleStatus = e.target.dataset.tab;
  //dataset可以取出所有data-開頭的值，以此為例，撈取特定的值再加上.tab
  let tabs = document.querySelectorAll('#tab li');
  tabs.forEach((tab)=>{
    tab.classList.remove('active');
  });
  e.target.classList.add('active');
  updateList();
}

// 依照分類更新待辦清單
function updateList() {
  let showData = [];
  axios.get(`${apiUrl}/todos`)
    .then(response=>{
      const originData = response.data.todos;
      if (toggleStatus === 'all') {
        showData = originData;
      } else if (toggleStatus === 'unfinished') {
        showData = originData.filter((i) => i.completed_at === null);
      } else if (toggleStatus === 'finished'){
        showData = originData.filter((i) => i.completed_at !== null);
      }
      renderData(showData);
      
      // 計算待完成項目數量
        const listNum = document.getElementById('listNum');
        let todolength = originData.filter((i) => i.completed_at === null);
        listNum.textContent = todolength.length;
        
        const todoList = document.querySelector('.todoList')
        const todoEmpty = document.querySelector('.todoEmpty')
        if (listNum.textContent === '0') {
          todoList.classList.add('displayNone');
          todoEmpty.classList.remove('displayNone');
        } else if (listNum.textContent !== '0') {
          todoEmpty.classList.add('displayNone');
          todoList.classList.remove('displayNone');
        }
        console.log(listNum);
        
    })
}

// // 清除已完成項目
const deleteDone = document.getElementById('deleteDone');
deleteDone.addEventListener('click', function(e) {
  e.preventDefault();
  axios.get(`${apiUrl}/todos`)
  .then(response=>{
    const originData = response.data.todos;
    deleteData = originData.filter((i) => i.completed_at !== null);
    deleteData.forEach((i)=>{
      axios.delete(`${apiUrl}/todos/${i.id}`)
      .then(response=>{
        updateList();
      })
    })
  });
  })

