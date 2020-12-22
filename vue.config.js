module.exports = {
    //添加配置选项
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        //设置主题
                        'font-size-common': '14px',
                        'font-weight-common': 'lighter'
                    },
                    javascriptEnabled: true,
                },
            },
        },
    },
}