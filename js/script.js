function goToPage(type) {
    
    switch(type) {
        case 1:
            window.location.href = "form1.html";
            break;
        case 2:
            window.location.href = "form2.html";
            break;
        case 3:
            window.location.href = "form3.html";
            break;
        case 4:
            window.location.href = "form4.html";
            break;
        case 5:
            window.location.href = "form5.html";
            break;
        default:
            alert("ประเภทคำร้องไม่ถูกต้อง");
    }
}

document.addEventListener('DOMContentLoaded', function() {

    const exampleButton = document.querySelector('.example');
    exampleButton.addEventListener('click', function() {
        
        window.location.href = 'xxx';
    });

    const cancelButton = document.querySelector('.cancel');
    cancelButton.addEventListener('click', function() {
        
        if (confirm('คุณต้องการยกเลิกหรือไม่?')) {
          
            document.querySelectorAll('input').forEach(input => input.value = '');
        }

        window.location.href = 'main.html';
    });
});