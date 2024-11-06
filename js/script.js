function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    usernameError.innerText = "";
    passwordError.innerText = "";

    let isValid = true; // ตัวแปรเพื่อตรวจสอบความถูกต้องทั้งหมด

    // ตรวจสอบความยาวของ username
    if (username.length !== 10) {
        usernameError.innerText = "Username ต้องมีความยาว 10 ตัวอักษร";
        usernameError.classList.add("error");  // เพิ่ม class error
        isValid = false;
    }else if (username[2] !== '0' || username[3] !== '9') {
        // ตรวจสอบว่าตัวอักษรที่ 3 เป็น '0' และตัวที่ 4 เป็น '9'
        usernameError.innerText = "Username ไม่ถูกต้อง";
        usernameError.classList.add("error"); 
        isValid = false;
    } else {
        usernameError.classList.remove("error");  // เอา class error ออกถ้าถูกต้อง
    }

    // ตรวจสอบความยาวของ password
    if (password.length !== 13) {
        passwordError.innerText = "Password ต้องมีความยาว 13 ตัวอักษร";
        passwordError.classList.add("error");  // เพิ่ม class error
        isValid = false;
    } else {
        passwordError.classList.remove("error");  // เอา class error ออกถ้าถูกต้อง
    }

    // ถ้ามี error ให้หยุดการทำงาน
    if (!isValid) return;

    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TU5ce4207d6fb3085aba32c5a74e72aa711e9e07ad870eb799d80eb6330f460223e6ddf0d1dabcfca1cf64daecc8900a42'
        },
        body: JSON.stringify({ "UserName" : username, "PassWord" : password })
    })
    .then(response => response.json())
    .then(data => {
        const messageElement = document.getElementById('message');
        
        if (data.status === true && data.message === 'Success') {

            localStorage.setItem('displayNameTH', data.displayname_th);

            window.location.href = 'main.html';
        } else {
            alert('ไม่พบบัญชีผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'); 

        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');

    });

}   

document.addEventListener('DOMContentLoaded', function() {

    const displayNameElement = document.getElementById('displayNameTH');
    if (displayNameElement) {
        const displayName = localStorage.getItem('displayNameTH');
        if (displayName) {
            document.querySelectorAll('#displayNameTH').forEach(element => {
                element.innerText = `${displayName}`;
            });
        }
    }
    
    if (window.location.pathname.includes('main.html')) {
        const logoutButton = document.querySelector('.logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
                    document.querySelectorAll('input').forEach(input => input.value = '');
                    window.location.href = 'login.html';
                }
            });
        }
    }

    if (['form1.html', 'form2.html', 'form3.html', 'form4.html', 'form5.html'].some(page => window.location.pathname.includes(page))) {
        const cancelButton = document.querySelector('.cancel');
        if (cancelButton) {
            cancelButton.addEventListener('click', function() {
                if (confirm('คุณต้องการยกเลิกหรือไม่?')) {
                    document.querySelectorAll('input').forEach(input => input.value = '');
                    window.location.href = 'main.html';
                }
            });
            
            const exampleButton = document.querySelector('.example');
            if (exampleButton) {
                exampleButton.addEventListener('click', function() {
                    let imageUrl;
                    if (window.location.pathname.includes('form1.html')) {
                        imageUrl = '../img/example1.png';
                    } else if (window.location.pathname.includes('form2.html')) {
                        imageUrl = '../img/example2.png';
                    } else if (window.location.pathname.includes('form3.html')) {
                        imageUrl = '../img/example3.png';
                    } else if (window.location.pathname.includes('form4.html')) {
                        imageUrl = '../img/example4.png';
                    } else if (window.location.pathname.includes('form5.html')) {
                        imageUrl = '../img/example5.png';
                    }

                    if (imageUrl) {
                        window.open(imageUrl, '_blank', 'noopener,noreferrer'); // เปิดภาพในแท็บใหม่
                    }
                });
            }
        }
   
    }
});
