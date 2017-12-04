<template>
  <div>
    <confirm ref="confirm" title="Remove confirmation" message="Are you sure you want delete this item?" @close="closeModalRemoveItem" />
    <router-link class="btn btn-primary" to="/tasks/new">Add new task</router-link>
    <table class="table">
      <thead>
        <tr>
          <th>Task</th>
          <th>Minute</th>
          <th>Hour</th>
          <th>Week day</th>
          <th>Month</th>
          <th>Year</th>
          <th style="width: 100px">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="item._id" v-for="item in items" :item="item">
          <td>
            {{ item.description }}
          </td>
          <td>
            {{ item.minute }}
          </td>
          <td>
            {{ item.hour }}
          </td>
          <td>
            {{ item.day }}
          </td>
          <td>
            {{ item.month }}
          </td>
          <td>
            {{ item.year }}
          </td>
          <td>
            <div class="btn-group" role="group" aria-label="...">
              <router-link class="btn btn-default" :to="{path: '/tasks/' + item._id}"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></router-link>
              <button type="button" v-if="!item.templateId" class="btn btn-default" title="Remove the task" v-on:click="remove(item)"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>
              <button type="button" v-if="item.templateId" class="btn btn-default" disabled title="Remove the task"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import Confirm from '../util/confirm'

  export default {
    components: {
      Confirm
    },

    data: function () {
      return {
        items: []
      }
    },

    mounted: function () {
      this.update()
    },

    methods: {
      update: function () {
        var self = this
        this.$http.get('/api/v1/tasks')
          .then(function (r) {
            self.items = r.body
          })
      },

      closeModalRemoveItem: function (value) {
        const self = this
        if (value) {
          if (self.currentItem._id) {
            this.$http.delete('/api/v1/tasks/' + self.currentItem._id)
              .then(function (r) {
                if (r.status === 200) {
                  self.$notify.success('The task has been removed successfully!')
                  self.items = self.items
                    .filter(i => i !== self.currentItem)
                }
              })
          }
        }
      },

      remove (item) {
        this.currentItem = item
        this.$refs.confirm.show()
      }
    }
  }
</script>
