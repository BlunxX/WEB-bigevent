$(function () {
  var layer = layui.layer
  var form = layui.form
  inicCate()
  initEditor()
  //
  function inicCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败')
        }
        //
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        //
        form.render()
      }
    })
  }
  //初始化图片裁剪
  var $image = $('#image')
  //裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  //初始化裁剪区域
  $image.cropper(options)
  //给封面按钮绑定事件
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })
  //监听coverfile的change事件  获取用户选中的文件
  $('#coverFile').on('change', function (e) {
    //获取文件列表数组
    console.log('IIOM');
    var files = e.target.files
    console.log(files);
    //判断用户是否选中文件
    if (files.length === 0) {
      return
    }
    //
    // 根据文件 创建url地址 转换base文件
    var newImgURL = URL.createObjectURL(files[0])
    //为裁剪区域重新设置文件
    $image
      .cropper('destroy')//销毁旧区域去
      .attr('src', newImgURL)//重新设置图片路径
      .cropper(options)//重新初始化裁剪区域
  })
  var art_state = '已发布'
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })
  //给表单绑定submit提交事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault()
    //基于form表单 创建一个formdata对象
    var fd = new FormData($(this)[0])
    //将文章发布状态 存到fd里面
    fd.append('state', art_state)
    //测试发布数据
    // fd.forEach(function (v, k) {
    //   console.log(k, v);
    // })
    //将裁剪之后的图片 输出为一个文件对象
    $image.cropper('getCroppedCanvas', {
      width: 400, height: 280//canvas画布
    })
      .toBlob(function (blob) {
        //将画布上的内容转换成文件对象 存储到fd
        fd.append('cover_img', blob)
        publishArticle(fd)
      })
  })
  //ajax 实现文章发布
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      //向服务器提交formdata时需要特别配置
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败')
        }
        layer.msg("发布文章成功")
        //成功之后 跳转到文章列表
        location.href = '/article/art_list.html'
      }
    })
  }
})