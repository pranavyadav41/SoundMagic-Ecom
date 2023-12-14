document.querySelectorAll('.unlist-button').forEach((button) => {
    button.addEventListener('click', () => {
        let id = button.getAttribute('data-product-id');
        console.log(id);
        let currentState = button.getAttribute('data-state')
        let url;

        if (currentState == 'Unlisted') {
            url = `/admin/list-product/${id}`

        } else {
            url = `/admin/unlist-product/${id}`
        }
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.message) {
                if (currentState == 'Unlisted') {
                    button.setAttribute('data-state', 'Listed')
                    button.textContent = 'UnList'
                    button.classList.replace('btn-danger', 'btn-success')

                } else {
                    button.setAttribute('data-state', 'Unlisted')
                    button.textContent = 'List'
                    button.classList.replace('btn-success', 'btn-danger')

                }

            }
        }).catch(error => {
            console.log(error);
        })

    })
})
