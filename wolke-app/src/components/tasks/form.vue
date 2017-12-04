<template>
  <div>
    <confirm ref="confirm" title="Remove confirmation" message="Are you sure you want delete this task?" @close="closeModal" />

    <div class="panel panel-default">
      <div class="panel-heading ">Task
          <div class="btn-group btn-group-xs pull-right" role="group" aria-label="...">
            <button type="button" class="btn btn-primary" v-if="!item.templateId" title="Save the task" v-on:click="saveChanges"><span class="glyphicon glyphicon-floppy-disk" /></button>
            <button type="button" class="btn btn-primary" v-if="item.templateId" disabled="true" title="Save the task"><span class="glyphicon glyphicon-floppy-disk" /></button>
            <button type="button" class="btn btn-primary" title="Duplicate the task" @click="duplicateItem"><span class="glyphicon glyphicon-share-alt" /></button>
            <button type="button" class="btn btn-primary" v-if="!item.templateId" title="Remove the task" @click="removeItem"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>
            <button type="button" class="btn btn-primary" v-if="item.templateId" disabled="true" title="Remove the task"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></button>
        </div>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="description">Description</label>
              <input type="text" class="form-control" :disabled="item.templateId" v-model="item.description" id="description" placeholder="Task description">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="description">Action</label>
              <select class="form-control" v-model="action" :disabled="item.templateId">
                <option value=""></option>
                <option value="turnon-server">Turn on server</option>
                <option value="turnoff-server">Turn off server</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="description">Server</label>
              <select class="form-control" v-model="item.serverId" :disabled="item.templateId">
                <option value="">Select a value...</option>
                <option value="turnon-server" v-for="server in servers" :value="server._id">{{ server.name }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <table class="table">
              <thead>
                <tr>
                  <th>Minute</th>
                  <th>Hour</th>
                  <th>Week day</th>
                  <th>Month</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="text" v-model="item.minute" :disabled="item.templateId" class="form-control" /></td>
                  <td><input type="text" v-model="item.hour" :disabled="item.templateId" class="form-control" /></td>
                  <td>
                    <select class="form-control" :disabled="item.templateId" v-model="item.day">
                      <option value="*">All</option>
                      <option value="0">Sunday</option>
                      <option value="1">Monday</option>
                      <option value="2">Tuesday</option>
                      <option value="3">Wednesday</option>
                      <option value="4">Thurday</option>
                      <option value="5">Friday</option>
                      <option value="6">Starday</option>
                    </select>
                  </td>
                  <td><input type="text" v-model="item.month" :disabled="item.templateId" class="form-control" /></td>
                  <td><input type="text" v-model="item.year" :disabled="item.templateId" class="form-control" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-12">
            <div class="pull-right">
              <router-link class="btn btn-default" to="/tasks"><span class="glyphicon glyphicon-circle-arrow-left" /> Discard changes</router-link>
              <button type="button" class="btn btn-primary" v-if="!item.templateId" title="Save the template" v-on:click="saveChanges"><span class="glyphicon glyphicon-floppy-disk" /> Save changes</button>
              <button type="button" class="btn btn-primary" v-if="item.templateId" disabled="true" title="Save the template" v-on:click="saveChanges"><span class="glyphicon glyphicon-floppy-disk" /> Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Confirm from '../util/confirm'

  export default {
    data: function () {
      return {
        item: {},
        servers: [],
        action: ''
      }
    },

    components: {
      Confirm
    },

    mounted: function () {
      this.update()
    },

    methods: {
      update () {
        const id = this.$route.params.id
        const self = this

        if (id) {
          this.$http.get('/api/v1/tasks/' + id)
            .then(function (r) {
              self.item = r.body

              var command = self.item.command.split(';')
              self.action = command[0]

              if (self.item.templateId) {
                self.$notify.warning('This task can\'t be modified!')
              }
            })
        }

        this.$http.get('/api/v1/servers')
        .then(function (r) {
          self.servers = r.body
        })
      },

      addNewScheduling () {
        this.item.schedule.push({})
      },

      closeModal: function (value) {
        const self = this

        if (value) {
          this.$http.delete('/api/v1/tasks/' + this.item._id)
            .then(function (r) {
              if (r.status === 200) {
                self.$notify.success('The task has been removed successfully!')
                self.$router.push({ path: `/tasks` })
              }
            })
        }
      },

      removeItem: function () {
        this.$refs.confirm.show()
      },

      duplicateItem: function () {
        const self = this

        delete this.item._id
        delete this.item.templateId

        this.item.description = `Duplicated from ${this.item.description}`

        this.$http.post('/api/v1/tasks', this.item)
          .then(function (r) {
            self.$notify.success('The task has been duplicated successfully!')
            self.$router.push({ path: `/tasks/${r.body._id}` })
          }, function (r) {
            self.$notify.danger('An error has occurred while duplicating the task!\n\nStatus code: ' + r.status)
          })
      },

      saveChanges: function () {
        var self = this
        this.item.command = this.action + ';' + this.item.serverId
        if (this.item._id) {
          this.$http.put('/api/v1/tasks/' + this.item._id, this.item)
          .then(function () {
            self.$notify.success('The task has been updated successfully!')
          }, function (r) {
            self.$notify.danger('An error has occurred while updating the task!\n\nStatus code: ' + r.status)
          })
        } else {
          this.$http.post('/api/v1/tasks', this.item)
          .then(function (r) {
            self.item._id = r.body._id
            self.$notify.success('The task has been created successfully!')
          }, function (r) {
            self.$notify.danger('An error has occurred while creating the task!\n\nStatus code: ' + r.status)
          })
        }
      }
    }
  }
</script>
