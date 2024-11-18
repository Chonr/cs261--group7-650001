let loginAttempts = 0; // ตัวแปรนับจำนวนครั้งที่ล็อกอินผิดพลาด
let isLocked = false; // สถานะการล็อกบัญชี
let lockCountdown = null; // ตัวแปรเก็บ interval สำหรับการนับถอยหลัง
let remainingTime = 0; // เวลาที่เหลือสำหรับการล็อก
let lockDuration = 30; // ระยะเวลาล็อกเริ่มต้น (วินาที)

// ฟังก์ชันเรียกใช้เมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    const messageElement = document.getElementById('message');
    const storedLockEndTime = localStorage.getItem('lockEndTime');
    const currentTime = Date.now();

    if (storedLockEndTime && currentTime < storedLockEndTime) {
        // ยังคงล็อกอยู่
        remainingTime = Math.ceil((storedLockEndTime - currentTime) / 1000);
        isLocked = true;

        messageElement.innerHTML = `บัญชีของคุณถูกล็อก <span id="lockTimer">${remainingTime}</span> วินาที`;
        messageElement.style.color = "red";

        startCountdown(); // เริ่มนับถอยหลัง
    }
});

function handleLoginAttempt(success) {
    const messageElement = document.getElementById('message');

    if (isLocked) {
        alert("บัญชีของคุณถูกล็อก โปรดลองใหม่ในภายหลัง");
        return false;
    }

    if (!success) {
        loginAttempts++;

        if (loginAttempts >= 5) {
            // ล็อกบัญชีเมื่อผิดพลาดเกิน 5 ครั้ง
            isLocked = true;
            remainingTime = lockDuration; // ตั้งค่าระยะเวลาล็อก
            const lockEndTime = Date.now() + remainingTime * 1000; // เวลาสิ้นสุดการล็อก
            localStorage.setItem('lockEndTime', lockEndTime); // บันทึกเวลาสิ้นสุดใน LocalStorage

            messageElement.innerHTML = `บัญชีของคุณถูกล็อก <span id="lockTimer">${remainingTime}</span> วินาที`;
            messageElement.style.color = "red";

            startCountdown(); // เริ่มนับถอยหลัง
        } else {
            // แสดงข้อความ "ล็อกอินผิดพลาด" และเปลี่ยนสี
            messageElement.innerHTML = `<span>ล็อกอินผิดพลาด</span> คุณเหลือโอกาสอีก <span>${5 - loginAttempts}</span> ครั้ง`;
            messageElement.style.color = "red";
        }
        return false;
    } else {
        if (isLocked) {
            alert("บัญชีของคุณถูกล็อก โปรดลองใหม่ในภายหลัง");
            return false;
        } else {
            loginAttempts = 0; // รีเซ็ตตัวนับเมื่อสำเร็จ
            lockDuration = 30; // รีเซ็ตระยะเวลาล็อกเป็นค่าเริ่มต้น
            localStorage.removeItem('lockEndTime'); // ลบข้อมูลการล็อกใน LocalStorage
            messageElement.innerText = ""; // ลบข้อความแจ้งเตือน
            return true;
        }
    }
}

function startCountdown() {
    const messageElement = document.getElementById('message');

    if (lockCountdown) {
        clearInterval(lockCountdown); // ป้องกันการซ้อนของตัวจับเวลา
    }

    lockCountdown = setInterval(() => {
        remainingTime--;
        if (remainingTime <= 0) {
            clearInterval(lockCountdown);
            lockCountdown = null;
            isLocked = false;
            loginAttempts = 0; // รีเซ็ตจำนวนครั้งที่พยายามล็อกอิน
            lockDuration += 30; // เพิ่มระยะเวลาล็อกครั้งถัดไปอีก 10 วินาที
            messageElement.innerText = ""; // ลบข้อความเมื่อปลดล็อก
            localStorage.removeItem('lockEndTime'); // ลบข้อมูลการล็อกใน LocalStorage
        } else {
            document.getElementById('lockTimer').innerText = remainingTime;
        }
    }, 1000);
}

