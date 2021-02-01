$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个参数查询对象 将请求餐宿对象提交服务器
    var q = {
        pagenum: 1,//页码
        pagesize: 2,//每页显示的数据值
        cate_id: '',//文章分类的ID
        state: ''//文章的状态
    }
    initTable()
    initCate()
    //获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }


        })
    }
    //渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',//页码
            count: total,//总的数据条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置默认选中的页面
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//页面排序
            limits: [2, 4, 6, 8, 10],//每页显示数量
            //
            jump: function (obj, first) {
                console.log(first);
                console.log(obj.curr);
                q.pagenum = obj.curr//新的页码赋值到q
                q.pagesize = obj.limit//新的页面条数 赋值到pagesize
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 删除文章
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {//len=1的时候 说明 页面上面只有任何数据了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1//页码的最小值为1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})