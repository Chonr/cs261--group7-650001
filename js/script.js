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
                        imageUrl = '../img/example5.png';
                    } else if (window.location.pathname.includes('form2.html')) {
                        imageUrl = '../img/example4.png';
                    } else if (window.location.pathname.includes('form3.html')) {
                        imageUrl = '../img/example3.png';
                    } else if (window.location.pathname.includes('form4.html')) {
                        imageUrl = '../img/example2.png';
                    } else if (window.location.pathname.includes('form5.html')) {
                        imageUrl = '../img/example1.png';
                    }

                    if (imageUrl) {
                        window.open(imageUrl, '_blank', 'noopener,noreferrer'); // เปิดภาพในแท็บใหม่
                    }
                });
            }
        }
   
    }
});

const uploadBox = document.getElementById("upload-box");
const fileInput = document.getElementById("upload-docs");
const fileList = document.getElementById("file-list");
const addFileBtn = document.getElementById("add-file-btn");

let allFiles = []; // Array to hold all selected files

// Show file details and add a remove button for each file
function updateFileDisplay() {
    fileList.innerHTML = ""; // Clear current display

    allFiles.forEach((file, index) => {
        const fileItem = document.createElement("div");
        fileItem.classList.add("file-item");

        // File icon or preview
        const fileIcon = document.createElement("img");
        fileIcon.classList.add("file-icon");
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                fileIcon.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            fileIcon.src = "img/File Icon.png"; // Default icon path
        }
        fileIcon.alt = "File Icon";
        fileItem.appendChild(fileIcon);

        // File details
        const fileDetails = document.createElement("div");
        const fileName = document.createElement("p");
        fileName.textContent = `ชื่อไฟล์: ${file.name}`;
        fileDetails.appendChild(fileName);
        const fileSize = document.createElement("p");
        fileSize.textContent = `ขนาดไฟล์: ${(file.size / 1024).toFixed(2)} KB`;
        fileDetails.appendChild(fileSize);
        fileItem.appendChild(fileDetails);

        // Remove button for each file
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "ลบไฟล์";
        removeBtn.classList.add("remove-btn");
        removeBtn.addEventListener("click", () => {
            allFiles.splice(index, 1); // Remove file from array
            updateFileDisplay(); // Update display
        });
        fileItem.appendChild(removeBtn);

        // Add file item to the list
        fileList.appendChild(fileItem);
    });

    // Update background color based on file count
    if (allFiles.length > 0) {
        uploadBox.classList.add("has-files");
        uploadBox.classList.remove("has-no-files");
    } else {
        uploadBox.classList.add("has-no-files");
        uploadBox.classList.remove("has-files");
        fileList.innerHTML = "<p>ไม่มีไฟล์ที่เลือก</p>";
    }
}

// Add files to the list when selected
function handleFileSelection(files) {
    // Convert FileList to Array and add to allFiles
    const newFiles = Array.from(files);
    allFiles = allFiles.concat(newFiles);

    updateFileDisplay();
}

// Event listeners for add file button and drag-and-drop
addFileBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    handleFileSelection(fileInput.files);
    fileInput.value = ""; // Reset file input for the next selection
});

// Drag-and-drop functionality
uploadBox.addEventListener("dragover", (event) => {
    event.preventDefault();
    uploadBox.classList.add("drag-over");
});

uploadBox.addEventListener("dragleave", () => {
    uploadBox.classList.remove("drag-over");
});

uploadBox.addEventListener("drop", (event) => {
    event.preventDefault();
    uploadBox.classList.remove("drag-over");
    handleFileSelection(event.dataTransfer.files); // Add dropped files
});
