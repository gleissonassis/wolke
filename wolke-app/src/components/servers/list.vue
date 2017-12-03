<template>
  <div>
    <button class="btn btn-primary" type="submit" v-on:click="addServer">Add new server</button>
    <table class="table">
      <thead>
        <tr>
          <th>Server</th>
          <th>Template</th>
          <th>Server Id (VOC)</th>
        </tr>
      </thead>
      <tbody >
        <table-item v-for="server in servers" :item="server" :key="server._id" />
      </tbody>
    </table>
  </div>
</template>

<script>
  import TableItem from './tableItem'

  export default {
    name: 'ServersList',
    components: {
      TableItem
    },
    data: function () {
      return {
        servers: []
      }
    },

    mounted: function () {
      this.update()
    },

    methods: {
      update: function () {
        var self = this
        $.get('/api/v1/servers', function (data) {
          self.servers = data.map(s => {
            s.isRemoved = false
            return s
          })
        })
      },

      addServer: function () {
        this.servers.push({
          isRemoved: false,
          name: '',
          templateId: '',
          serverId: ''
        })
      }
    }
  }
</script>
