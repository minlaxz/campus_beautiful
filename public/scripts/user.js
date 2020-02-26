function handleSignOut() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
}


function initApp() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //document.getElementById('details').textContent = JSON.stringify(user, null, '  ');
            var emailVerified = user.emailVerified;

            if (!emailVerified) {
                window.location.replace('../');
            }
            else {
                //window.location.replace('massive/');
            }
        } else {

            window.location.replace('../');
        }
    });

    document.getElementById('signout-button').addEventListener('click', handleSignOut, false);


}


window.onload = function () {
    initApp();
};