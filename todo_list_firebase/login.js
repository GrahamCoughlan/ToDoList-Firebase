const loginForm = document.getElementById("login-form");
loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    const loginEmail = loginForm["login-email"].value;
    const loginPassword = loginForm["login-password"].value;
    auth.signInWithEmailAndPassword(loginEmail, loginPassword).then(()=>{
        console.log("login invoked");
        location="users.html"
    }).catch(err=>{
        const loginError = document.getElementById("loginError");
        loginError.innerText = err.message;
    })
})

