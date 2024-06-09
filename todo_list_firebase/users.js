const spanDate = document.getElementById("date");
const spanMonth = document.getElementById("month");
const spanYear = document.getElementById("year");
const spanWeekday = document.getElementById("weekday");

const todoContainer = document.getElementById("todo-container");

function loadbody(){
    const date = new Date();
    const month = date.toLocaleDateString('default', {month: "long"});
    const year = date.getFullYear();
    const weekday = date.toLocaleDateString('default', {weekday: "long"});
    const myDate = date.getDate();

    spanDate.innerText = myDate;
    spanMonth.innerText = month;
    spanYear.innerText = year;
    spanWeekday.innerText = weekday;
}

auth.onAuthStateChanged(user => {
    if (user){
        console.log("User is signed in at users.html");
    }else{
        alert("Your login session has expired or you have been logged out, login again to continue")
        location = "login.html";
    }
})

//retrieving todos
function renderData(individualDoc){
    //parent element
    let parentDiv = document.createElement("div");
    parentDiv.className = "container todo-box";
    parentDiv.setAttribute('data-id', individualDoc.id);

    //todo div

    let todoDiv = document.createElement("div"); 
    todoDiv.textContent = individualDoc.data().todos;

    // button to delete todoss

    let trash = document.createElement("button");

    //font-awesoum trash icon

    let i = document.createElement("i");
    i.className = "fas fa-trash";

    //appending

    trash.appendChild(i);

    parentDiv.appendChild(todoDiv);
    parentDiv.appendChild(trash);

    todoContainer.appendChild(parentDiv);


    //adding click event to trash button

    trash.addEventListener("click", e=>{
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        auth.onAuthStateChanged(user=>{
            if(user){
                db.collection(user.uid).doc(id).delete();
            }
        })
    })


    
}

//retrieving username

auth.onAuthStateChanged(user=>{
    if(user){
        const username = document.getElementById("username");
        db.collection('users').doc(user.uid).get().then(snapshot=>{
           username.innerText = snapshot.data().Name;
        })

    }
})

//adding todos

const form = document.getElementById("form");
const date = new Date();
const time = date.getTime();
let counter = time;
form.addEventListener("submit", e=>{
    e.preventDefault();
    const todos = form["todos"].value;
    let id = counter += 1;
    form.reset();
    auth.onAuthStateChanged(user=>{
        if(user){
            db.collection(user.uid).doc('_' + id).set({
                id: '_' + id, todos
            }).then(()=>{
                console.log("todo added")
            }).catch(err=>{
                console.log(err.message);
            })
        }
    })
})


//logout

function logout(){
    auth.signOut();

}

//real time event listenerss

auth.onAuthStateChanged(user => {
    if (user) {
        db.collection(user.uid).onSnapshot((snapshot) => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == "added") {
                    renderData(change.doc);
                }
                else if (change.type == 'removed') {
                    let li = todoContainer.querySelector('[data-id=' + change.doc.id + ']');
                    todoContainer.removeChild(li);
                }
            })
        })
    }
})