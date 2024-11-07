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
