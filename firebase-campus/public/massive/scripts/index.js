function handleSignOut() {
    if (userIs()) {
        firebase.auth().signOut();
    }
}
function hundleDelete() {
    delUser = userIs();
    if (delUser) {
        var user_confirm = confirm("Do you Really want to Deauth your account ?")
        if (user_confirm == true) {
            delUser.delete().then(function () {
            }).catch(function (error) {
                alert(error.Message);
            });
        } else {
            location.reload();
        }
    }
}

function userIs() {
    return firebase.auth().currentUser;
}

function dbIs() {
    const db = firebase.firestore();
    const settings = { timestampsInSnapshots: true }
    db.settings(settings);
    return db;
}

function docPrivate() {
    db = dbIs();
    const user = userIs();
    return db.collection(("Registered/Users/") + user.uid + '/' + "profile/private").doc("info/");
}

function docPublic() {
    db = dbIs();
    const user = userIs();
    return db.collection(("Registered/Users/") + user.uid + '/' + "profile/public").doc("info/");
}

function updateProfile(profile) {
    if (!profile) {
        document.getElementById('user-pic').src = "../imgs/undef.png";
    }
    else {
        document.getElementById('user-pic').src = profile;
    }
}

function check(doc) {
    if (doc.data().vip) {
        document.getElementById('active').style.backgroundColor = '#0a0';
    }
    else {
        document.getElementById('active').style.backgroundColor = '#9C0443';
    }
}

function hundleUpdate() {
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    document.getElementById('name').value = "";
    document.getElementById('phone').value = "";

    const docRef = docPublic();

    if (!name == "" && !phone == "") {
        docRef.update({
            username: name,
            phone: phone
        });
    }
    else {
        if (name == "") {
            alert("Enter Name");
        }
        if (phone == "") {
            alert("Enter Phone");
        }
    }
}

function dbInitUpdate() {
    docRefPri = docPrivate();
    user = userIs();

    docRefPri.set({
        email: user.email,
        uid: user.uid
    });
}

function userData(doc) {
    if (doc.data().username) {
        document.getElementById('currentName').textContent = "Name: " + doc.data().username;
    } else {
        if(!doc.data().profile){
            db = dbIs();
            const docRefPub = db.collection(("Registered/Users/") + user.uid + '/' + "profile/public").doc("info/");
            docRefPub.set({
                check_fuck: true
            })
        }
        document.getElementById('currentName').textContent = "Name: Not Set Yet";
        document.getElementById('repasswdtxt').textContent = "you need to provide password in order to update data";
    }
    if (doc.data().phone) {
        document.getElementById('currentPhone').textContent = "Phone: " + doc.data().phone;
    } else {
        document.getElementById('currentPhone').textContent = "Phone: Not Set Yet";
    }

}

function handleUpload() {
    const user = firebase.auth().currentUser;
    const ref = firebase.storage().ref();
    const file = document.getElementById('photo').files[0];
    document.getElementById('photo').value = "";
    const name = (user.uid) + '-' + 'image';
    const metadata = {
        contentType: file.type
    };
    const task = ref.child('profiles/' + user.uid + '/' + name).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then((url) => {
            console.log(url);
            //document.getElementById('user-pic').src = url;
            var docRef = docPublic();
            docRef.update({
                profile: url
            })
        })
        .catch(console.error);
}

function hundleSettings() {
    document.getElementById('settings_card').hidden = !document.getElementById('settings_card').hidden;
    //document.getElementById('profile_card').hidden = !document.getElementById('profile_card').hidden;
}

function reAuthUser() {
    var user = userIs();
    var providedPassword = document.getElementById('rePasswd').value;
    document.getElementById('rePasswd').value = "";

    if (!providedPassword) {
        alert("You need to provide password to update data");
    } else {
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, providedPassword);
        user.reauthenticateAndRetrieveDataWithCredential(cred).then(function () {
            hundleUpdate();
        }).catch(function (e) {
            alert(e.message);
            alert("Something Wrong!");
        });
    }
}
function initApp() {
    document.getElementById('signout').addEventListener('click', handleSignOut, false);
    document.getElementById('delete').addEventListener('click', hundleDelete, false);
    document.getElementById('update').addEventListener('click', reAuthUser, false);
    document.getElementById('upload').addEventListener('click', handleUpload, false);
    document.getElementById('btn_settings').addEventListener('click', hundleSettings, false);

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (!user.emailVerified) {
                window.location.replace('../');
            }
            else {
                dbInitUpdate();
                //document.getElementById('data').textContent = JSON.stringify(userIs(), null, '  ');

                const docRef = docPublic();
                docRef.onSnapshot(function (doc) {
                    if (doc.exists) {
                        updateProfile(doc.data().profile);
                        check(doc);
                        userData(doc);

                    }
                    else {
                        db = dbIs();
                        const docRefPub = db.collection(("Registered/Users/") + user.uid + '/' + "profile/public").doc("info/");
                        docRefPub.set({
                            check: true

                        })
                        document.getElementById('user-pic').src = "../imgs/undef.png";
                    }
                });
                //JSON
            }
        }
        else {
            window.location.replace('../');
        }
    });
}

window.onload = function () {
    initApp();
};


//document.getElementById('update').addEventListener('click', hundleUpdate, false);

    //const name = (+new Date()) + '-' + file.name;

    //document.getElementById('data').textContent = JSON.stringify(user, null, '  ');

     //document.getElementById('user-pic').style.backgroundImage = 'url(' + doc.data().profile + ')';