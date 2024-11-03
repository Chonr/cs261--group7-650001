document.addEventListener('DOMContentLoaded', function() {

    const  logoutButton = document.querySelector('.logout');
    logoutButton.addEventListener('click', function() {
        
        if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
          
            document.querySelectorAll('input').forEach(input => input.value = '');
        }

        window.location.href = 'index.html';
    });

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