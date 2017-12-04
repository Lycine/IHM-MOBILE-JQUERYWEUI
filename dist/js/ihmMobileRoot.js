function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

function setCookie(c_name, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + escape(value) +
      ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

function signIn() {
  $('input').blur();
  var fd = new FormData();
  var url = "http://" + backendUrl + "/wechat/signIn";
  fd.append("email", $('#email').val());
  fd.append("password", $('#password').val());
  $.ajax({
    url: url,
    type: "POST",
    data: fd,
    async: false,
    crossDomain: true,
    processData: false,
    contentType: false,
    beforeSend: function () {
      $.showLoading('登录中');
    },
    complete: function () {
    },
    success: function (data) {
      if ("0" == data['status']) {
        setCookie('uid', data['uid'], 7200);
        skipToTabs();
        $.hideLoading();
      } else {
        $.hideLoading();
        $.toptip(data['info'], 'error');
      }
    },
    error: function () {
      $.toast("登录失败", "cancel", function (toast) {
        $.hideLoading();
      });
    }
  });
}

function checkSignInStatus() {
  if ("" == getCookie('uid')) {
    signIn()
    $.modal({
      title: "未登录",
      text: "",
      buttons: [
        {
          text: "重新登录", onClick: function () {
            window.location.href = 'index.html';
          }
        }
      ]
    });
    return false;
  } else {
    return true;
  }
}

FastClick.attach(document.body);