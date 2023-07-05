const firebaseConfig = {
    // Configuración de Firebase
    // ...
    apiKey: "AIzaSyDmbjkzrSjpg2Grm5PMROzeJMWGCgWXHuw",
  authDomain: "proyecto-de-pruba-1.firebaseapp.com",
  databaseURL: "https://proyecto-de-pruba-1-default-rtdb.firebaseio.com",
  projectId: "proyecto-de-pruba-1",
  storageBucket: "proyecto-de-pruba-1.appspot.com",
  messagingSenderId: "733924276093",
  appId: "1:733924276093:web:cb4734f589a1773f3e3e14"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Obtener referencias a elementos del DOM
  const signUpForm = document.getElementById('signup-form');
  const successMessage = document.getElementById('success-message');
  const passwordResetForm = document.getElementById('password-reset-form');
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const chatContainer = document.getElementById('chat-container');
  const messagesContainer = document.getElementById('messages-container');
  const messageInput = document.getElementById('message-input');
  const imageFileInput = document.getElementById('image-file');
  const sendButton = document.getElementById('send-button');
  
  // Evento de envío del formulario de registro
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    // Obtener valores de los campos del formulario
    const username = document.getElementById('username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const profilePicture = document.getElementById('profile-picture').files[0];
    const age = document.getElementById('age').value;
    const country = document.getElementById('country').value;
    const interests = document.getElementById('interests').value;
  
    // Referencia al almacenamiento de Firebase
    const storage = firebase.storage();
    const storageRef = storage.ref();
  
    // Subir imagen de perfil a Firebase Storage
    const profilePictureRef = storageRef.child(`profile_pictures/${email}/${profilePicture.name}`);
    profilePictureRef.put(profilePicture)
      .then((snapshot) => {
        console.log('Imagen de perfil cargada exitosamente.');
  
        return snapshot.ref.getDownloadURL();
      })
      .then((profilePictureUrl) => {
        // Crear usuario en Firebase Authentication
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            user.updateProfile({
              displayName: username,
              photoURL: profilePictureUrl
            }).then(() => {
              console.log('Usuario registrado exitosamente.');
  
              signUpForm.style.display = 'none';
              successMessage.style.display = 'block';
  
              // Referencia a la base de datos de Firebase
              const database = firebase.database();
              const usersRef = database.ref('users');
  
              // Datos del perfil del usuario
              const userProfile = {
                username: username,
                email: email,
                profilePictureUrl: profilePictureUrl,
                age: age,
                country: country,
                interests: interests
              };
  
              // Guardar datos del perfil en Firebase Database
              usersRef.push(userProfile)
                .then(() => {
                  console.log('Datos del perfil guardados exitosamente.');
                  // Aquí puedes redirigir al usuario a otra página o realizar otras acciones
                })
                .catch((error) => {
                  console.error('Error al guardar los datos del perfil:', error);
                });
  
            }).catch((error) => {
              console.log(error.message);
            });
          })
          .catch((error) => {
            console.log(error.message);
          });
      })
      .catch((error) => {
        console.error('Error al cargar la imagen de perfil:', error);
      });
  });
  
  // Evento de envío del formulario de restablecimiento de contraseña
  passwordResetForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const resetEmail = document.getElementById('reset-email').value;
  
    firebase.auth().sendPasswordResetEmail(resetEmail)
      .then(() => {
        console.log('Se ha enviado un correo de restablecimiento de contraseña.');
      })
      .catch((error) => {
        console.log(error.message);
      });
  });
  
  // Evento de envío del formulario de inicio de sesión
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        signUpForm.style.display = 'none';
        successMessage.style.display = 'none';
        passwordResetForm.style.display = 'none';
        loginForm.style.display = 'none';
        errorMessage.style.display = 'none';
        chatContainer.style.display = 'block';
  
        const database = firebase.database();
        const messagesRef = database.ref('messages');
  
        // Escuchar nuevos mensajes agregados a Firebase Database
        messagesRef.on('child_added', (snapshot) => {
          const message = snapshot.val();
          displayMessage(message);
        });
      })
      .catch((error) => {
        errorMessage.style.display = 'block';
        console.log(error.message);
      });
  });
  
  // Evento de clic en el botón de enviar mensaje
  sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    const imageFile = imageFileInput.files[0];
  
    if (message !== '' || imageFile) {
      const user = firebase.auth().currentUser;
      const displayName = user.displayName;
      const photoURL = user.photoURL;
  
      const storage = firebase.storage();
      const storageRef = storage.ref();
  
      if (imageFile) {
        // Subir imagen adjunta a Firebase Storage
        const imageRef = storageRef.child(`images/${imageFile.name}`);
        imageRef.put(imageFile)
          .then((snapshot) => {
            console.log('Imagen cargada exitosamente.');
  
            return snapshot.ref.getDownloadURL();
          })
          .then((imageUrl) => {
            // Datos del mensaje
            const messageData = {
              message: message,
              imageUrl: imageUrl,
              displayName: displayName,
              photoURL: photoURL,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            };
  
            const database = firebase.database();
            const messagesRef = database.ref('messages');
  
            // Guardar mensaje en Firebase Database
            messagesRef.push(messageData)
              .then(() => {
                console.log('Mensaje enviado exitosamente.');
                messageInput.value = '';
                imageFileInput.value = null;
              })
              .catch((error) => {
                console.error('Error al enviar el mensaje:', error);
              });
          })
          .catch((error) => {
            console.error('Error al cargar la imagen:', error);
          });
      } else {
        // Datos del mensaje sin imagen adjunta
        const messageData = {
          message: message,
          displayName: displayName,
          photoURL: photoURL,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        };
  
        const database = firebase.database();
        const messagesRef = database.ref('messages');
  
        // Guardar mensaje en Firebase Database
        messagesRef.push(messageData)
          .then(() => {
            console.log('Mensaje enviado exitosamente.');
            messageInput.value = '';
            imageFileInput.value = null;
          })
          .catch((error) => {
            console.error('Error al enviar el mensaje:', error);
          });
      }
    }
  });
  
  // Función para mostrar un mensaje en el chat
  function displayMessage(message) {
    const { message: text, imageUrl, displayName, photoURL, timestamp } = message;
  
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
  
    if (displayName && photoURL) {
      const profilePictureElement = document.createElement('img');
      profilePictureElement.src = photoURL;
      profilePictureElement.alt = displayName;
      profilePictureElement.classList.add('profile-picture');
      messageElement.appendChild(profilePictureElement);
    }
  
    if (displayName) {
      const displayNameElement = document.createElement('h4');
      displayNameElement.innerText = displayName;
      messageElement.appendChild(displayNameElement);
    }
  
    if (text) {
      const textElement = document.createElement('p');
      textElement.innerText = text;
      messageElement.appendChild(textElement);
    }
  
    if (imageUrl) {
      const imageElement = document.createElement('img');
      imageElement.src = imageUrl;
      imageElement.alt = 'Imagen enviada';
      messageElement.appendChild(imageElement);
    }
  
    if (timestamp) {
      const timestampElement = document.createElement('span');
      timestampElement.innerText = formatTimestamp(timestamp);
      messageElement.appendChild(timestampElement);
    }
  
    messagesContainer.appendChild(messageElement);
  
    // Hacer scroll hacia abajo para mostrar el mensaje más reciente
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Función para formatear la marca de tiempo
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
  
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }
  