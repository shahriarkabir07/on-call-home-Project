const registerTab = document.getElementById('registerTab');
const loginTab = document.getElementById('loginTab');

const registerSection = document.getElementById('registerSection');
const loginSection = document.getElementById('loginSection');

const message = document.getElementById('message');


// =====================================================
// WORKER FIELDS
// =====================================================

function toggleWorkerFields() {

    const role = document.getElementById('role').value;

    const workerFields =
        document.getElementById('workerFields');

    workerFields.style.display =
        role === 'worker' ? 'block' : 'none';
}


// =====================================================
// LOGIN / REGISTER TABS
// =====================================================

registerTab.addEventListener('click', () => {

    registerTab.classList.add('active');
    loginTab.classList.remove('active');

    registerSection.classList.add('active');
    loginSection.classList.remove('active');

    message.textContent = '';
});


loginTab.addEventListener('click', () => {

    loginTab.classList.add('active');
    registerTab.classList.remove('active');

    loginSection.classList.add('active');
    registerSection.classList.remove('active');

    message.textContent = '';
});


// =====================================================
// REGISTER
// =====================================================

document.getElementById('registerBtn').addEventListener(
    'click',
    async () => {

        const userData = {

            fullName:
                document.getElementById('fullName').value.trim(),

            email:
                document.getElementById('email').value.trim(),

            password:
                document.getElementById('password').value.trim(),

            phone:
                document.getElementById('phone').value.trim(),

            role:
                document.getElementById('role').value,

            workerCategory:
                document.getElementById('workerCategory').value,

            workerRate:
                parseFloat(
                    document.getElementById('workerRate').value || 0
                )
        };


        // Basic validation

        if (
            !userData.fullName ||
            !userData.email ||
            !userData.password ||
            !userData.phone
        ) {

            message.style.color = 'red';

            message.textContent =
                'Please fill all fields';

            return;
        }


        // Worker validation

        if (
            userData.role === 'worker' &&
            userData.workerRate <= 0
        ) {

            message.style.color = 'red';

            message.textContent =
                'Please enter your service rate';

            return;
        }


        try {

            const result =
                await window.electronAPI.register(userData);


            message.style.color =
                result.success ? 'green' : 'red';

            message.textContent =
                result.message;


            if (result.success) {

                // Go to login tab

                loginTab.click();


                // Put registered email
                document.getElementById(
                    'loginEmail'
                ).value = userData.email;


                // Clear password

                document.getElementById(
                    'loginPassword'
                ).value = '';
            }

        } catch (error) {

            console.error(
                'REGISTER ERROR:',
                error
            );

            message.style.color = 'red';

            message.textContent =
                'Registration failed';
        }
    }
);


// =====================================================
// LOGIN
// =====================================================

document.getElementById('loginBtn').addEventListener(
    'click',
    async () => {

        const email =
            document.getElementById(
                'loginEmail'
            ).value.trim();

        const password =
            document.getElementById(
                'loginPassword'
            ).value.trim();


        // Validation

        if (!email || !password) {

            message.style.color = 'red';

            message.textContent =
                'Enter email and password';

            return;
        }


        try {

            const result =
                await window.electronAPI.login({
                    email: email,
                    password: password
                });


            if (!result || !result.success) {

                message.style.color = 'red';

                message.textContent =
                    result?.message ||
                    'Invalid email or password';

                return;
            }


            // =================================================
            // SAVE USER
            // =================================================

            localStorage.setItem(
                'user',
                JSON.stringify(result.user)
            );


            // =================================================
            // REDIRECT
            // =================================================

            if (result.user.role === 'worker') {

                window.location.href =
                    'worker.html';

            }

            else if (result.user.role === 'admin') {

                window.location.href =
                    'admin.html';

            }

            else {

                window.location.href =
                    'dashboard.html';
            }


        } catch (error) {

            console.error(
                'LOGIN ERROR:',
                error
            );

            message.style.color = 'red';

            message.textContent =
                'Login failed. Please try again.';
        }
    }
);