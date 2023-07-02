
  // Tu configuración de Firebase
  const firebaseConfig = {
    // Agrega tu configuración de Firebase aquí
  };

  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);

  const signUpForm = document.getElementById('signup-form');
  const successMessage = document.getElementById('success-message');

  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Crear cuenta de usuario
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Actualizar el nombre de usuario
        userCredential.user.updateProfile({
          displayName: username
        }).then(() => {
          // Registro exitoso
          console.log('Usuario registrado con éxito.');

          // Mostrar el mensaje de éxito y ocultar el formulario
          signUpForm.style.display = 'none';
          successMessage.style.display = 'block';
        }).catch((error) => {
          console.log(error.message);
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  });

  const passwordResetForm = document.getElementById('password-reset-form');
  passwordResetForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const resetEmail = document.getElementById('reset-email').value;

    // Enviar correo de restablecimiento de contraseña
    firebase.auth().sendPasswordResetEmail(resetEmail)
      .then(() => {
        // Correo de restablecimiento enviado
        console.log('Se ha enviado un correo de restablecimiento de contraseña.');
      })
      .catch((error) => {
        console.log(error.message);
      });
  });

  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Autenticar al usuario con Firebase
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        // Redirigir al usuario a otro sitio web
        window.location.href = 'chat 2 personas.html';
      })
      .catch((error) => {
        // Mostrar mensaje de error
        loginError.textContent = error.message;
        loginError.style.display = 'block';
      });
  });

