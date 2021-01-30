$(function () {
    getUserInfo()
})
var layer = layui.layer
//获取用户信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data)//渲染用户头像
            console.log(res);
        }
    })
}
//用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $(".text-avatar").hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}
//推出功能
$('#btnLogout').on('click', function () {
    layer.confirm('真的要离开吗？', { icon: 3, title: '提示' }, function (index) {
        localStorage.removeItem('token')
        location.href = '/login.html'
        layer.cloes(index)
    })
})