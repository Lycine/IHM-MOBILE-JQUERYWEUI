function getTaskDetail() {
  var fd = new FormData();
  fd.append("tid", getCookie('tid'));
  $.ajax({
    type: "POST",
    url: "http://" + backendUrl + "/wechat/taskDetail",
    data: fd,
    crossDomain: true,
    async: false,
    processData: false,  // 不处理数据
    contentType: false,  // 不设置内容类型
    beforeSend: function () {
      $.showLoading('获取作业详情中');
    },
    complete: function () {
      setTimeout(function () {
        $.hideLoading();
      }, 500)
    },
    success: function (data) {
      if ("0" == data['status']) {
        $('#taskName').empty();
        $('#remark').empty();
        $('#taskStatus').empty();
        $('#deadLineString').empty();
        $('#taskId').empty();
        $('#x-amz-meta-task-name').empty();
        $('#x-amz-meta-user-name').empty();
        $.each(data['data'], function (i, result) {
          $('#taskName').text(result['taskName']);
          $('#remark').text(result['remark']);
          $('#taskStatus').text(result['taskStatus']);
          $('#deadLineString').text(result['deadLineString']);
          $('#taskId').text(result['id']);
          $('#x-amz-meta-task-name').val(result['taskName']);
          $('#x-amz-meta-user-name').val(result['stuName']);
        });
      } else {
        $.alert(data['info'], "");
      }
    },
    error: function () {
      $.toast("获取作业详情失败", "cancel", function (toast) {
      });
    }
  });
}

function submitUploadForm() {
  if ("" == $('#uploaderInput').val()) {
    $.toast("请上传图片", "cancel", function (toast) {
    });
  } else {
    var encodeUrl = window.btoa(document.referrer);
    if ("" == encodeUrl) {
      encodeUrl = '#';
    }
    console.log(document.referrer);
    console.log('encodeUrl: ' + encodeUrl);

    //suffix
    var uploaderSuffix = '.' + $('#uploaderInput').val().split(".").pop();
    //key
    $("#x-amz-meta-task-name").val(
        $("#taskName").text() +
        '__' +
        $("#x-amz-meta-user-name").val());
    $("#formKey").val(
        $("#x-amz-meta-task-name").val() +
        uploaderSuffix
    );
    //重定向链接
    $('#success_action_redirect').val(
        'http://' + backendUrl + '/wechat/taskUploadSuccess/' +
        $('#taskId').text() +
        '/' +
        $('#uploaderInput').val().split(".").pop() +
        '/?encodeUrl=' +
        encodeUrl
    )
    ;
    $('#updateTaskForm').submit();
  }
}

$(function () {
  if (checkSignInStatus()) {
    getTaskDetail();

    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
        $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
        $uploaderInput = $("#uploaderInput"),
        $uploaderFiles = $("#uploaderFiles");
    $uploaderInput.on("change", function (e) {
      var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
      for (var i = 0, len = files.length; i < len; ++i) {
        var file = files[i];

        if (url) {
          src = url.createObjectURL(file);
        } else {
          src = e.target.result;
        }


        if ($uploaderFiles.size == 0) {
          $uploaderFiles.append($(tmpl.replace('#url#', src)));
        } else {
          $uploaderFiles.empty();
          $uploaderFiles.append($(tmpl.replace('#url#', src)));
        }

      }
    });
    $uploaderFiles.on("click", "li", function () {
      $galleryImg.attr("style", this.getAttribute("style"));
      $gallery.fadeIn(100);
    });
    $gallery.on("click", function () {
      $gallery.fadeOut(100);
    });

    $('#showTooltips').on('click', function () {
      $('#showTooltips').unbind("click");
      submitUploadForm();
    });

  }
});