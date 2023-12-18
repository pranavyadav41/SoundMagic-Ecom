document.querySelectorAll('.action-button').forEach((button) => {
    button.addEventListener('click', () => {
        let userID = button.getAttribute('data-user-id');
        let currentState = button.getAttribute('data-state');
        let actionText = currentState == 'Unblocked' ? 'Block' : 'Unblock';

        // Show SweetAlert confirmation
        Swal.fire({
            title: `Are you sure you want to ${actionText}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Proceed with the action
                let url = currentState == 'Unblocked' ? `/admin/block-user/${userID}` : `/admin/unblock-user/${userID}`;

                fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    return response.json();
                }).then(data => {
                    if (data.message) {
                        // Update button state based on the response
                        if (currentState == 'Unblocked') {
                            button.setAttribute('data-state', 'Blocked');
                            button.textContent = 'Unblock';
                            button.classList.replace('btn-danger', 'btn-success');
                        } else {
                            button.setAttribute('data-state', 'Unblocked');
                            button.textContent = 'Block';
                            button.classList.replace('btn-success', 'btn-danger');
                        }
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        });
    });
});
     