function submitLogin() {
    if (isLocked) {
        alert("บัญชีของคุณถูกล็อก โปรดลองใหม่ในภายหลัง");
        return;
    }

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
    if (!isValid) {
        handleLoginAttempt(false);
        return;
    }

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
            localStorage.setItem('username', data.username);

            window.location.href = 'form/main.html';
        } else {
            handleLoginAttempt(false);

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

    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            // ตรวจสอบประเภทของ input ว่าตอนนี้เป็น password หรือ text
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text'; // เปลี่ยนเป็น type text เพื่อแสดงรหัสผ่าน
                togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>'; // เปลี่ยนไอคอนเป็นซ่อนรหัสผ่าน
            } else {
                passwordInput.type = 'password'; // เปลี่ยนกลับเป็น type password เพื่อซ่อนรหัสผ่าน
                togglePassword.innerHTML = '<i class="fas fa-eye"></i>'; // เปลี่ยนไอคอนเป็นแสดงรหัสผ่าน
            }
        });
    }
    
    if (window.location.pathname.includes('main.html')) {
        const logoutButton = document.querySelector('.logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
                    document.querySelectorAll('input').forEach(input => input.value = '');
                    window.location.href = '../login.html';
                }
            });
        }
    }

    // ปุ่ม status และ main navigation
    const statusButton = document.getElementById('statusButton');
    const mainButton = document.getElementById('mainButton');

    if (statusButton) {
        statusButton.addEventListener('click', function () {
            window.location.href = 'status.html';
        });
    }

    if (mainButton) {
        mainButton.addEventListener('click', function () {
            window.location.href = 'main.html';
        });
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

        const studentName = document.getElementById('studentName');
        const studentId = document.getElementById('studentId');
        const studentNameError = document.getElementById('studentNameError');
        const studentIdError = document.getElementById('studentIdError');

        // Retrieve stored values
        const storedDisplayName = localStorage.getItem('displayNameTH');
        const storedUsername = localStorage.getItem('username');

        // ตรวจสอบ studentName ทันทีเมื่อพิมพ์
        studentName.addEventListener('input', function() {
        if (studentName.value !== storedDisplayName) {
            studentNameError.innerText = "ชื่อและนามสกุลไม่ตรงกัน";
            studentNameError.classList.add("error");
        } else {
            studentNameError.innerText = "";
            studentNameError.classList.remove("error");
        }
        });

        // ตรวจสอบ studentId ทันทีเมื่อพิมพ์
        studentId.addEventListener('input', function() {
        if (studentId.value !== storedUsername) {
            studentIdError.innerText = "เลขทะเบียนไม่ตรงกัน";
            studentIdError.classList.add("error");
        } else {
            studentIdError.innerText = "";
            studentIdError.classList.remove("error");
        }
        });
   
    }
});

function validateForm() {
    const inputs = document.querySelectorAll('input[required], select[required], input[type="checkbox"][required], input[type="radio"][required]');
    let isValid = true;

    // ลบข้อความผิดพลาดเก่าที่ไม่ได้เกี่ยวข้องกับกลุ่มที่มีปัญหา
    document.querySelectorAll('.error-message').forEach(error => {
        // ให้ลบเฉพาะ error ที่ไม่เกี่ยวข้องกับกลุ่มที่มีการตรวจสอบในครั้งนี้
        error.remove();
    });

    // ตรวจสอบช่อง input ที่มี attribute required
    inputs.forEach(input => {
        // ตรวจสอบช่อง text และ select
        if ((input.type === 'text' || input.tagName.toLowerCase() === 'select' || input.type === 'tel' || input.type === 'email') && input.value.trim() === '') {
            showError(input, 'กรุณากรอกข้อมูลในช่องนี้');
            isValid = false;
        }

        // ตรวจสอบช่อง checkbox
        if (input.type === 'checkbox') {
            const checkboxes = document.querySelectorAll(`input[name="${input.name}"][required]`);
            const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
            if (!isChecked) {
                showCheckboxError(input, 'กรุณาเลือกอย่างน้อยหนึ่งตัวเลือก');
                isValid = false;
            }
        }

        // ตรวจสอบช่อง radio
        if (input.type === 'radio') {
            const radioGroup = document.querySelectorAll(`input[name="${input.name}"][required]`);
            const isRadioSelected = Array.from(radioGroup).some(radio => radio.checked);
            if (!isRadioSelected) {
                showRadioError(input, 'กรุณาเลือกตัวเลือก');
                isValid = false;
            }
        }
    });

    return isValid;
}

// ฟังก์ชันสำหรับแสดงข้อความผิดพลาดใต้แต่ละช่อง
function showError(element, message) {
    const errorMessage = document.createElement('span');
    errorMessage.className = 'error-message';
    errorMessage.style.color = 'red';
    errorMessage.textContent = message;
    element.classList.add('error');
    element.insertAdjacentElement('afterend', errorMessage);
}

// ฟังก์ชันสำหรับแสดงข้อความ error สำหรับ checkbox group
function showCheckboxError(element, message) {
    const checkboxGroup = document.querySelector(`input[name="${element.name}"]`).closest('.checkbox-group');
    if (!checkboxGroup.querySelector('.error-message')) {
        const errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.style.color = 'red';
        errorMessage.textContent = message;
        checkboxGroup.appendChild(errorMessage); // แสดงข้อความผิดพลาดใต้กลุ่ม checkbox
    }
}

// ฟังก์ชันสำหรับแสดงข้อความ error สำหรับ radio group
function showRadioError(element, message) {
    const radioGroup = document.querySelector(`input[name="${element.name}"]`).closest('.radio-group');
    if (!radioGroup.querySelector('.error-message')) {
        const errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.style.color = 'red';
        errorMessage.textContent = message;
        radioGroup.appendChild(errorMessage); // แสดงข้อความผิดพลาดใต้กลุ่ม radio
    }
}

