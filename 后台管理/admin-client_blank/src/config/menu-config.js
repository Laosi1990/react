const menuList = [
  {
    title: '首页',
    key:'/home',
    icon: 'home'
  },
  {
    title: '商品',
    key:'/product',
    icon: 'appstore',
    children: [
      {
        title: '商品分类',
        key:'/categorys',
        icon: 'bars',
      },
      {
        title: '商品管理',
        key:'/products',
        icon: 'tool',
      },
    ]
  },
  {
    title: '用户管理',
    key:'/user',
    icon: 'user',
  },
  {
    title: '角色管理',
    key:'/role',
    icon: 'tool',
  },
  {
    title: '图形图标',
    key:'/chart',
    icon: 'bar-chart',
    children: [
      {
        title: '柱状图',
        key:'/bar',
        icon: 'bars',
      },
      {
        title: '折线图',
        key:'/line',
        icon: 'tool',
      },
      {
        title: '饼状图',
        key:'/pie',
        icon: 'tool',
      },
    ]
  }
]
export default menuList;