$(document).ready(function () {
    /* edit parte por defecto en false */
    let edit = false;

    console.log("JQuery is Working");
    $('#task-result').hide();
    fetchTask()

    $('#search').keyup(function() {
        let search = $('#search').val();
        if(search == '') {
            $('#task-result').hide();
        }
        if(search) {
            $.ajax({
                type: "POST",
                url: "./backend/task-search.php",
                data: { search },
                success: function (response) {
                    let tasks = JSON.parse(response)
                    let template = ''
                    tasks.forEach(task => {
                        template += `
                            <li>${task.name}</li>
                        `
                        $('#task-result').show();
                        $('#container').html(template)
                    });
                                    
                }
            });
        }
    })

    $('#task-form').submit((e)=>{
        e.preventDefault();
        let postData = {
            id: $('#taskId').val(),
            name: $('#name').val(),
            description: $('#description').val()
        }

        let url = edit === false ? './backend/task-add.php' : './backend/task-edit.php';
        /*  si edit = false, los datos se envían a task-add.php y se agrega la nueva tarea,
            si edit = true, los datos se envían a task-edit.php para que se modifiquen los 
            datos 
        */

        $.post(url, postData, (response)=>{
            $('#task-form').trigger('reset');
            fetchTask()
            console.log(response);
            edit = false;
        })
    });

    function fetchTask() {
        $.ajax({
            type: "GET",
            url: "./backend/task-list.php",
            success: function (response) {
                let tasks = JSON.parse(response);
                let template = '';
    
                tasks.forEach(task => {
                    // se agrega una propiedad de nombre taskId con el valor task.id
                    template += `
                        <tr taskId="${task.id}"> 
                            <td>${task.id}</td>
                            <td>
                                <a href="#" class="task-item">
                                    ${task.name}
                                </a>
                            </td>
                            <td>${task.description}</td>
                            <td>
                                <button class="task-delete btn btn-danger">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    `
                });
                $('#tasks').html(template);
            }
        });
    }
    /* En el documento vamos  escuchar el evento click de todos los elementos
    *  que tengan la clase task-delete */
    $(document).on("click", '.task-delete', function() {
        if(confirm('Are you sure you want to delete it?')){
            const element = $(this)[0].parentElement.parentElement;
            let id = $(element).attr('taskId');
            
            $.post('./backend/task-delete.php', {id}, function(response) { // la variable se envía como un objeto
                console.log(response);
                fetchTask()
            });
        }
    })

    $(document).on('click', '.task-item', function() {
        let element = $(this)[0].parentElement.parentElement;
        let id = $(element).attr('taskId');
        /* Con el método post vamos a llamar servidor (archivo task-single.php) y le vamos a 
           enviar la id y luego con una función le vamos a capturar la respuesta del servidor */
        $.post('./backend/task-single.php', {id}, function(response) {
            const task = JSON.parse(response);
            $('#taskId').val(task.id)
            $('#name').val(task.name)
            $('#description').val(task.description)
            edit = true;
            /* si se envían los datos para su modificacion 'edit' cambia a true y con esto
               se va a la comprobación para ver si se modifica o se agrega una nueva tarea */
        })
    })

});