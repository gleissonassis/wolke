<template>
  <tr v-show="!item.isRemoved">
    <td style="width: 200px">
      <confirm ref="confirm" title="Remove confirmation" message="Are you sure you want delete this item?" @close="closeModal" />
      <div class="input-group">
        <input type="text" class="form-control" v-model="item.name" aria-label="...">
        <div class="input-group-btn">
          <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>
          <ul class="dropdown-menu">
            <li><a href="#" v-on:click="save">Save</a></li>
            <li><a href="#" v-on:click="removeConfirm">Remove</a></li>
          </ul>
        </div><!-- /btn-group -->
      </div><!-- /input-group -->
    </td>
  </tr>
</template>

<script type="text/javscript">
  import Item from './item'
  import Confirm from '../util/confirm'

  export default {
    props: ['item'],
    components: {
      ServerItem: Item,
      Confirm
    },
    methods: {
      showName: function () {
        var self = this
        alert(self.item.schedule.monday.startHour)
      },

      closeModal: function (value) {
        if (value) {
          var self = this
          if (this.item._id) {
            this.$http.delete('/api/v1/templates/' + this.item._id)
            .then(function (r) {
              if (r.status === 200) {
                self.item.isRemoved = true
                self.$notify.success('The server has been removed successfully!')
              }
            })
          } else {
            this.item.isRemoved = true
            self.$notify.success('The item has been removed successfully!')
          }
        }
      },

      save: function () {
        var self = this
        if (this.item._id) {
          this.$http.put('/api/v1/templates/' + this.item._id, this.item)
          .then(function () {
            self.$notify.success('The template has been updated successfully!')
          }, function (r) {
            self.$notify.danger('An error has occurred while updating the template!\n\nStatus code: ' + r.status)
          })
        } else {
          this.$http.post('/api/v1/templates', this.item)
          .then(function () {
            self.$notify.success('The template has been created successfully!')
          }, function (r) {
            self.$notify.danger('An error has occurred while creating the template!\n\nStatus code: ' + r.status)
          })
        }
      },

      removeConfirm: function () {
        this.$refs.confirm.show()
      }
    }
  }
</script>
