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
            $.ajax({
              url: 'http://localhost:5000/v1/templates/' + this.item._id,
              type: 'DELETE'
            })
            .always(function (r) {
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
          $.ajax({
            url: 'http://localhost:5000/v1/templates/' + this.item._id,
            type: 'PUT',
            data: this.item
          })
          .done(function () {
            self.$notify.success('The template has been updated successfully!')
          })
          .fail(function (r) {
            self.$notify.danger('An error has occurred while updating the template!\n\nStatus code: ' + r.status)
          })
        } else {
          $.ajax({
            url: 'http://localhost:5000/v1/templates',
            type: 'POST',
            data: this.item
          })
          .done(function () {
            self.$notify.success('The template has been created successfully!')
          })
          .fail(function (r) {
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
