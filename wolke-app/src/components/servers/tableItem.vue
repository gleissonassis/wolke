<template>
  <tr v-show="!item.isRemoved">
    <td style="width: 300px">
      <confirm ref="confirm" title="Remove confirmation" message="Are you sure you want delete this item?" @close="closeModal" />
      <div class="input-group">
        <input type="text" class="form-control" v-model="item.name" aria-label="...">
        <div class="input-group-btn">
          <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>
          <ul class="dropdown-menu">
            <li><a href="#" v-on:click="save">Save</a></li>
            <li><a href="#" v-on:click="removeConfirm">Remove</a></li>
          </ul>
        </div>
      </div>
    </td>
    <td><combo-templates :item="item" /></td>
    <td>
      <servers-modal ref="servers" @close="selectServerId" />
      <div class="input-group">
        <input type="text" class="form-control" v-model="item.serverId" />
        <div class="input-group-btn">
          <button type="button" class="btn btn-default dropdown-toggle" @click="showSearchModal">
            <icon v-if="!isGettingServers" name="search" style="width: 15px; height: 15px"></icon>
            <icon v-if="isGettingServers" name="spinner" style="width: 15px; height: 15px" pulse></icon>
          </button>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
  import ComboTemplates from './comboTemplates'
  import Confirm from '../util/confirm'
  import ServersModal from '../util/serversModal'

  export default {
    props: ['item'],
    components: {
      Confirm,
      ComboTemplates,
      ServersModal
    },
    data: function () {
      return {
        isGettingServers: false
      }
    },
    methods: {
      showName: function () {
        var self = this
        alert(self.item.schedule.monday.startHour)
      },

      showSearchModal: function () {
        const self = this
        self.isGettingServers = true

        $.ajax({
          url: '/api/v1/actions/',
          type: 'POST',
          data: {
            action: 'list-servers'
          },
          dataType: 'json'
        })
        .done(function (r) {
          self.$refs.servers.show(r.servers)
          self.isGettingServers = false
        })
      },

      selectServerId: function (id) {
        if (id) {
          this.item.serverId = id
        }
      },

      closeModal: function (value) {
        if (value) {
          var self = this
          if (this.item._id) {
            $.ajax({
              url: '/api/v1/servers/' + this.item._id,
              type: 'DELETE'
            })
            .always(function (r) {
              if (r.status === 200) {
                self.$notify.success('The server has been removed successfully!')
                self.item.isRemoved = true
              }
            })
          } else {
            self.$notify.success('The item has been removed successfully!')
            this.item.isRemoved = true
          }
        }
      },

      save: function () {
        var self = this
        if (this.item._id) {
          $.ajax({
            url: '/api/v1/servers/' + this.item._id,
            type: 'PUT',
            data: this.item
          })
          .done(function () {
            self.$notify.success('The server has been updated successfully!')
          })
          .fail(function (r) {
            self.$notify.danger('An error has occurred while updating the server!\n\nStatus code: ' + r.status)
          })
        } else {
          $.ajax({
            url: '/api/v1/servers',
            type: 'POST',
            data: this.item
          })
          .done(function () {
            self.$notify.success('The server has been created successfully!')
          })
          .fail(function (r) {
            self.$notify.danger('An error has occurred while creating the server!\n\nStatus code: ' + r.status)
          })
        }
      },

      removeConfirm: function () {
        this.$refs.confirm.show()
      }
    }
  }
</script>
