import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  // home
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/home"),
        meta: {
          title: "首页概览",
          icon: "dashboard"
        }
      }
    ]
  },
  // 检测驾驶舱 - 车间（管理员或车间主管）
  {
    path: "/control-leader-shop",
    name: "control-leader-shop",
    meta: {
      icon: "controlCabin",
      title: "驾驶舱"
    },
    component: () => import("@/views/6inspector/controlCabin.vue")
  },
  // 检测员
  {
    path: "/inspect",
    name: "inspect",
    component: Layout,
    children: [
      {
        path: "inspector",
        name: "inspector",
        meta: {
          title: "检测员",
          icon: "people"
        },
        component: () => import("@/views/1inspector/inspector.vue")
      }
    ]
  },
  // 任务派发
  {
    path: "/task",
    name: "task",
    component: Layout,
    children: [
      {
        path: "distribute",
        name: "distribute",
        meta: {
          title: "当前任务",
          icon: "task"
        },
        component: () => import("@/views/8taskManage/taskDistribution.vue")
      }
    ]
  },
  // 检测列表
  {
    path: "/electric",
    name: "electric",
    component: Layout,
    children: [
      {
        path: "electricSearch",
        name: "electricSearch",
        meta: {
          title: "检测列表",
          icon: "chart"
        },
        component: () => import("@/views/2systemManage/electricSearch.vue")
      }
    ]
  },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [{
  //     path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //     meta: {
  //       title: 'External Link',
  //       icon: 'link'
  //     }
  //   }]
  // },

  // 404 page must be placed at the end !!!
  {
    path: "*",
    redirect: "/404",
    hidden: true
  }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
