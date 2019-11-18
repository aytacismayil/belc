$(document).ready(function () {

	$('#datetimepicker').datetimepicker({
        format:'d.m.Y'
	});
	
	$('.form-email input[type="file"]').change(function(){
		var realname = $(this).val();
		var filename = realname.replace(/C:\\fakepath\\/,'');
		$(this).siblings('.upload').children('span').text(filename);
	})
	
    $('.submitExam').click(function (event) {
		
		var identity = $(this).parents('.form-checkout').attr('id');

        $('#' + identity + ' ' + '#exam_error').addClass('hidden');
        $('#' + identity + ' ' + '#exam_error').addClass('alert-warning');
        $('#' + identity + ' ' + '#exam_error').removeClass('alert-success');
        var error = 0;
        
		
        if ($('#' + identity + ' ' + '.exam_type').val() == 0) {
            $('#' + identity + ' ' + '#exam_error').removeClass('hidden');
            $('#' + identity + ' ' + '#exam_error').find('p').text('Lütfən seçim edin');
            error++;
            return false;
        } else if ($('#' + identity + ' ' + '.group').height()) {
            if ($('#' + identity + ' ' + '.group').val() == 0) {
                $('#' + identity + ' ' + '#exam_error').removeClass('hidden');
                $('#' + identity + ' ' + '#exam_error').find('p').text('Lütfən seçim edin');
                error++;
                return false;
            }
        } 
        
		 
        if(error==0) {
            var id = $(this).data('id');
            var data = {
                'id': $(this).data('id'),
                'select': $('#' + identity + ' ' + '.exam_type').val(),
                'type': $('#' + identity + ' ' + '.exam_type').data('type')
            }
			
            if ($('#' + identity + ' ' + '.group').val()) {
                data.group = $('#' + identity + ' ' + '.group').val();
            }
			
            $.ajax({
                url: 'exams/getexams',
                data: data,
                dataType: 'json',
                type: 'POST',
                success: function (data) {
					console.log(data);
                    if (data.success) {
                        $('#' + identity + ' ' + '#exam_error').removeClass('hidden');
                        $('#' + identity + ' ' + '#exam_error').removeClass('alert-warning');
                        $('#' + identity + ' ' + '#exam_error').addClass('alert-success');
                        $('#' + identity + ' ' + '#exam_error').find('p').text(data.msj );
                        $('#' + identity + ' ' + '#exam_error').find('p').append(' <a target="_blank" href="exams/ticket/' + id + '">İmtahana buraxılış vəsiqəsini çap etmək üçün tıklayın</a>')
                    } else {
                        $('#' + identity + ' ' + '#exam_error').removeClass('hidden');
                        $('#' + identity + ' ' + '#exam_error').find('p').text(data.msj);
                    }
                }
            });
        }
        event.preventDefault();
    });

    $('.date').mask('00-00-0000');
    $('.phone').mask('000-000 00 00');

    $('#qeydiyyat').submit(function (ev) {
        ev.preventDefault();
        $('#qeydiyyatMsj').addClass('hidden');
        $('#qeydiyyatMsj').find('p').empty();
        var data = {
            firstname: $('input[name=firstname]').val(),
            lastname: $('input[name=lastname]').val(),
            birthday: $('input[name=birthday]').val(),
            mail: $('input[name=mail]').val(),
            password: $('input[name=password]').val(),
            password_confirm: $('input[name=password_confirm]').val(),
            phone: $('input[name=phone]').val()
        };
        if (data.firstname && data.lastname && data.birthday && data.mail && data.password && data.phone) {
            if (data.password.length > 5) {
                if (data.password == data.password_confirm) {
                    $.ajax({
                        url: 'run_registration',
                        data: data,
                        type: 'POST',
                        dataType: 'json',
                        encode: true,
                        success: function (result) {
                            if (result.success) {
                                $('#qeydiyyat')[0].reset();
                                $('#qeydiyyatMsj').removeClass('hidden');
                                $('#qeydiyyatMsj').find('p').text(result.message);
                            } else {
                                $('#qeydiyyatMsj').removeClass('hidden');
                                $('#qeydiyyatMsj').find('p').text(result.message);
                            }
                        }
                    });
                } else {
                    $('#qeydiyyatMsj').removeClass('hidden');
                    $('#qeydiyyatMsj').find('p').text('Şifrə və şifrə təsdiqi eyni olmalıdır');
                }
            } else {
                $('#qeydiyyatMsj').removeClass('hidden');
                $('#qeydiyyatMsj').find('p').text('Şifrə ən azı 6 xarakter olmalıdır');
            }

        } else {
            $('#qeydiyyatMsj').removeClass('hidden');
            $('#qeydiyyatMsj').find('p').text('Boşluq buraxmayın');
        }

    });

    $('#inlogin').submit(function (ev) {
        ev.preventDefault();

        $('#loginError').addClass('hidden');
        $('#loginError').find('p').empty();

        var data = {
            email: $('input[name=email]').val(),
            password: $('input[name=password]').val()
        };
        if (data.email && data.password) {
            $.ajax({
                url: $(this).data('action'),
                data: data,
                type: 'POST',
                dataType: 'json',
                encode: true,
                success: function (result) {
                    if (result.success) {
                        $("#nextForm").trigger("click");
                        $('.form-body').height(324);
                    } else {
                        $('#loginError').removeClass('hidden');
                        $('#loginError').find('p').text(result.message);
                    }
                }
            });
        } else {
            $('.form-body').height(570);
            $('#loginError').removeClass('hidden');
            $('#loginError').find('p').text('Boşluq buraxmayın');
        }
    });

    $(".select2").select2();

});