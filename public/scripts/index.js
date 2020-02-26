
function toggle() {
    document.getElementById('loginPage').hidden = !document.getElementById('loginPage').hidden;
    document.getElementById('signupPage').hidden = !document.getElementById('signupPage').hidden;
    if (document.getElementById('signupPage').hidden) {
        document.getElementById('signCallBtn').textContent = "To Sign Up";

    } else {
        document.getElementById('signCallBtn').textContent = "To Sign In";

    }
}
function handleLogin() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
    else {
        var email = document.getElementById('login-email').value;
        var password = document.getElementById('login-password').value;
        if (email.length < 4) {
            alert('Enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            location.reload();
            return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).then(function (result) {
            //TODO
            window.location('user-ground/');
        }).catch(function (error) {
            document.getElementById('login-info').hidden = false;
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                document.getElementById('login-info').textContent = "Wrong Password! Forgot ?";
                document.getElementById('login-password').value = "";
            } else if (errorCode === 'auth/too-many-requests') {
                document.getElementById('login-info').textContent = "We have banned this user for 10 mins for requesting wrong attempts!";
                //TODO
                if (email) {
                    document.getElementById('login-button').disabled = true;
                }

            }else if(errorCode === 'auth/user-not-found'){
                document.getElementById('login-info').textContent = "No user record.";
                document.getElementById('login-email').value = "";
                document.getElementById('login-password').value = "";
            } else if(errorCode === 'auth/invalid-email'){
                document.getElementById('login-info').textContent = "Invalid Email!";
                document.getElementById('login-email').value = "";
            }else {
                console.log(errorCode);
                console.log(errorMessage);
            }

        });
    }
}

function initApp() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //document.getElementById('details').textContent = JSON.stringify(user, null, '  ');
            var emailVerified = user.emailVerified;

            if (!emailVerified) {

            }
            else {
                window.location.replace('user-ground/');
            }
        } else {

        }
        // document.getElementById('signin').disabled = false;
    });
    document.getElementById('signCallBtn').addEventListener('click', toggle, false);
    document.getElementById('login-button').addEventListener('click', handleLogin, false);


}


window.onload = function () {
    initApp();
};