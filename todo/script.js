// Dom elements
const listItems = document.getElementById("list-items");
const inputBox = document.getElementById("input-box");
const submitTodo = document.getElementById("submit-todo");
const listitems = document.getElementById("list-items");


var request = new XMLHttpRequest();
request.open("get", "/todo");
request.send();

request.addEventListener("load", () => {
  var todos = request.responseText;
  
  todos = todos.length ? JSON.parse(todos) : [];
  console.log("loaded todos from server: ", todos);

  renderAll(todos);
});


// Event Listeners
submitTodo.addEventListener("click", (e) => addTodo(e));
listItems.addEventListener('click', (e) => eventHandler(e));

// Functions
function renderAll(itemList) {
  itemList.forEach((item) => {
    addItemToList(item);
  });
}

function addTodo(event) {

  var input = inputBox.value.trim();
  if (!input.length) {
    alert("Please Enter a value");
    return;
  }
  var obj = {
    id: Date.now(),
    itemName: input,
    check: false,
  };

  addItemToServer(obj);
}

function deleteTodo(item){
  var request = new XMLHttpRequest();
  request.open("delete", "/deleteTodo");
  request.setRequestHeader("Content-type", "application/json");

  var key = (item.getAttribute('key'))

  request.send(JSON.stringify({id: key}))

  request.addEventListener('load', () => {
    item.remove()
  })
}

function checkTodo(item, checkMark){
  var request = new XMLHttpRequest();
  request.open('post', '/check')
  request.setRequestHeader('Content-type', 'application/json')

  var id = Number(item.getAttribute('key'))

  request.send(JSON.stringify({
    key: id,
    check: checkMark,
  }))

  request.onload = () => {
    console.log(request.response)
  }
}

function addItemToServer(itemObj) {
  var request = new XMLHttpRequest();
  request.open("post", "/save");
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(itemObj));

  request.addEventListener("load", () => {
    addItemToList(itemObj);
    inputBox.value = "";
  });
}

function eventHandler(event){
  var item = event.target.parentElement;
  
  if(event.target.classList.contains('delete-btn')){
    deleteTodo(item)
  }

  if(event.target.classList.contains('checkbox-btn')){
    var checkBtn = event.target
    var itemName = item.firstChild

    checkBtn.checked ? itemName.classList.add("strike") : itemName.classList.remove("strike");
    checkTodo(item, checkBtn.checked);
  }
}

function addItemToList(itemObj) {
  var container = document.createElement("div");
  container.setAttribute("key", Number(itemObj.id));
  container.setAttribute("class", "container-item flex");

  var nameHolder = document.createElement("input");
  nameHolder.setAttribute("type", "text");
  nameHolder.disabled = true;
  nameHolder.setAttribute("class", "name-holder");
  console.log('hello')
  console.log('log check :) ', itemObj)
  
  itemObj.check ? nameHolder.classList.add("strike") : nameHolder.classList.remove("strike");

  var checkBtn = document.createElement("input");
  checkBtn.setAttribute("type", "checkbox");
  checkBtn.setAttribute("class", "checkbox-btn");
  checkBtn.setAttribute("id", "checkbox-btn");

  var deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "delete-btn");
  deleteBtn.setAttribute("id", "delete-btn");
  deleteBtn.innerHTML = "X";

  nameHolder.value = itemObj.itemName;
  checkBtn.checked = itemObj.check;

  container.appendChild(nameHolder);
  container.appendChild(checkBtn);
  container.appendChild(deleteBtn);

  listItems.appendChild(container);
}
