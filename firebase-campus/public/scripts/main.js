function toggleSignIn() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
    else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
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
            //location.reload(); //TODO

        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            document.getElementById('signin').disabled = false;
        });
    }
}

function handleSignOut() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();

    }
}

function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        location.reload();
        return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
            location.reload();
        }
        console.log(error);
    });
}




function sendEmailVerification() {
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        alert('Email Verification Sent!');
    });
}

function sendPasswordReset() {
    var email = document.getElementById('email').value;
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        alert('Password Reset Email Sent!');
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        alert(error.message);
        console.log(error.code);
    });

}


function initApp() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var emailVerified = user.emailVerified;

            //document.getElementById('details').textContent = JSON.stringify(user, null, '  ');

            document.getElementById('load').hidden = true;
            document.getElementById('signin').hidden = true;
            document.getElementById('signup').hidden = true;
            document.getElementById('forgot').hidden = true;

            document.getElementById('signout').hidden = false;

            if (!emailVerified) {
                document.getElementById('details').textContent = 'Not verified account! You need to verify first to continue.';
                let detail = document.getElementById('details');
                detail.classList.add('text-warning');
                document.getElementById('verify').hidden = false;
            }
            else {
                window.location.replace('massive/');
            }
        } else {

            //document.getElementById('status').textContent = 'Signed out';
            //document.getElementById('details').textContent = 'null';
            document.getElementById('details').textContent = '';

            document.getElementById('verify').hidden = true;
            document.getElementById('signout').hidden = true;

            document.getElementById('forgot').hidden = false;
            document.getElementById('load').hidden = false;
            document.getElementById('signin').hidden = false;
            document.getElementById('signup').hidden = false;
        }
        // document.getElementById('signin').disabled = false;
    });

    document.getElementById('signin').addEventListener('click', toggleSignIn, false);
    document.getElementById('signup').addEventListener('click', handleSignUp, false);
    document.getElementById('signout').addEventListener('click', handleSignOut, false);
    document.getElementById('verify').addEventListener('click', sendEmailVerification, false);
    document.getElementById('forgot').addEventListener('click', sendPasswordReset, false);
}

window.onload = function () {
    initApp();
};