function skipToTabs() {
  window.location.href = 'tabs.html';
}

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

$(function () {
  if ("" != getCookie('uid')) {
    $.modal({
      title: "监测到登录信息",
      text: "是否自动登录？",
      buttons: [
        {text: "否", className: "default"},
        {
          text: "是", onClick: function () {
            signIn()
            skipToTabs();
          }
        },
      ]
    });
  }
});
