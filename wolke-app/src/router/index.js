import Vue from 'vue'
import Router from 'vue-router'

import ServersList from '../components/servers/list'
import TemplatesList from '../components/templates/list'
import TemplateForm from '../components/templates/form'
import TasksList from '../components/tasks/list'
import TasksForm from '../components/tasks/form'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: ServersList
    },
    {
      path: '/servers',
      component: ServersList
    },
    {
      path: '/templates',
      component: TemplatesList
    },
    {
      path: '/templates/new',
      component: TemplateForm
    },
    {
      path: '/templates/:id',
      component: TemplateForm
    },
    {
      path: '/tasks',
      component: TasksList
    },
    {
      path: '/tasks/new',
      component: TasksForm
    },
    {
      path: '/tasks/:id',
      component: TasksForm
    }
  ]
})
