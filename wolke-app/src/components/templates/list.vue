<template>
  <div>
    <confirm ref="confirm" title="Remove confirmation" message="Are you sure you want delete this item?" @close="closeModalRemoveItem" />
    <router-link class="btn btn-primary" to="/templates/new">Add new template</router-link>
    <table class="table">
      <thead>
        <tr>
          <th>Template</th>
          <th style="width: 100px">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="item._id" v-for="item in items" :item="item">
          <td>
            {{ item. name }}
          </td>
          <td>
            <div class="btn-group" role="group" aria-label="...">
              <router-link class="btn btn-default" :to="{path: '/templates/' + item._id}"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></router-link>
              <button type="button" class="btn btn-default" title="Remove the template" v-on:click="remove(item)"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>
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
        $.get('/api/v1/templates', function (data) {
          self.items = data
        })
      },

      closeModalRemoveItem: function (value) {
        const self = this
        if (value) {
          if (self.currentItem._id) {
            $.ajax({
              url: '/api/v1/templates/' + self.currentItem._id,
              type: 'DELETE'
            })
            .always(function (r) {
              if (r.status === 200) {
                self.$notify.success('The server has been removed successfully!')
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
