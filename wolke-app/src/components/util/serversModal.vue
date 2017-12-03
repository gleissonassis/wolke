<template>
  <div class="modal" ref="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Available servers on VOC</h4>
      </div>
      <div class="modal-body">
        <table class="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Server</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody >
            <tr v-for="server in servers" :item="server" :key="server.id">
              <td>
                {{ server.id }}
              </td>
              <td>
                {{ server.name }}
              </td>
              <td>
                <button type="button" class="btn btn-primary" title="Duplicate the task" @click="selectItem(server.id)"><span class="glyphicon glyphicon-share-alt" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" @click="closeModalCancel">Cancel</button>
        <button type="button" class="btn btn-primary" @click="closeModalOk">Ok</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    data: function () {
      return {
        servers: []
      }
    },
    methods: {
      show: function (servers) {
        this.servers = servers
        $(this.$refs.modal).modal('show')
      },

      closeModalOk: function () {
        $(this.$refs.modal).modal('hide')
        this.$emit('close', null)
      },

      selectItem: function (id) {
        $(this.$refs.modal).modal('hide')
        this.$emit('close', id)
      },

      closeModalCancel: function () {
        $(this.$refs.modal).modal('hide')
        this.$emit('close', null)
      }
    }
  }
</script>
