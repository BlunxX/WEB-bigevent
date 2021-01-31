$(function () {
  var layer = layui.layer

  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 为上传按钮绑定点击事件
  $('#btnChooseImage').on('click', function () {
    $('#file').click()
  })

  //文件选择框绑定change事件
  $('#file').on('change', function (e) {
    var filelist = e.target.files
    if (filelist.length === 0) {
      return layer.msg('请选择照片')

    }
    var file = e.target.files[0]//获取新的文件
    var imgURL = URL.createObjectURL(file)//将新的图片转化成路径
    $image.cropper('destroy')//销毁之前的裁剪区域
      .attr('src', imgURL)//加载新的图片路径
      .cropper(options)//重新渲染页面
  })
  //给提交按钮绑定事件
  $('#btnUpload').on('click', function () {
    //获取用户裁剪之后的图片
    var dataURL = $image.cropper('getCroppedCanvas', {
      width: 100,
      height: 100
    }).toDataURL('image/png')
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更换头像失败！')
        }
        layer.msg('更换头像成功！')
        window.parent.getUserInfo()
      }
    })
  })

})
